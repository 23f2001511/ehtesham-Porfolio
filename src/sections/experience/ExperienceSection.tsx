import { CalendarDays } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { experienceTimeline } from "@/constants";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Experience"
          title="Focused practice across product engineering and data foundations."
          description="The goal is not just to collect tools. It is to build judgment: when to simplify, when to model carefully, and when polish matters."
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-300 via-emerald-300 to-transparent sm:block" />
          <div className="grid gap-6">
            {experienceTimeline.map((item, index) => (
              <Reveal key={`${item.role}-${item.company}`} delay={index * 0.08}>
                <article className="relative rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:ml-12">
                  <div className="absolute -left-[3.75rem] top-7 hidden h-8 w-8 place-items-center rounded-md border border-cyan-300/30 bg-slate-950 text-cyan-100 sm:grid">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">{item.role}</h3>
                      <p className="mt-1 text-sm font-semibold text-cyan-100">{item.company}</p>
                    </div>
                    <Badge tone="emerald">{item.period}</Badge>
                  </div>
                  <p className="mt-4 leading-7 text-slate-300">{item.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.impact.map((impact) => (
                      <Badge key={impact} tone="slate">
                        {impact}
                      </Badge>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
