"use client";

import Link from "next/link";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import { siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export default function ResumeSection() {
  const { profile, resolved } = usePublicProfile();
  const hasResume = Boolean(profile.resumeUrl && profile.resumeUrl.trim().length > 0);

  return (
    <section id="resume" className="border-y border-border bg-surface/40 section-pad !py-20">
      <div className="section-shell">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="eyebrow">Resume</span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The one-page version of everything you just scrolled
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                A compact summary of the projects, skills, experience, and education listed here —
                ready for recruiters, collaborators, or anyone who likes to review on paper.
              </p>
            </div>

            <div className="panel p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-surface text-primary">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Ehtesham_Aalam_Resume.pdf</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {hasResume ? "PDF · 1 page · link verified" : "Awaiting upload"}
                  </p>
                </div>
              </div>

              {hasResume ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={profile.resumeUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Preview
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={profile.resumeUrl!}
                    download
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                  >
                    Download
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-border bg-surface/50 px-4 py-6 text-center">
                  <p className="text-sm font-medium text-foreground">Resume not uploaded yet</p>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    The resume file is managed from the admin dashboard. In the meantime, you can reach
                    me at{" "}
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

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {resolved ? "Managed securely from the admin dashboard." : "Checking for an uploaded resume…"}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
