"use client";

import { useEffect, useState } from "react";
import { Maximize2, Printer, Download } from "lucide-react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { AppEmptyState, AppSurface } from "./appShared";

export default function ResumeApp() {
  const { profile, resolved } = usePublicProfile();
  const resumeUrl = profile.resumeUrl || "";
  const profileResolved = resolved;
  const url = resumeUrl;
  const [exists, setExists] = useState<"unknown" | "yes" | "no">("unknown");

  useEffect(() => {
    if (!profileResolved) {
      return;
    }
    if (!url) {
      setExists("no");
      return;
    }
    let active = true;
    fetch(url, { method: "HEAD" })
      .then((response) => {
        if (active) {
          setExists(response.ok ? "yes" : "no");
        }
      })
      .catch(() => {
        if (active) {
          setExists("no");
        }
      });
    return () => {
      active = false;
    };
  }, [profileResolved, resolved, url]);

  const openPrintView = () => {
    const w = window.open(url, "_blank", "noopener");
    w?.focus();
  };

  return (
    <AppSurface className="os-app--stretch">
      <div className="os-toolbar">
        <p className="os-toolbar__title">Resume</p>
        {exists === "yes" && (
          <div className="os-toolbar__actions">
            <a className="os-btn os-btn--ghost os-interactive" href={url} download>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download
            </a>
            <button type="button" className="os-btn os-btn--ghost os-interactive" onClick={openPrintView}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              Open / Print
            </button>
            <a className="os-btn os-btn--ghost os-interactive" href={url} target="_blank" rel="noreferrer noopener">
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
              Fullscreen
            </a>
          </div>
        )}
      </div>

      {exists === "unknown" && (
        <div aria-hidden="true">
          <span className="os-skeleton-line os-skeleton-line--w80" />
          <span className="os-skeleton-line os-skeleton-line--w60" />
          <span className="os-skeleton-line os-skeleton-line--w90" />
        </div>
      )}

      {exists === "no" && (
        <AppEmptyState
          title="Resume not available"
          description="No resume file is configured yet. Upload one from the admin panel to enable preview and download here."
        />
      )}

      {exists === "yes" && (
        <iframe
          src={url}
          title="Resume preview"
          className="os-resume-frame"
        />
      )}
    </AppSurface>
  );
}
