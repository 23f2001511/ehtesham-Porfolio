"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/constants";

export default function LandingIntro() {
  const [phase, setPhase] = useState<"enter" | "reveal" | "leaving" | "gone">("enter");

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase("reveal"), 200),
      window.setTimeout(() => setPhase("leaving"), 2400),
      window.setTimeout(() => setPhase("gone"), 3100),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, []);

  if (phase === "gone") {
    return null;
  }

  const isEntering = phase === "enter";
  const isRevealed = phase === "reveal" || phase === "leaving";
  const isLeaving = phase === "leaving";

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#05070d] transition-all duration-700 ${
        isLeaving ? "pointer-events-none opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      aria-label="Opening portfolio"
      role="status"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 intro-bg-morph" />
      <div className="absolute inset-0 noise-mask opacity-25" />

      {/* Orbiting particles ring */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="intro-orbit-container">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="intro-orbit-dot"
              style={{
                "--orbit-delay": `${i * -0.5}s`,
                "--orbit-size": `${3 + (i % 3)}px`,
                "--orbit-opacity": `${0.4 + (i % 3) * 0.2}`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Central logo */}
      <div className="relative grid place-items-center">
        {/* Outer glow pulse */}
        <div
          className={`absolute h-52 w-52 rounded-full transition-all duration-1000 ease-out ${
            isRevealed
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
          }`}
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)",
            animation: isRevealed ? "intro-glow-pulse 2s ease-in-out infinite" : "none",
          }}
        />

        {/* Inner ring */}
        <div
          className={`absolute h-36 w-36 rounded-full border transition-all duration-700 ease-out ${
            isRevealed
              ? "border-cyan-300/30 opacity-100 scale-100"
              : "border-cyan-300/0 opacity-0 scale-50"
          }`}
          style={{
            animation: isRevealed ? "intro-ring-spin 8s linear infinite" : "none",
            background: "conic-gradient(from 0deg, transparent, rgba(34,211,238,0.12) 25%, transparent 50%, rgba(16,185,129,0.1) 75%, transparent)",
          }}
        />

        {/* Logo badge */}
        <div
          className={`relative z-10 grid h-24 w-24 place-items-center rounded-2xl transition-all duration-700 ease-out ${
            isRevealed
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-50 -rotate-12"
          }`}
          style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.6))",
            border: "1px solid rgba(34,211,238,0.35)",
            boxShadow: "0 0 60px rgba(34,211,238,0.2), 0 0 120px rgba(34,211,238,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <span
            className="text-3xl font-black bg-gradient-to-br from-cyan-200 via-cyan-100 to-emerald-200 bg-clip-text text-transparent"
            style={{
              filter: isRevealed ? "drop-shadow(0 0 12px rgba(34,211,238,0.4))" : "none",
            }}
          >
            EA
          </span>
        </div>
      </div>

      {/* Name + tagline reveal */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
        <p
          className={`text-xl font-black tracking-tight text-white transition-all duration-700 ease-out ${
            isRevealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isRevealed ? "300ms" : "0ms" }}
        >
          {siteConfig.name}
        </p>
        <p
          className={`mt-2 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-700 ease-out ${
            isRevealed
              ? "opacity-70 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{
            transitionDelay: isRevealed ? "500ms" : "0ms",
            background: "linear-gradient(90deg, #22d3ee, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {siteConfig.role}
        </p>

        {/* Progress bar */}
        <div className="mt-5 mx-auto h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-transform duration-[2200ms] ease-out origin-left ${
              isEntering ? "scale-x-0" : "scale-x-100"
            }`}
            style={{
              background: "linear-gradient(90deg, #22d3ee, #10b981, #fbbf24)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
