import bcrypt from "bcryptjs";
import { fail, handleRouteError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { localStore } from "@/lib/local-store";
import { sendPasswordResetOtp } from "@/lib/mail";
import User from "@/models/User";
import { siteConfig } from "@/constants";

export const runtime = "nodejs";

// In-memory OTP storage: email -> { code: string, expiresAt: number }
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action || "change");

    // ==========================================
    // ACTION 1: Change Password (When logged in)
    // ==========================================
    if (action === "change") {
      const session = requireAdmin(request);
      if (!session) {
        return fail("Unauthorized", 401);
      }

      const currentPassword = String(body.currentPassword || "");
      const newPassword = String(body.newPassword || "");

      if (!currentPassword || !newPassword) {
        return fail("Both current and new password are required.", 400);
      }

      if (newPassword.length < 6) {
        return fail("New password must be at least 6 characters long.", 400);
      }

      if (!process.env.MONGODB_URI) {
        const storedHash = await localStore.getPasswordHash();
        const envPassword = process.env.ADMIN_PASSWORD;

        let isCurrentValid = false;
        if (storedHash) {
          isCurrentValid = await bcrypt.compare(currentPassword, storedHash);
        } else if (envPassword) {
          isCurrentValid = currentPassword === envPassword;
        }

        if (!isCurrentValid) {
          return fail("Current password is incorrect.", 400);
        }

        const newHash = await bcrypt.hash(newPassword, 12);
        await localStore.updatePasswordHash(newHash);

        return ok(null, "Password updated successfully.");
      }

      await connectToDatabase();
      const user = await User.findById(session.id).select("+passwordHash");

      if (!user) {
        return fail("Admin user not found.", 404);
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, user.get("passwordHash") as string);
      if (!isCurrentValid) {
        return fail("Current password is incorrect.", 400);
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      user.set("passwordHash", newHash);
      await user.save();

      return ok(null, "Password updated successfully.");
    }

    // ==========================================
    // ACTION 2: Request OTP (Forgot password on login)
    // ==========================================
    if (action === "request_otp") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) {
        return fail("Email is required.", 400);
      }

      const configuredAdminEmail = (process.env.ADMIN_EMAIL || siteConfig.email).toLowerCase();

      let targetUserEmail = "";

      if (!process.env.MONGODB_URI) {
        if (email !== configuredAdminEmail) {
          return fail("This email is not registered as the admin email.", 404);
        }
        targetUserEmail = configuredAdminEmail;
      } else {
        await connectToDatabase();
        const user = await User.findOne({ email });
        if (!user && email !== configuredAdminEmail) {
          return fail("This email is not registered as the admin email.", 404);
        }
        targetUserEmail = user ? user.email : configuredAdminEmail;
      }

      // Generate 6-digit OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      otpStore.set(targetUserEmail, { code: otpCode, expiresAt });

      // Send to email
      const mailResult = await sendPasswordResetOtp({
        email: targetUserEmail,
        otpCode
      });

      console.log(`[Password Reset] OTP for ${targetUserEmail}: ${otpCode} (Expires in 10m)`);

      return ok(
        {
          delivered: mailResult.delivered,
          devCode: process.env.NODE_ENV !== "production" ? otpCode : undefined
        },
        mailResult.delivered
          ? `A 6-digit verification code has been sent to ${targetUserEmail}.`
          : `Verification code generated. (If SMTP is not configured yet, check your server console or use your Master SESSION_SECRET).`
      );
    }

    // ==========================================
    // ACTION 3: Reset Password (Using OTP or Master Secret)
    // ==========================================
    if (action === "reset") {
      const email = String(body.email || "").trim().toLowerCase();
      const newPassword = String(body.newPassword || "");
      const otp = String(body.otp || "").trim();
      const masterSecret = String(body.masterSecret || "").trim();

      if (!email || !newPassword) {
        return fail("Email and new password are required.", 400);
      }

      if (newPassword.length < 6) {
        return fail("New password must be at least 6 characters long.", 400);
      }

      let isAuthorized = false;

      // 1. Check OTP
      const storedOtp = otpStore.get(email);
      if (storedOtp && otp && storedOtp.code === otp && Date.now() <= storedOtp.expiresAt) {
        isAuthorized = true;
        otpStore.delete(email);
      }

      // 2. Or check Master Secret (SESSION_SECRET from environment variables)
      const expectedSecret = process.env.SESSION_SECRET;
      if (!isAuthorized && masterSecret && expectedSecret && masterSecret === expectedSecret) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        return fail("Invalid or expired verification code (or invalid master secret).", 400);
      }

      const newHash = await bcrypt.hash(newPassword, 12);

      if (!process.env.MONGODB_URI) {
        await localStore.updatePasswordHash(newHash);
        return ok(null, "Password reset successfully. You can now login with your new password.");
      }

      await connectToDatabase();
      let user = await User.findOne({ email }).select("+passwordHash");

      if (!user) {
        // If first-time user never logged in before, create them with new password
        user = await User.create({
          name: siteConfig.name,
          email,
          passwordHash: newHash,
          role: "admin",
          resumeUrl: siteConfig.resumeUrl,
          socials: siteConfig.email ? [] : []
        });
      } else {
        user.set("passwordHash", newHash);
        await user.save();
      }

      return ok(null, "Password reset successfully. You can now login with your new password.");
    }

    return fail("Unknown action.", 400);
  } catch (error) {
    return handleRouteError(error);
  }
}
