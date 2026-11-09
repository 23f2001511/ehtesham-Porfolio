"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  User,
  FolderGit2,
  Cpu,
  BarChart3,
  Award,
  Mail,
  Compass,
  X,
  ChevronLeft
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Home", href: "/#home", id: "home", icon: Home },
  { name: "About", href: "/#about", id: "about", icon: User },
  { name: "Projects", href: "/#projects", id: "projects", icon: FolderGit2 },
  { name: "Skills", href: "/#skills", id: "skills", icon: Cpu },
  { name: "Analytics", href: "/#stats", id: "stats", icon: BarChart3 },
  { name: "Certificates", href: "/#certificates", id: "certificates", icon: Award },
  { name: "Contact", href: "/#contact", id: "contact", icon: Mail },
];

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("home");
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Track active section using IntersectionObserver
  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
      // Automatically close after navigation
      setIsOpen(false);
    }
  };

  return (
    <div ref={navRef} className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ── Floating Launcher Trigger Button (Hidden Sidebar State) ── */
          <motion.div
            key="side-nav-trigger"
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative group"
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation sidebar"
              className="relative flex flex-col items-center gap-1.5 rounded-full border border-[#7042f8]/60 bg-[#07011d]/90 p-3 sm:p-3.5 text-[#00f0ff] shadow-[0_0_25px_rgba(112,66,248,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#00f0ff] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] cursor-pointer"
            >
              {/* Outer pulsing ring */}
              <span className="absolute -inset-1 rounded-full border border-[#00f0ff]/40 animate-ping pointer-events-none opacity-40" />

              <Compass className="h-5 w-5 sm:h-6 sm:w-6 animate-spin-slow transition-transform group-hover:rotate-45" style={{ animationDuration: "20s" }} />

              <ChevronLeft className="h-3.5 w-3.5 text-purple-300 animate-pulse" />

              {/* Tooltip on hover */}
              <span className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center pointer-events-none select-none z-50">
                <span className="relative flex items-center rounded-lg border border-[#7042f8]/50 bg-[#0d042a]/95 px-3 py-1.5 shadow-[0_0_20px_rgba(112,66,248,0.5)] backdrop-blur-md">
                  <span className="text-xs font-mono font-semibold text-white whitespace-nowrap">
                    Quick Menu
                  </span>
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-[#0d042a]" />
                </span>
              </span>
            </button>
          </motion.div>
        ) : (
          /* ── Expanded Sidebar Navigation Dock ── */
          <motion.nav
            key="side-nav-panel"
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            aria-label="Floating side navigation"
            className="flex flex-col items-center gap-y-3 rounded-3xl border border-[#7042f8]/50 bg-[#07011d]/95 p-3.5 backdrop-blur-2xl shadow-[0_0_35px_rgba(112,66,248,0.45)] ring-1 ring-[#00f0ff]/20"
          >
            {/* Header / Close button */}
            <div className="flex w-full items-center justify-between pb-2 mb-1 border-b border-[#7042f8]/30 px-1 gap-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00f0ff] uppercase">
                NAV
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation sidebar"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-purple-500/40 text-purple-300 hover:text-white hover:border-[#00f0ff] hover:bg-purple-900/40 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="flex flex-col items-center gap-y-2.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.id)}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#7042f8] to-[#00f0ff] text-white shadow-[0_0_20px_rgba(0,240,255,0.6)] scale-110"
                        : "text-purple-300/70 hover:text-white hover:bg-purple-900/35 hover:scale-105"
                    }`}
                    aria-label={item.name}
                  >
                    {/* Tooltip on Left */}
                    <div className="absolute right-14 hidden group-hover:flex items-center pointer-events-none select-none z-50">
                      <div className="relative flex items-center rounded-lg border border-[#7042f8]/50 bg-[#0d042a]/95 px-3 py-1.5 shadow-[0_0_20px_rgba(112,66,248,0.5)] backdrop-blur-md">
                        <span className="text-xs font-mono font-semibold text-white whitespace-nowrap">
                          {item.name}
                        </span>
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-[#0d042a]" />
                      </div>
                    </div>

                    <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
