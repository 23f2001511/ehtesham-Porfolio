"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedType(text: string, cps = 24, startDelay = 0) {
  const [output, setOutput] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setOutput("");
    let cancelled = false;
    let index = 0;

    const step = () => {
      if (cancelled) {
        return;
      }
      index += 1;
      setOutput(text.slice(0, index));
      if (index < text.length) {
        timerRef.current = window.setTimeout(step, Math.max(8, Math.round(1000 / cps)));
      }
    };

    timerRef.current = window.setTimeout(step, startDelay);

    return () => {
      cancelled = true;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [text, cps, startDelay]);

  return output;
}
