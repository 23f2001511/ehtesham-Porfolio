"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/shared/Reveal";
import { siteConfig } from "@/constants";

export default function ContactSection() {
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
            <h2 className="font-display mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Get In Touch
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              Although I&rsquo;m not currently looking for any new opportunities,
              my inbox is always open. Whether you have a question or just want
              to say hi, I&rsquo;ll try my best to get back to you!
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group relative inline-flex h-14 items-center gap-2 rounded-lg border border-primary/60 bg-transparent px-8 font-mono text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_30px_rgba(79,156,255,0.15)]"
              >
                Say Hello
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
