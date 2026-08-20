"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ScrollRevealDirection = "up" | "down" | "left" | "right";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  direction?: ScrollRevealDirection;
  delay?: number;
};

const OFFSET = 48;
const ROTATE_Y = 12;
const ROTATE_X = 8;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function hiddenState(direction: ScrollRevealDirection, rotationScale: number) {
  if (direction === "left")
    return { opacity: 0, x: -OFFSET, rotateY: -ROTATE_Y * rotationScale };
  if (direction === "right")
    return { opacity: 0, x: OFFSET, rotateY: ROTATE_Y * rotationScale };
  if (direction === "down")
    return { opacity: 0, y: -OFFSET, rotateX: -ROTATE_X * rotationScale };
  return { opacity: 0, y: OFFSET, rotateX: ROTATE_X * rotationScale };
}

function visibleState() {
  return { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0 };
}

export default function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0
}: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const rotationScale = isMobile ? 0.5 : 1;

  return (
    <motion.div
      initial={reduced ? false : hiddenState(direction, rotationScale)}
      whileInView={reduced ? undefined : visibleState()}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{ transformPerspective: 1000 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
