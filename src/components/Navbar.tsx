"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems, siteConfig } from "@/constants";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <nav className="section-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Go to homepage">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-sm font-black text-cyan-100">
            EA
          </span>
          <span className="hidden text-sm font-semibold text-white sm:inline">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/admin/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            Admin
          </Link>
          <Button size="sm" onClick={() => document.querySelector("#contact")?.scrollIntoView()}>
            Hire Me
          </Button>
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

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 lg:hidden">
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
          </div>
        </div>
      ) : null}
    </header>
  );
}
