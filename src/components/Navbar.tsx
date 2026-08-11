"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Menu, Rocket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, siteConfig } from "@/constants";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={reducedMotion ? {} : { y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "nebula-navbar-scrolled"
          : "nebula-navbar"
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
          <span className="nav-logo grid h-9 w-9 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-sm font-black bg-gradient-to-br from-cyan-200 to-cyan-100 bg-clip-text text-transparent">
            EA
          </span>
          <span className="hidden text-sm font-semibold text-white sm:inline transition-colors group-hover:text-cyan-100">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
            >
              <Link
                href={item.href}
                className="nebula-nav-link rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:text-white"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/admin/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            Admin
          </Link>
          <Link
            href={`mailto:${siteConfig.email}?subject=Hiring%20Inquiry%20-%20${encodeURIComponent(siteConfig.name)}`}
          >
            <Button size="sm" className="nebula-hire-btn">
              <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
              Hire Me
            </Button>
          </Link>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </Button>
      </nav>

      {/* Glowing bottom border */}
      <div className="nebula-border-glow" />

      {open ? (
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-white/10 bg-black/80 backdrop-blur-2xl lg:hidden"
        >
          <div className="section-shell grid gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.08]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="rounded-md px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.08]"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
            <Link
              href={`mailto:${siteConfig.email}?subject=Hiring%20Inquiry%20-%20${encodeURIComponent(siteConfig.name)}`}
              className="rounded-md px-3 py-3 text-sm font-medium text-cyan-100 hover:bg-white/[0.08] flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Hire Me
            </Link>
          </div>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
