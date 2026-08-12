"use client";

import { CalendarDays, GraduationCap } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { educationTimeline } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export default function EducationSection() {
  const { profile } = usePublicProfile();
  const items = profile.education?.length ? profile.education : educationTimeline;

  return (
    <section id="education" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Education"
          title="Formal training that underpins the engineering practice"
          description="Academic grounding in data science, statistics, and systems thinking — the theory behind the software."
        />

        {items.length ? (
          <div className="mx-auto mt-12 max-w-3xl">
            <ol className="relative space-y-6 border-l border-border pl-8">
              {items.map((item, index) => (
                <li key={`${item.title}-${item.institution}`}>
                  <Reveal delay={index * 0.08}>
                    <span
                      className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary"
                      aria-hidden="true"
                    />
                    <article className="panel-ghost card-lift p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold tracking-tight text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            <GraduationCap className="h-4 w-4" aria-hidden="true" />
                            {item.institution}
                          </p>
                        </div>
                        {item.period ? (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                            {item.period}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="mt-12">
            <div className="panel-ghost px-6 py-8 text-center text-sm text-muted-foreground">
              Education details are managed from the admin dashboard and will appear here once
              published.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
