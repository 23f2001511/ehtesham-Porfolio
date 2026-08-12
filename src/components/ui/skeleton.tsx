import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_oklab,var(--foreground)_7%,transparent)]",
        className
      )}
    />
  );
}
