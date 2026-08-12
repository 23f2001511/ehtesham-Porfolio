import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date) {
  if (!value) {
    return "Present";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "Present";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric"
  }).format(date);
}

/** Human relative time like "3 days ago", based on the current time at render. */
export function timeAgo(value?: string | number | Date) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) {
    return "just now";
  }

  const intervals: [number, string][] = [
    [365 * 24 * 3600, "year"],
    [30 * 24 * 3600, "month"],
    [7 * 24 * 3600, "week"],
    [24 * 3600, "day"],
    [3600, "hour"],
    [60, "minute"]
  ];

  for (const [span, unit] of intervals) {
    const amount = Math.floor(seconds / span);
    if (amount >= 1) {
      return `${amount} ${unit}${amount === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}
