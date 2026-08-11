import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppSurface({
  children,
  className,
  onClick
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className={cn("os-app", className)} onClick={onClick}>
      {children}
    </div>
  );
}

export function AppSection({
  title,
  hint,
  children,
  className
}: {
  title?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("os-app__section", className)}>
      {(title || hint) && (
        <header className="os-app__section-head">
          {title && <h2 className="os-app__section-title">{title}</h2>}
          {hint && <p className="os-app__section-hint">{hint}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatTile({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="os-stat-tile">
      <span className="os-stat-tile__value">{value}</span>
      <span className="os-stat-tile__label">{label}</span>
      {hint ? <span className="os-stat-tile__hint">{hint}</span> : null}
    </div>
  );
}

export function AppEmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="os-empty" role="status">
      <div className="os-empty__icon" aria-hidden="true">
        <span />
      </div>
      <p className="os-empty__title">{title}</p>
      <p className="os-empty__description">{description}</p>
      {action}
    </div>
  );
}

export function AppLink({
  href,
  children,
  variant = "ghost"
}: {
  href: string;
  children: ReactNode;
  variant?: "ghost" | "primary";
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={cn(
        "os-btn os-interactive",
        variant === "primary" ? "os-btn--primary" : "os-btn--ghost"
      )}
    >
      {children}
    </a>
  );
}
