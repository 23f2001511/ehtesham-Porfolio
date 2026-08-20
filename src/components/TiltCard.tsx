"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  maxTilt?: number;
};

const SPRING = { stiffness: 260, damping: 18, mass: 0.6 };

export default function TiltCard({
  children,
  className,
  delay = 0,
  maxTilt = 9
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hoverEnabled, setHoverEnabled] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-1, 1], [maxTilt, -maxTilt]), SPRING);
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-maxTilt, maxTilt]), SPRING);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverEnabled(media.matches);

    const onChange = (event: MediaQueryListEvent) => setHoverEnabled(event.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!hoverEnabled) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    mx.set(x * 2 - 1);
    my.set(y * 2 - 1);

    element.style.setProperty("--mouse-x", `${(x * 100).toFixed(2)}%`);
    element.style.setProperty("--mouse-y", `${(y * 100).toFixed(2)}%`);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  const tiltEnabled = hoverEnabled && !reduced;

  return (
    <motion.div
      ref={ref}
      className={cn("group relative", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={reduced ? false : { opacity: 0, scale: 0.96, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      style={
        tiltEnabled
          ? { rotateX, rotateY, transformPerspective: 1000 }
          : undefined
      }
    >
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>

      {tiltEnabled ? (
        <>
          {/* Mouse-follow spotlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              borderRadius: "var(--radius)",
              background:
                "radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.16), transparent 65%)"
            }}
          />

          {/* Gradient border glow on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              borderRadius: "var(--radius)",
              background:
                "linear-gradient(135deg, rgba(124, 92, 255, 0.65), rgba(56, 189, 248, 0.4), rgba(45, 212, 191, 0.55))",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude"
            }}
          />
        </>
      ) : null}
    </motion.div>
  );
}
