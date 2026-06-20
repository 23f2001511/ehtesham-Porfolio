import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { aboutHighlights, siteConfig } from "@/constants";

export default function AboutSection() {
  return (
    <section id="about" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="About"
          title="A developer who thinks in systems, interfaces, and outcomes."
          description="I like the full stack because every layer changes the product. Good schemas make good dashboards easier. Good UI makes complex data feel simple."
        />

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <Card className="h-full p-6">
              <CardContent className="p-0">
                <p className="text-sm font-semibold text-cyan-100">{siteConfig.role}</p>
                <h3 className="mt-3 text-2xl font-black leading-tight text-white">
                  I build practical products with a sharp eye for the details users feel.
                </h3>
                <p className="mt-5 leading-8 text-slate-300">
                  My work sits at the intersection of engineering and product craft: Next.js app
                  architecture, MongoDB data modeling, accessible components, responsive layouts,
                  and motion that supports the experience.
                </p>
              </CardContent>
            </Card>
          </Reveal>

          <div className="grid gap-4">
            {aboutHighlights.map((item, index) => (
              <Reveal key={item} delay={index * 0.08}>
                <div className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                  <p className="leading-7 text-slate-200">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
