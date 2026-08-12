"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { navItems, siteConfig, socialLinks } from "@/constants";
import { cn } from "@/lib/utils";

const socialIcon: Record<string, typeof Github> = {
  Github,
  Linkedin,
  Code: Code2,
  Mail
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // sticky + shrink on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active section via IntersectionObserver on the one-page home
  useEffect(() => {
    if (!isHome) return;
    const ids = navItems.map((item) => item.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  // lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // escape closes the mobile menu, and focus moves into it
  useEffect(() => {
    if (!open) return;
    const firstLink = mobileNavRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const focusables = mobileNavRef.current?.querySelectorAll<HTMLElement>("a, button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleNav = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (isHome) {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
      window.history.replaceState(null, "", `#${id}`);
    } else {
      event.preventDefault();
      router.push(`/#${id}`);
    }
  };

  const resumeHref = siteConfig.resumeUrl;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav" : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className={cn(
          "section-shell flex items-center justify-between gap-4 transition-[height] duration-300",
          scrolled ? "h-16" : "h-[76px]"
        )}
        aria-label="Primary"
      >
        {/* Brand */}
        <Link
          href="/#home"
          onClick={(event) => handleNav(event, "home")}
          className="group flex items-center gap-2.5"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="btn-spring glass grid h-9 w-9 place-items-center text-[13px] font-bold tracking-tight text-foreground transition-colors group-hover:border-primary/50">
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">EA</span>
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-foreground">{siteConfig.name}</span>
            <span className="text-[11px] text-muted-foreground">{siteConfig.role}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div ref={desktopNavRef} className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(event) => handleNav(event, item.id)}
              aria-current={isHome && active === item.id ? "true" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                isHome && active === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-px origin-center bg-gradient-to-r from-primary to-accent transition-transform duration-300",
                  isHome && active === item.id ? "scale-x-100" : "scale-x-0"
                )}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {["Github", "Linkedin", "LeetCode"].map((label) => {
            const link = socialLinks.find((s) => s.label === label);
            if (!link) return null;
            const Icon = socialIcon[link.icon] ?? Code2;
            return (
              <Link
                key={label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="btn-spring grid h-9 w-9 place-items-center rounded-md border border-transparent text-muted-foreground hover:-translate-y-px hover:border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:text-foreground hover:backdrop-blur-md"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </Link>
            );
          })}
          <ThemeToggle />
          <a
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="btn-spring ml-1 inline-flex h-9 items-center rounded-md bg-gradient-to-r from-primary to-accent px-4 text-[13px] font-semibold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]"
          >
            Resume
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="glass grid h-10 w-10 place-items-center text-foreground"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="glass-panel fixed inset-x-0 bottom-0 top-16 z-40 overflow-hidden lg:hidden"
          >
            <div ref={mobileNavRef} className="section-shell flex h-full flex-col gap-1 overflow-y-auto py-6 pb-24">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index, duration: 0.25 }}
                >
                  <Link
                    href={item.href}
                    onClick={(event) => handleNav(event, item.id)}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-[var(--glass-bg)]"
                  >
                    {item.label}
                    <span className="text-xs text-muted-foreground">0{index + 1}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="mt-6 flex items-center gap-3 border-t border-border px-4 pt-6">
                {socialLinks.map((link) => {
                  const Icon = socialIcon[link.icon] ?? Code2;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      aria-label={link.label}
                      className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  );
                })}
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-spring ml-auto inline-flex h-10 items-center rounded-md bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)]"
                  onClick={() => setOpen(false)}
                >
                  Resume
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
