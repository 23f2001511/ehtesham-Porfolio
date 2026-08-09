"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/constants";

// Floating space elements around the text
function FloatingElement({
  delay,
  x,
  y,
  size,
  type,
}: {
  delay: number;
  x: number;
  y: number;
  size: number;
  type: "star" | "planet" | "ring";
}) {
  const reducedMotion = useReducedMotion();

  if (type === "star") {
    return (
      <motion.div
        initial={reducedMotion ? { opacity: 0.6 } : { opacity: 0, scale: 0 }}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [0, 0.8, 0.4, 0.9, 0.5],
                scale: [0, 1.2, 0.9, 1.1, 1],
                x: [0, 8, -5, 3, 0],
                y: [0, -10, 5, -8, 0],
              }
        }
        transition={{
          delay,
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14l-6-4.8h7.6L12 2z"
            fill="currentColor"
            className="text-amber-300/60"
            style={{ filter: `drop-shadow(0 0 ${size / 3}px rgba(251, 191, 36, 0.5))` }}
          />
        </svg>
      </motion.div>
    );
  }

  if (type === "planet") {
    return (
      <motion.div
        initial={reducedMotion ? { opacity: 0.5 } : { opacity: 0, scale: 0 }}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [0, 0.6, 0.4, 0.6],
                scale: [0, 1, 0.95, 1.05, 1],
                y: [0, -12, 8, -6, 0],
              }
        }
        transition={{
          delay: delay + 0.5,
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute rounded-full"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, #5a7cba, #1a2a4a)`,
          boxShadow: `0 0 ${size}px rgba(80, 120, 200, 0.3), inset -${size / 4}px -${size / 4}px ${size / 2}px rgba(0,0,0,0.5)`,
        }}
      />
    );
  }

  // Ring / orbit
  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0.2 } : { opacity: 0, rotate: 0 }}
      animate={
        reducedMotion
          ? undefined
          : {
              opacity: [0, 0.2, 0.15, 0.25],
              rotate: [0, 360],
            }
      }
      transition={{
        delay: delay + 0.3,
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute rounded-full border border-white/10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: `translateX(-50%) translateY(-50%)`,
      }}
    />
  );
}

// Word-by-word animated entrance
function AnimatedWord({
  word,
  index,
  direction,
}: {
  word: string;
  index: number;
  direction: "left" | "right" | "top" | "bottom";
}) {
  const reducedMotion = useReducedMotion();

  const directionMap = {
    left: { x: -80, y: 0 },
    right: { x: 80, y: 0 },
    top: { x: 0, y: -60 },
    bottom: { x: 0, y: 60 },
  };

  const from = directionMap[direction];

  return (
    <motion.span
      initial={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 0, x: from.x, y: from.y, scale: 0.5, filter: "blur(8px)" }
      }
      animate={
        reducedMotion
          ? undefined
          : { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
      }
      transition={{
        delay: 0.15 * index,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="inline-block mr-[0.3em]"
    >
      {word}
    </motion.span>
  );
}

const welcomeWords = ["Welcome", "to", "Ehtesham's", "Portfolio"];
const wordDirections: ("left" | "right" | "top" | "bottom")[] = [
  "left",
  "top",
  "right",
  "bottom",
];

const floatingElements = [
  { x: 8, y: 15, size: 18, type: "star" as const, delay: 0.5 },
  { x: 88, y: 20, size: 14, type: "star" as const, delay: 0.8 },
  { x: 15, y: 70, size: 12, type: "star" as const, delay: 1.0 },
  { x: 78, y: 75, size: 16, type: "star" as const, delay: 0.6 },
  { x: 45, y: 8, size: 10, type: "star" as const, delay: 1.2 },
  { x: 5, y: 45, size: 22, type: "planet" as const, delay: 0.3 },
  { x: 92, y: 55, size: 16, type: "planet" as const, delay: 0.7 },
  { x: 50, y: 50, size: 300, type: "ring" as const, delay: 0.2 },
  { x: 50, y: 50, size: 450, type: "ring" as const, delay: 0.5 },
  { x: 25, y: 85, size: 10, type: "star" as const, delay: 1.4 },
  { x: 70, y: 10, size: 20, type: "planet" as const, delay: 0.9 },
];

export default function HeroWelcome({ visible }: { visible: boolean }) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax for floating elements
  useEffect(() => {
    if (reducedMotion || !visible) return;

    const container = containerRef.current;
    if (!container) return;

    function handleMouse(e: MouseEvent) {
      if (!container) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      container.style.setProperty("--mx", `${x}px`);
      container.style.setProperty("--my", `${y}px`);
    }

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [reducedMotion, visible]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{ "--mx": "0px", "--my": "0px" } as React.CSSProperties}
    >
      {/* Floating decorative elements with parallax */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: "translate(var(--mx), var(--my))" }}
      >
        {floatingElements.map((el, i) => (
          <FloatingElement key={i} {...el} />
        ))}
      </div>

      {/* Main welcome text */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {/* Subtitle above */}
          <motion.p
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-sm font-medium uppercase tracking-[0.35em] text-amber-200/70 mb-6"
          >
            ✦ Exploring the digital cosmos ✦
          </motion.p>

          {/* Main title — words fly in from different directions */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight flex flex-wrap justify-center">
            {welcomeWords.map((word, i) => (
              <AnimatedWord
                key={word}
                word={word}
                index={i}
                direction={wordDirections[i]}
              />
            ))}
          </h2>

          {/* Glowing underline */}
          <motion.div
            initial={reducedMotion ? {} : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
            className="mt-6 mx-auto h-[2px] w-48 origin-center"
            style={{
              background: "linear-gradient(90deg, transparent, #fbbf24, #f97316, #fbbf24, transparent)",
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)",
            }}
          />

          {/* Role subtitle */}
          <motion.p
            initial={reducedMotion ? {} : { opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="mt-6 text-lg sm:text-xl font-semibold"
            style={{
              background: "linear-gradient(90deg, #22d3ee, #10b981, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {siteConfig.role} · {siteConfig.location}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
