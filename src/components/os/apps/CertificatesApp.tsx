"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import type { Certificate } from "@/types";
import { formatDateTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { AppEmptyState, AppSurface } from "./appShared";

function formatIssueDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return formatDateTime(date, { month: "short", year: "numeric" });
}

export default function CertificatesApp() {
  const { data: certificates, isLoading } = useCollection<Certificate>("/api/certificates", []);
  const [query, setQuery] = useState("");
  const [issuer, setIssuer] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreviewId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const issuers = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const cert of certificates) {
      if (cert.issuer) {
        set.add(cert.issuer);
      }
    }
    return [...set];
  }, [certificates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return certificates.filter((cert) => {
      if (issuer !== "All" && cert.issuer !== issuer) {
        return false;
      }
      if (!q) {
        return true;
      }
      return `${cert.title} ${cert.issuer}`.toLowerCase().includes(q);
    });
  }, [certificates, query, issuer]);

  const active = previewId ? filtered.find((cert) => cert.id === previewId) ?? null : null;

  return (
    <AppSurface>
      <div className="os-toolbar">
        <label className="os-toolbar__search os-interactive">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search certificates…"
            aria-label="Search certificates"
          />
        </label>
        <select
          className="os-select os-interactive"
          value={issuer}
          onChange={(event) => setIssuer(event.target.value)}
          aria-label="Filter by issuer"
        >
          {issuers.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="os-segment" role="group" aria-label="View mode">
          <button
            type="button"
            className={cn("os-interactive", view === "grid" && "is-active")}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            type="button"
            className={cn("os-interactive", view === "list" && "is-active")}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="os-inline-note" role="status">
          Loading certificates…
        </p>
      )}

      {certificates.length === 0 && !isLoading ? (
        <AppEmptyState
          title="No certificates yet"
          description="Add certificates with issuer details and credential links from the admin dashboard."
        />
      ) : filtered.length === 0 ? (
        <AppEmptyState title="No match" description={`No certificates match “${query}”.`} />
      ) : view === "grid" ? (
        <div className="os-explorer-grid" role="list" aria-label="Certificates">
          {filtered.map((cert) => (
            <button
              key={cert.id ?? cert.title}
              type="button"
              role="listitem"
              className="os-explorer-card os-interactive"
              onClick={() => setPreviewId(cert.id ?? null)}
            >
              <div className="os-explorer-card__top">
                <span className="os-explorer-card__icon" aria-hidden="true">
                  {cert.title.charAt(0).toUpperCase()}
                </span>
                <span className="os-explorer-card__status">{formatIssueDate(cert.issueDate)}</span>
              </div>
              <p className="os-explorer-card__title">{cert.title}</p>
              <p className="os-explorer-card__summary">{cert.issuer}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="os-explorer-list" role="list" aria-label="Certificates">
          {filtered.map((cert) => (
            <button
              key={cert.id ?? cert.title}
              type="button"
              role="listitem"
              className="os-explorer-row os-interactive"
              onClick={() => setPreviewId(cert.id ?? null)}
            >
              <span className="os-explorer-row__icon" aria-hidden="true">
                {cert.title.charAt(0).toUpperCase()}
              </span>
              <span className="os-explorer-row__main">
                <span className="os-explorer-row__title">{cert.title}</span>
                <span className="os-explorer-row__summary">{cert.issuer}</span>
              </span>
              <span className="os-explorer-row__meta">{formatIssueDate(cert.issueDate)}</span>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="os-overlay" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setPreviewId(null)}>
          <div className="os-overlay__panel" onClick={(event) => event.stopPropagation()}>
            <header className="os-overlay__header">
              <div className="min-w-0">
                <h3 className="os-overlay__title">{active.title}</h3>
                <p className="os-overlay__subtitle">
                  {active.issuer} · {formatIssueDate(active.issueDate)}
                </p>
              </div>
            </header>
            <div className="os-overlay__body">
              {active.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.imageUrl} alt={active.title} className="os-window-shot" />
              ) : (
                <AppEmptyState
                  title="No document preview"
                  description="Upload a certificate image in the admin dashboard to enable in-app previews."
                />
              )}
            </div>
            <footer className="os-overlay__footer">
              {active.credentialUrl ? (
                <a
                  className="os-btn os-btn--primary os-interactive"
                  href={active.credentialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Verify credential
                </a>
              ) : null}
              <button type="button" className="os-btn os-btn--ghost os-interactive" onClick={() => setPreviewId(null)}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </AppSurface>
  );
}
