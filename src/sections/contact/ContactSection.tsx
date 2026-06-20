"use client";

import { useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/constants";
import type { ApiResponse, Message } from "@/types";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const payload = (await response.json()) as ApiResponse<Message>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Unable to send message." : payload.error);
      }

      setStatus("success");
      setFeedback("Message sent. I will get back to you soon.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send message.");
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Contact"
          title="Have a project, role, or collaboration in mind?"
          description="Send a clear note and I will respond with next steps. The form stores messages securely in MongoDB for the admin dashboard."
        />

        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <Reveal>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-2xl font-black text-white">Let us build something useful.</h3>
              <p className="mt-4 leading-7 text-slate-300">
                I am interested in full-stack work, product dashboards, portfolio-grade interfaces,
                and systems that need both clean data and clean UX.
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="Project, role, or collaboration"
                />
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  required
                  placeholder="Tell me what you want to build..."
                />
              </div>

              {feedback ? (
                <p
                  className={`mt-4 rounded-md px-4 py-3 text-sm ${
                    status === "success"
                      ? "border border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                      : "border border-rose-300/25 bg-rose-300/10 text-rose-100"
                  }`}
                >
                  {feedback}
                </p>
              ) : null}

              <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
