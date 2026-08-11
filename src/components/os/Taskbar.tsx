"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOS } from "./OSContext";
import { formatClock, formatTrayDate, useCurrentTime } from "@/hooks/useCurrentTime";

export default function Taskbar() {
  const { windows, openApp, focusWindow, minimizeWindow, activeId, isMobile } = useOS();
  const now = useCurrentTime();
  const reducedMotion = usePrefersReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }
    const active = node.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [windows, activeId]);

  const toggleLauncher = () => {
    openApp("launcher");
  };

  return (
    <div className="os-taskbar" role="contentinfo" aria-label="System taskbar">
      <div className="os-taskbar__launcher">
        <button
          type="button"
          className="os-taskbar__launcher-btn os-interactive"
          onClick={toggleLauncher}
          aria-label="Open application launcher"
        >
          <Grid3x3 aria-hidden="true" />
        </button>
      </div>

      <div className="os-taskbar__running" ref={listRef} role="list" aria-label="Running applications">
        <AnimatePresence initial={false}>
          {windows.map((win) => {
            const isActive = win.id === activeId && win.state !== "minimized";
            const minimized = win.state === "minimized";
            return (
              <motion.button
                key={win.id}
                type="button"
                role="listitem"
                data-active={isActive}
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  "os-taskbar__app os-interactive",
                  isActive && "os-taskbar__app--active",
                  minimized && "os-taskbar__app--minimized"
                )}
                onClick={() => {
                  if (minimized) {
                    focusWindow(win.id);
                  } else if (isActive) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
                aria-label={`${win.title}${minimized ? " (minimized)" : isActive ? " (active)" : ""}`}
              >
                <span className={`os-app-icon os-app-icon--${win.appId}`} aria-hidden="true" />
                <span className="os-taskbar__app-label">{win.title}</span>
                <span className="os-taskbar__app-dot" aria-hidden="true" />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="os-taskbar__tray">
        {!isMobile && (
          <button
            type="button"
            className="os-taskbar__terminal os-interactive"
            onClick={() => openApp("terminal")}
            aria-label="Open terminal"
          >
            <span className="os-app-icon os-app-icon--terminal os-app-icon--sm" aria-hidden="true" />
          </button>
        )}
        <div className="os-taskbar__clock" aria-label="Current time">
          <span className="os-taskbar__clock-time">{formatClock(now)}</span>
          {!isMobile && <span className="os-taskbar__clock-date">{formatTrayDate(now)}</span>}
        </div>
      </div>
    </div>
  );
}
