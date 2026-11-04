"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Code2, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { navItems, siteConfig, socialLinks } from "@/constants";
import { cn } from "@/lib/utils";

/* ─── Icons for socials ─────────────────────────────────────────────── */
const socialIcon: Record<string, typeof Github> = {
  Github,
  Linkedin,
  Code: Code2,
  Mail,
};

/* ─── Numbered nav items for the top bar (subset) ───────────────────── */
const numberedNavItems = [
  { num: "01", label: "About", id: "about", href: "/#about" },
  { num: "02", label: "Projects", id: "projects", href: "/#projects" },
  { num: "03", label: "Experience", id: "experience", href: "/#experience" },
  { num: "04", label: "Contact", id: "contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /* ── Hide on scroll down, show on scroll up ─────────────────────── */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 80 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  /* ── Active section via IntersectionObserver ─────────────────────── */
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

  /* ── Lock body scroll when mobile menu is open ──────────────────── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ── Escape & focus trap for mobile menu ────────────────────────── */
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
    <>
      {/* ═══════════════ TOP NAVBAR ═══════════════ */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav
          className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12"
          aria-label="Primary"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            backgroundColor: "rgba(var(--background-rgb, 10,25,47), 0.85)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo: EA with gradient */}
          <Link
            href="/#home"
            onClick={(event) => handleNav(event, "home")}
            className="group relative z-10"
            aria-label={`${siteConfig.name} — home`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/40 bg-transparent"
            >
              <span className="bg-gradient-to-br from-primary to-accent bg-clip-text font-mono text-lg font-bold text-transparent">
                EA
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav links — numbered */}
          <div className="hidden items-center gap-1 lg:flex">
            {numberedNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(event) => handleNav(event, item.id)}
                aria-current={isHome && active === item.id ? "true" : undefined}
                className={cn(
                  "group relative rounded-md px-4 py-2 text-[13px] font-medium transition-colors duration-200",
                  isHome && active === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <span className="font-mono text-primary">{item.num}.</span>{" "}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <a
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              className="btn-spring inline-flex h-9 items-center rounded border border-primary px-4 font-mono text-[13px] font-medium text-primary transition-all duration-200 hover:bg-primary/10"
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
              className="grid h-10 w-10 place-items-center rounded-md border border-primary/30 text-primary"
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* ═══════════════ MOBILE MENU ═══════════════ */}
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-0 z-40 flex items-center justify-center lg:hidden"
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                backgroundColor: "rgba(var(--background-rgb, 10,25,47), 0.95)",
              }}
            >
              <div
                ref={mobileNavRef}
                className="flex flex-col items-center gap-6"
              >
                {numberedNavItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(event) => handleNav(event, item.id)}
                      className="flex flex-col items-center gap-1 text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      <span className="font-mono text-sm text-primary">
                        {item.num}.
                      </span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="mt-4"
                >
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-spring inline-flex h-12 items-center rounded border border-primary px-8 font-mono text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10"
                    onClick={() => setOpen(false)}
                  >
                    Resume
                  </a>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      {/* ═══════════════ FIXED LEFT SIDEBAR — Social Icons ═══════════════ */}
      <div
        className="fixed bottom-0 left-6 z-40 hidden flex-col items-center gap-5 lg:flex xl:left-10"
        aria-label="Social links"
      >
        {socialLinks.map((link) => {
          const Icon = socialIcon[link.icon] ?? Code2;
          return (
            <motion.div
              key={link.label}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={link.label}
                className="block text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </motion.div>
          );
        })}
        {/* Vertical line */}
        <div className="h-24 w-px bg-muted-foreground/40" aria-hidden="true" />
      </div>

      {/* ═══════════════ FIXED RIGHT SIDEBAR — Email ═══════════════ */}
      <div
        className="fixed bottom-0 right-6 z-40 hidden flex-col items-center gap-5 lg:flex xl:right-10"
        aria-label="Email"
      >
        <motion.a
          href={`mailto:${siteConfig.email}`}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-xs tracking-widest text-muted-foreground transition-colors duration-200 hover:text-primary"
          style={{ writingMode: "vertical-rl" }}
        >
          {siteConfig.email}
        </motion.a>
        {/* Vertical line */}
        <div className="h-24 w-px bg-muted-foreground/40" aria-hidden="true" />
      </div>
    </>
  );
}
