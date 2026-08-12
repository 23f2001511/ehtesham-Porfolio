"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Dark/light switch. Dark is the default theme; `html.light` opts into the
 * light palette (see globals.css). Persisted to localStorage as "theme".
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      // storage unavailable (private mode) — in-memory toggle still works
    }
  };

  const label = mounted && isLight ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={mounted ? isLight : undefined}
      aria-label={label}
      title={label}
      className="btn-spring grid h-9 w-9 place-items-center rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] text-muted-foreground backdrop-blur-md hover:-translate-y-px hover:border-border-strong hover:text-foreground"
    >
      {mounted && isLight ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
