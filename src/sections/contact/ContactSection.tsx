"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import { siteConfig } from "@/constants";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-pad">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <motion.p
              className="font-mono text-sm font-medium text-primary"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              06. What&rsquo;s Next?
            </motion.p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Get In Touch
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Have a project in mind, an opportunity, or just want to say hi? Send me a message and it will land directly in my inbox.
            </p>
          </Reveal>
        </div>

        {/* Contact Form Card */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 max-w-xl">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8"
            >
              {status === "success" && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div className="text-sm">
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="mt-1 text-emerald-300/80">Thank you for reaching out. I will get back to you as soon as possible.</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                  <div className="text-sm">
                    <p className="font-semibold">Failed to send message</p>
                    <p className="mt-1 text-rose-300/80">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-primary focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-primary focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity / Collaboration"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-primary focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hello Ehtesham, I'd like to talk about..."
                    className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-primary focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/60 bg-primary/10 px-6 py-3 font-mono text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/20 hover:shadow-[0_0_25px_rgba(79,156,255,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-center text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>Or email directly to</span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {siteConfig.email}
                </a>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
