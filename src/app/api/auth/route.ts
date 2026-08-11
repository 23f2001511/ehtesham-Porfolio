import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { clearSessionCookie, createSessionToken, requireAdmin, setSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { localStore } from "@/lib/local-store";
import { loginSchema, profileSchema } from "@/lib/validators";
import User from "@/models/User";
import { siteConfig, socialLinks } from "@/constants";
import type { UserProfile } from "@/types";
import { serializeDocument } from "@/utils/serialize";

export const runtime = "nodejs";

const fallbackProfile: UserProfile = {
  name: siteConfig.name,
  email: siteConfig.email,
  role: "admin",
  resumeUrl: siteConfig.resumeUrl,
  socials: socialLinks
};

function sanitizeUser(user: unknown): UserProfile {
  const data = serializeDocument<UserProfile & { passwordHash?: string }>(user);
  delete data.passwordHash;

  return {
    id: data.id,
    name: data.name || siteConfig.name,
    email: data.email || siteConfig.email,
    role: "admin",
    resumeUrl: data.resumeUrl || siteConfig.resumeUrl,
    socials: data.socials?.length ? data.socials : socialLinks,
    tagline: data.tagline || "",
    aboutBio: data.aboutBio || "",
    phone: data.phone || "",
    location: data.location || "",
    githubUsername: data.githubUsername || "",
    leetcodeUsername: data.leetcodeUsername || "",
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : []
  };
}

async function getPublicProfile() {
  if (!process.env.MONGODB_URI) {
    return localStore.getProfile();
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });
    return user ? sanitizeUser(user) : fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export async function GET(request: Request) {
  const scope = new URL(request.url).searchParams.get("scope");

  if (scope === "public-profile") {
    const profile = await getPublicProfile();
    return ok(profile);
  }

  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  if (!process.env.MONGODB_URI) {
    const profile = await localStore.getProfile();
    return ok(profile);
  }

  try {
    await connectToDatabase();
    const user = await User.findById(session.id);

    if (!user) {
      return fail("Admin user was not found.", 404);
    }

    return ok(sanitizeUser(user));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());

    if (!process.env.MONGODB_URI) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        return fail("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.", 500);
      }

      if (body.email !== adminEmail || body.password !== adminPassword) {
        return fail("Invalid email or password.", 401);
      }

      const profile = await localStore.getProfile();
      const token = createSessionToken({
        id: profile.id || "local-admin",
        email: profile.email,
        role: "admin"
      });
      const response = ok(profile, "Logged in successfully");
      setSessionCookie(response, token);

      return response;
    }

    await connectToDatabase();

    let user = await User.findOne({ email: body.email }).select("+passwordHash");

    if (!user) {
      const envEmail = process.env.ADMIN_EMAIL;
      const envPassword = process.env.ADMIN_PASSWORD;

      if (!envEmail || !envPassword || body.email !== envEmail || body.password !== envPassword) {
        return fail("Invalid email or password.", 401);
      }

      const passwordHash = await bcrypt.hash(envPassword, 12);
      user = await User.create({
        name: siteConfig.name,
        email: envEmail,
        passwordHash,
        role: "admin",
        resumeUrl: siteConfig.resumeUrl,
        socials: socialLinks
      });
    }

    const passwordHash = user.get("passwordHash") as string;
    const isValid = await bcrypt.compare(body.password, passwordHash);

    if (!isValid) {
      return fail("Invalid email or password.", 401);
    }

    const token = createSessionToken({
      id: String(user._id),
      email: user.email,
      role: "admin"
    });

    const response = ok(sanitizeUser(user), "Logged in successfully");
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  try {
    const body = profileSchema.parse(await request.json());

    if (!process.env.MONGODB_URI) {
      const profile = await localStore.updateProfile({
        resumeUrl: body.resumeUrl,
        socials: body.socials,
        tagline: body.tagline,
        aboutBio: body.aboutBio,
        phone: body.phone,
        location: body.location,
        githubUsername: body.githubUsername,
        leetcodeUsername: body.leetcodeUsername,
        experience: body.experience,
        education: body.education
      });

      return ok(profile, "Profile updated successfully");
    }

    await connectToDatabase();

    const updates: Record<string, unknown> = {};

    if (typeof body.resumeUrl === "string") {
      updates.resumeUrl = body.resumeUrl;
    }

    if (Array.isArray(body.socials)) {
      updates.socials = body.socials;
    }

    const scalarKeys = [
      "tagline",
      "aboutBio",
      "phone",
      "location",
      "githubUsername",
      "leetcodeUsername"
    ] as const;

    for (const key of scalarKeys) {
      if (typeof body[key] === "string") {
        updates[key] = body[key];
      }
    }

    if (Array.isArray(body.experience)) {
      updates.experience = body.experience;
    }

    if (Array.isArray(body.education)) {
      updates.education = body.education;
    }

    const user = await User.findByIdAndUpdate(session.id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return fail("Admin user was not found.", 404);
    }

    return ok(sanitizeUser(user), "Profile updated successfully");
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    data: null,
    message: "Logged out successfully"
  });

  clearSessionCookie(response);

  return response;
}
