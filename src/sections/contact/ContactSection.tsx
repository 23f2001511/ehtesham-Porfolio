"use client";

import Link from "next/link";
import { Check, Clipboard, Code2, Github, Linkedin, Send } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/constants";
import type { ApiResponse, Message } from "@/types";

const initialState = { name: "", email: "", subject: "", message: "" };

function ContactEmailRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3">
      <span className="w-28 text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <a
        href={`mailto:${value}`}
        className="min-w-0 truncate text-sm font-medium text-foreground hover:text-primary"
      >
        {value}
      </a>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label} email`}
          className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
          ) : (
            <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
        <Link
          href={`mailto:${value}`}
          aria-label={`Email ${label}`}
          className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await response.json()) as ApiResponse<Message>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Unable to send message." : payload.error);
      }

      setStatus("success");
      setFeedback("Message sent. I will get back to you soon.");
      setForm(initialState);
    } catch (caught) {
      setStatus("error");
      setFeedback(caught instanceof Error ? caught.message : "Unable to send message.");
    }
  }

  const inputBusy = status === "loading";

  return (
    <section id="contact" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Contact"
          title="Have a project, role, or collaboration in mind?"
          description="Drop a message through the form or reach out directly — I typically respond within 24 hours."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Info column */}
          <Reveal>
            <div className="panel h-full p-6 sm:p-7">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Let&rsquo;s build something useful together.
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                I&rsquo;m interested in full-stack engineering roles, freelance builds, data products, and
                anytime someone wants to talk shop.
              </p>

              <ul className="mt-6 space-y-2.5">
                <ContactEmailRow label="Personal" value={siteConfig.email} />
                <ContactEmailRow label="College" value={siteConfig.collegeEmail} />
                <ContactEmailRow label="IITM" value={siteConfig.otherEmail} />
              </ul>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Elsewhere</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`https://github.com/${siteConfig.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    GitHub
                  </Link>
                  <Link
                    href={siteConfig.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                    LinkedIn
                  </Link>
                  <Link
                    href={`https://leetcode.com/u/${siteConfig.leetcodeUsername}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    <Code2 className="h-4 w-4" aria-hidden="true" />
                    LeetCode
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal delay={0.08}>
            {status === "success" && !feedback.includes("send another") ? (
              <div className="panel flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-secondary/40 bg-secondary/10 text-secondary">
                  <Check className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feedback}</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Your message is stored locally with this portfolio — I&rsquo;ll reply as soon as I see it.
                </p>
                <Button variant="outline" size="sm" onClick={() => setFeedback("send another message")}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="panel h-full p-6 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      required
                      disabled={inputBusy}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      required
                      disabled={inputBusy}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input
                    id="contact-subject"
                    value={form.subject}
                    onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                    disabled={inputBusy}
                    placeholder="Project, role, or collaboration"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    required
                    disabled={inputBusy}
                    placeholder="Tell me what you want to build..."
                  />
                </div>

                {feedback && status === "error" ? (
                  <p className="mt-4 rounded-md border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                    {feedback}
                  </p>
                ) : null}

                {status === "success" && feedback === "send another message" ? (
                  <p className="mt-4 rounded-md border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm text-emerald-100">
                    The previous message is on its way. This one will send a new message.
                  </p>
                ) : null}

                <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={inputBusy}>
                  {status === "loading" ? "Sending…" : "Send message"}
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
