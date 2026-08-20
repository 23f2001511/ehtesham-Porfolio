"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3";

type AnimatedTextProps = {
  text: string;
  as?: HeadingTag;
  className?: string;
  delay?: number;
};

const tagMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3
} as const;

const wordVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export default function AnimatedText({
  text,
  as = "h2",
  className = "",
  delay = 0
}: AnimatedTextProps) {
  const reduced = useReducedMotion();
  const MotionTag = tagMap[as] as typeof motion.h2;
  const isGradient = className.split(/\s+/).includes("gradient");
  const words = text.trim().split(/\s+/);

  if (reduced) {
    return (
      <MotionTag className={isGradient ? `${className} text-gradient` : className}>
        {text}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07, delayChildren: delay } }
      }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <motion.span
            variants={wordVariants}
            className={`inline-block ${isGradient ? "text-gradient" : ""}`}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </MotionTag>
  );
}

type AnimatedParagraphProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedParagraph({
  children,
  className = "",
  delay = 0
}: AnimatedParagraphProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <p className={className}>{children}</p>;
  }

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.p>
  );
}
