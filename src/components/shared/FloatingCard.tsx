"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FloatingCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  glowColor?: string;
};

export default function FloatingCard({
  children,
  className,
  delay = 0,
  glowColor = "rgba(34, 211, 238, 0.15)",
}: FloatingCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" },
            }
      }
      className={cn("floating-card", className)}
      style={{
        "--glow-color": glowColor,
      } as React.CSSProperties}
    >
      {children}
    </motion.div>
  );
}
