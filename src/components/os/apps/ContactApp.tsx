"use client";

import { useState, type FormEvent } from "react";
import { Mail, Send, Copy, Check } from "lucide-react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import type { ApiResponse } from "@/types";
import type { AppProps } from "../OSContext";
import { SocialIcon } from "../SocialIcon";
import { AppSection, AppSurface } from "./appShared";

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactApp({ openApp }: AppProps) {
  const { profile } = usePublicProfile();
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const email = profile.email || "";
  const collegeEmail = (profile.collegeEmail || "").trim();
  const otherEmail = (profile.otherEmail || "").trim();
  const phone = (profile.phone || "").trim();

  async function copyEmail(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied((current) => (current === label ? "" : current)), 1800);
    } catch {
      setCopied("");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
      company: String(formData.get("company") || "")
    };

    if (!payload.name.trim() || !payload.email.trim() || !payload.message.trim()) {
      setError("Please fill in your name, email, and a message.");
      setState("error");
      return;
    }

    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as ApiResponse<unknown>;

      if (!result.success) {
        throw new Error(result.error);
      }

      form.reset();
      setState("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Message failed to send.");
      setState("error");
    }
  }

  return (
    <AppSurface>
      <AppSection title="Get in touch" hint="Messages are stored in the admin dashboard's inbox">
        <form className="os-form" onSubmit={onSubmit} noValidate={false}>
          {/* Honeypot for basic spam resistance */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="os-form__honeypot" aria-hidden="true" />
          <div className="os-form__row">
            <label className="os-form__field">
              <span>Name</span>
              <input name="name" required minLength={2} autoComplete="name" />
            </label>
            <label className="os-form__field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
          </div>
          <label className="os-form__field">
            <span>Subject</span>
            <input name="subject" defaultValue="Portfolio inquiry" />
          </label>
          <label className="os-form__field">
            <span>Message</span>
            <textarea name="message" required minLength={10} rows={6} placeholder="Tell me about the role, project, or question…" />
          </label>
          <div className="os-form__footer">
            <button type="submit" className="os-btn os-btn--primary os-interactive" disabled={state === "sending"}>
              <Send className="h-4 w-4" aria-hidden="true" />
              {state === "sending" ? "Sending…" : "Send message"}
            </button>
          </div>
          <div aria-live="polite" className="os-form__status">
            {state === "success" && (
              <p className="os-form__status--success">Message sent. Thank you — I read every note.</p>
            )}
            {state === "error" && error && (
              <p className="os-form__status--error" role="alert">
                {error}
              </p>
            )}
          </div>
        </form>
      </AppSection>

      <AppSection title="Direct channels">
        <div className="os-chip-row">
          {email && (
            <a className="os-btn os-btn--ghost os-interactive" href={`mailto:${email}`}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {email}
            </a>
          )}
          {collegeEmail && (
            <a className="os-btn os-btn--ghost os-interactive" href={`mailto:${collegeEmail}`}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {collegeEmail}
            </a>
          )}
          {otherEmail && (
            <a className="os-btn os-btn--ghost os-interactive" href={`mailto:${otherEmail}`}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {otherEmail}
            </a>
          )}
          {phone && (
            <a className="os-btn os-btn--ghost os-interactive" href={`tel:${phone}`}>
              {phone}
            </a>
          )}
        </div>
        <div className="os-chip-row">
          {email && (
            <button
              type="button"
              className="os-btn os-btn--ghost os-interactive"
              onClick={() => void copyEmail("email", email)}
            >
              {copied === "email" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied === "email" ? "Copied" : "Copy email"}
            </button>
          )}
          {collegeEmail && (
            <button
              type="button"
              className="os-btn os-btn--ghost os-interactive"
              onClick={() => void copyEmail("collegeEmail", collegeEmail)}
            >
              {copied === "collegeEmail" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied === "collegeEmail" ? "Copied" : "Copy college email"}
            </button>
          )}
          {otherEmail && (
            <button
              type="button"
              className="os-btn os-btn--ghost os-interactive"
              onClick={() => void copyEmail("otherEmail", otherEmail)}
            >
              {copied === "otherEmail" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied === "otherEmail" ? "Copied" : "Copy other email"}
            </button>
          )}
        </div>
        {copied && (
          <p className="os-form__status--success" role="status">
            Copied to clipboard.
          </p>
        )}
        {profile.socials.length > 0 && (
          <div className="os-chip-row">
            {profile.socials.map((link) => (
              <SocialIcon key={`${link.label}-${link.href}`} link={link} variant="row" />
            ))}
          </div>
        )}
      </AppSection>

      <AppSection title="Looking for my work?">
        <div className="os-chip-row">
          <button
            type="button"
            className="os-btn os-btn--ghost os-interactive"
            onClick={() => openApp("projects")}
          >
            Open projects
          </button>
          <button
            type="button"
            className="os-btn os-btn--ghost os-interactive"
            onClick={() => openApp("resume")}
          >
            Open resume
          </button>
        </div>
      </AppSection>
    </AppSurface>
  );
}
