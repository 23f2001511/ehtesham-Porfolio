"use client";

import { useEffect, useState } from "react";

export function useCurrentTime(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}

export function formatClock(date: Date | null) {
  if (!date) {
    return "--:--";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatTrayDate(date: Date | null) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
