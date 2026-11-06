import nodemailer from "nodemailer";

type ContactEmailPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

type PasswordResetPayload = {
  email: string;
  otpCode: string;
};

const DEFAULT_RECIPIENT = "alamehtesham88@gmail.com";

function getMailConfig() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.ADMIN_EMAIL || DEFAULT_RECIPIENT;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || DEFAULT_RECIPIENT;
  const resendApiKey = process.env.RESEND_API_KEY || "";

  return {
    host,
    port,
    user,
    pass,
    recipient,
    resendApiKey,
    isSmtpConfigured: Boolean(user && pass),
    isResendConfigured: Boolean(resendApiKey)
  };
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{ delivered: boolean; error?: string }> {
  const config = getMailConfig();

  const formattedSubject = `[Portfolio Contact] ${payload.subject?.trim() || "New Inquiry"} from ${payload.name}`;
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0f19; color: #f1f5f9; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        📬 New Portfolio Contact Message
      </h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; width: 90px; font-weight: 600;">From:</td>
          <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${payload.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${payload.email}" style="color: #38bdf8; text-decoration: none;">${payload.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Subject:</td>
          <td style="padding: 8px 0; color: #ffffff;">${payload.subject || "Portfolio inquiry"}</td>
        </tr>
      </table>

      <div style="margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; line-height: 1.6; white-space: pre-wrap; font-size: 15px; color: #e2e8f0;">
        ${payload.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 13px; color: #64748b;">
        You can reply directly to this email to respond to <a href="mailto:${payload.email}" style="color: #38bdf8;">${payload.email}</a>.
      </div>
    </div>
  `;

  // 1. Try Resend if configured
  if (config.isResendConfigured) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [config.recipient],
          reply_to: payload.email,
          subject: formattedSubject,
          html: htmlBody
        })
      });

      if (response.ok) {
        return { delivered: true };
      }
      console.warn("[Mail] Resend error:", await response.text());
    } catch (err) {
      console.error("[Mail] Resend send failed:", err);
    }
  }

  // 2. Try SMTP / Gmail if configured
  if (config.isSmtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass
        }
      });

      await transporter.sendMail({
        from: `"${payload.name} (via Portfolio)" <${config.user}>`,
        replyTo: payload.email,
        to: config.recipient,
        subject: formattedSubject,
        html: htmlBody,
        text: `From: ${payload.name} <${payload.email}>\nSubject: ${payload.subject}\n\n${payload.message}`
      });

      return { delivered: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "SMTP transport error";
      console.error("[Mail] SMTP error sending contact mail:", errorMsg);
      return { delivered: false, error: errorMsg };
    }
  }

  console.warn(
    "[Mail] Neither SMTP (SMTP_PASS / GMAIL_APP_PASSWORD) nor RESEND_API_KEY is configured. Contact message was saved in database, but email notification could not be delivered to",
    config.recipient
  );

  return { delivered: false, error: "Email credentials not configured." };
}

export async function sendPasswordResetOtp(payload: PasswordResetPayload): Promise<{ delivered: boolean; error?: string }> {
  const config = getMailConfig();

  const formattedSubject = `🔐 Your Portfolio Admin Password Reset Code`;
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0b0f19; color: #f1f5f9; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px;">Admin Password Reset</h2>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
        You recently requested to reset the admin password for your portfolio. Use the verification code below to complete the reset.
      </p>
      
      <div style="margin: 24px 0; text-align: center;">
        <span style="display: inline-block; padding: 14px 28px; background: rgba(56, 189, 248, 0.12); border: 1px solid #38bdf8; border-radius: 8px; font-mono; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #38bdf8;">
          ${payload.otpCode}
        </span>
      </div>

      <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
        This code is valid for 10 minutes. If you did not request this reset, you can safely ignore this email.
      </p>
    </div>
  `;

  if (config.isResendConfigured) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [payload.email],
          subject: formattedSubject,
          html: htmlBody
        })
      });

      if (response.ok) return { delivered: true };
    } catch (err) {
      console.error("[Mail] Resend OTP error:", err);
    }
  }

  if (config.isSmtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass
        }
      });

      await transporter.sendMail({
        from: `"Portfolio Admin Security" <${config.user}>`,
        to: payload.email,
        subject: formattedSubject,
        html: htmlBody,
        text: `Your Portfolio Admin password reset code is: ${payload.otpCode}. It expires in 10 minutes.`
      });

      return { delivered: true };
    } catch (err) {
      return { delivered: false, error: err instanceof Error ? err.message : "SMTP transport error" };
    }
  }

  return { delivered: false, error: "Email credentials not configured." };
}
