"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Code2, Github, Linkedin, Menu, X, Orbit, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/constants";

const navLinks = [
  { label: "About", id: "about", href: "/#about" },
  { label: "Skills", id: "skills", href: "/#skills" },
  { label: "Projects", id: "projects", href: "/#projects" },
  { label: "Experience", id: "experience", href: "/#experience" },
  { label: "Contact", id: "contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 100 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    if (!isHome) return;
    const ids = ["home", "about", "skills", "projects", "experience", "contact"];
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
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const handleNav = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (isHome) {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    } else {
      event.preventDefault();
      router.push(`/#${id}`);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between px-6 sm:px-12 backdrop-blur-md bg-[#030014]/50 border-b border-[#7042f8]/20 shadow-[0_10px_30px_rgba(42,14,97,0.3)] select-none"
      >
        {/* Brand Logo Left */}
        <Link
          href="/#home"
          onClick={(e) => handleNav(e, "home")}
          className="flex items-center gap-2.5 text-white hover:text-[#00f0ff] transition-colors group cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#7042f8]/60 bg-gradient-to-br from-[#120738] via-[#0b0424] to-[#040114] shadow-[0_0_15px_rgba(112,66,248,0.5)] group-hover:border-[#00f0ff] transition-all">
            <Orbit className="h-5 w-5 text-[#00f0ff] group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-[#00f0ff] transition-colors">
            {siteConfig.name}
          </span>
        </Link>

        {/* Central Floating Glass Pill Navigation (Signature Sanidhyy Space Style) */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-6 rounded-full border border-[#7042f8]/40 bg-[#07011d]/80 px-6 py-2 shadow-[0_0_20px_rgba(112,66,248,0.25)] backdrop-blur-xl"
        >
          {navLinks.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNav(e, item.id)}
                className={`text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-[#00f0ff] font-bold drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Socials & Resume */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={`https://github.com/${siteConfig.githubUsername}`}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#7042f8]/30 text-gray-300 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#7042f8]/30 text-gray-300 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link
            href={`https://leetcode.com/u/${siteConfig.leetcodeUsername}/`}
            target="_blank"
            rel="noreferrer"
            aria-label="LeetCode"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#7042f8]/30 text-gray-300 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all"
          >
            <Code2 className="h-4 w-4" />
          </Link>

          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-[#00f0ff]/60 bg-[#00f0ff]/10 px-3.5 py-1.5 font-mono text-xs font-bold text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-[#7042f8]/50 text-white"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 z-40 flex flex-col gap-4 border-b border-[#7042f8]/30 bg-[#030014]/95 p-6 backdrop-blur-2xl md:hidden"
          >
            {navLinks.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNav(e, item.id)}
                className="font-mono text-base font-semibold text-gray-200 hover:text-[#00f0ff] py-1"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#7042f8]/20 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">Socials:</span>
              <div className="flex items-center gap-3">
                <Link href={`https://github.com/${siteConfig.githubUsername}`} target="_blank" className="text-gray-300 hover:text-[#00f0ff]">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href={siteConfig.linkedinUrl} target="_blank" className="text-gray-300 hover:text-[#00f0ff]">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href={`https://leetcode.com/u/${siteConfig.leetcodeUsername}/`} target="_blank" className="text-gray-300 hover:text-[#00f0ff]">
                  <Code2 className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
