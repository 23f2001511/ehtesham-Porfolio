"use client";

import Link from "next/link";
import { Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import { navItems, siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Globe
};

export default function Footer() {
  const profile = usePublicProfile();

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="section-shell grid gap-8 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <Link href="/" className="text-lg font-black text-white">
            {siteConfig.name}
          </Link>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Full-stack developer focused on thoughtful interfaces, reliable APIs, and data-backed
            web products.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.socials.map((link) => {
              const Icon = iconMap[link.icon] ?? Globe;

              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="grid h-10 w-10 place-items-center rounded-md border border-border bg-white/5 text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm md:text-right">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-slate-300 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className="section-shell text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js, TypeScript, and MongoDB.
        </p>
      </div>
    </footer>
  );
}
