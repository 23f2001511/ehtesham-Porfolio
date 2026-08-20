"use client";

import { BookOpen, Compass, GraduationCap, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { aboutHighlights, educationTimeline, experienceTimeline, siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

const defaultBio =
  "I work across the stack — from data models and API routes to interfaces and motion — because products feel right only when every layer agrees. Right now that means production-style Next.js applications, honest data, and details users can feel.";

export default function AboutSection() {
  const { profile } = usePublicProfile();
  const bio = profile.aboutBio || defaultBio;

  const focusItems = (profile.experience?.length ? profile.experience : experienceTimeline)
    .slice(0, 2)
    .map((item) => `${item.role} — ${item.company}`);

  const educationItems = (profile.education?.length ? profile.education : educationTimeline).map(
    (item) => `${item.title}, ${item.institution}`
  );

  return (
    <section id="about" className="section-pad">
      <div className="section-shell">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="About"
            title="A developer who thinks in systems, interfaces, and outcomes"
            description="I like the full stack because every layer changes the product — good schemas make good dashboards easier, and good UI makes complex data feel simple."
            gradient
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Lead card */}
          <ScrollReveal direction="left">
            <div className="panel card-lift h-full p-7 sm:p-8">
              <span className="eyebrow">Who I am</span>
              <h3 className="mt-5 text-balance text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
                I build practical products with a sharp eye for the details users feel.
              </h3>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{bio}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{siteConfig.role}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Location</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {profile.location || siteConfig.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Focus</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">UX + APIs</dd>
                </div>
              </dl>
            </div>
          </ScrollReveal>

          {/* Highlights + chips */}
          <div className="flex flex-col gap-6">
            <ScrollReveal direction="right" delay={0.08}>
              <ul className="panel-ghost divide-y divide-border">
                {aboutHighlights.map((item) => (
                  <li key={item} className="flex gap-3.5 px-5 py-4">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.16}>
              <div className="panel p-5 sm:p-6">
                <div className="flex items-center gap-2.5">
                  <Compass className="h-4 w-4 text-secondary" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-foreground">Current focus</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {focusItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4 text-accent" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-foreground">Education</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {educationItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-foreground">Interests</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Data-driven products", "Developer tooling", "Accessible UI"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
