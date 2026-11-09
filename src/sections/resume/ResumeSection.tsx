"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import { siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export default function ResumeSection() {
  const { profile, resolved } = usePublicProfile();
  const reducedMotion = useReducedMotion();
  const resumeHref = profile.resumeUrl || siteConfig.resumeUrl;
  const hasResume = Boolean(resumeHref && resumeHref.trim().length > 0);

  return (
    <section id="resume" className="border-y border-border bg-surface/40 section-pad !py-24">
      <div className="section-shell">
        <Reveal>
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            {/* Glass card */}
            <motion.div
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative w-full overflow-hidden rounded-2xl border border-border/60 bg-[var(--glass-bg)] p-8 backdrop-blur-xl transition-all duration-500 sm:p-10"
            >
              {/* Gradient border glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true">
                <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-accent/30" />
                <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-background" />
              </div>

              <div className="relative">
                {/* Icon */}
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-surface text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <FileText className="h-7 w-7" aria-hidden="true" />
                </div>

                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Download my resume
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  A compact summary of projects, skills, experience, and education — ready for recruiters and collaborators.
                </p>

                {hasResume ? (
                  <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <a
                      href={resumeHref}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(79,156,255,0.25)] active:scale-[0.98] sm:w-auto"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download PDF
                    </a>
                  </div>
                ) : (
                  <div className="mt-8 rounded-xl border border-dashed border-border bg-surface/50 px-4 py-6">
                    <p className="text-sm font-medium text-foreground">Resume not uploaded yet</p>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      In the meantime, reach me at{" "}
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {siteConfig.email}
                      </a>
                      .
                    </p>
                  </div>
                )}

                <p className="mt-5 text-xs text-muted-foreground">
                  {resolved ? "Ehtesham_Aalam_Resume.pdf · 1 page" : "Checking for an uploaded resume…"}
                </p>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
