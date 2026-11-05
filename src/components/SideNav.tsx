"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, User, FolderGit2, Cpu, BarChart3, Mail, Award } from "lucide-react";

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
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  };

  return (
    <nav
      aria-label="Floating side navigation"
      className="fixed right-[2%] top-1/2 z-50 -translate-y-1/2 hidden lg:flex flex-col items-center gap-y-4"
    >
      <div className="flex flex-col items-center gap-y-3.5 rounded-full border border-[#7042f8]/35 bg-[#07011d]/85 px-3 py-5 backdrop-blur-xl shadow-[0_0_25px_rgba(112,66,248,0.25)]">
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
                  ? "bg-gradient-to-r from-[#7042f8] to-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  : "text-purple-300/70 hover:text-white hover:bg-purple-900/30"
              }`}
              aria-label={item.name}
            >
              {/* Tooltip on Left */}
              <div className="absolute right-14 hidden group-hover:flex items-center pointer-events-none select-none">
                <div className="relative flex items-center rounded-lg border border-[#7042f8]/40 bg-[#0d042a]/95 px-3 py-1.5 shadow-[0_0_15px_rgba(112,66,248,0.4)] backdrop-blur-md">
                  <span className="text-xs font-mono font-semibold text-white whitespace-nowrap">
                    {item.name}
                  </span>
                  {/* Tooltip Arrow */}
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-[#0d042a]" />
                </div>
              </div>

              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
