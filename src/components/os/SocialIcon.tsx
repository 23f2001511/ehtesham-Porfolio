"use client";

import { Github, Linkedin, Mail, Twitter, Globe, Code } from "lucide-react";
import type { SocialLink } from "@/types";
import { cn } from "@/lib/utils";

const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Globe,
  Code
};

export function SocialIcon({
  link,
  className,
  variant = "tile"
}: {
  link: SocialLink;
  className?: string;
  variant?: "tile" | "row";
}) {
  const Icon = iconMap[link.icon] ?? Globe;
  const external = link.href.startsWith("http");

  if (variant === "row") {
    return (
      <a
        href={link.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className={cn(
          "os-interactive flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-light)] px-3 py-2 text-sm text-[var(--fg-strong)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--glass-light-hover)]",
          className
        )}
      >
        <Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
        <span>{link.label}</span>
      </a>
    );
  }

  return (
    <a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      aria-label={link.label}
      className={cn(
        "os-interactive grid h-9 w-9 place-items-center rounded-lg border border-[var(--glass-border)] bg-[var(--glass-light)] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg-strong)]",
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
