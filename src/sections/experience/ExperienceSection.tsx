"use client";

import { Briefcase, CalendarDays } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { experienceTimeline } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export default function ExperienceSection() {
  const { profile } = usePublicProfile();
  const items = profile.experience?.length ? profile.experience : experienceTimeline;

  return (
    <section id="experience" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've been putting the hours"
          description="Roles and responsibilities that shaped how I build software today."
          gradient
        />

        {items.length ? (
          <div className="mx-auto mt-12 max-w-3xl">
            <ol className="relative space-y-6 border-l border-border pl-8">
              {items.map((item, index) => (
                <li key={`${item.role}-${item.company}`}>
                  <Reveal delay={index * 0.08}>
                    <span
                      className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary"
                      aria-hidden="true"
                    />
                    <article className="panel-ghost card-lift p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                            {item.role}
                          </h3>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            <Briefcase className="h-4 w-4" aria-hidden="true" />
                            {item.company}
                          </p>
                        </div>
                        {item.period ? (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                            {item.period}
                          </span>
                        ) : null}
                      </div>

                      {item.summary ? (
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary}</p>
                      ) : null}

                      {item.impact.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.impact.map((point) => (
                            <span
                              key={point}
                              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="mt-12">
            <div className="panel-ghost px-6 py-8 text-center text-sm text-muted-foreground">
              Experience entries are managed from the admin dashboard and will appear here once published.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
