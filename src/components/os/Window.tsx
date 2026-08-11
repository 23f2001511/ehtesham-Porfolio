"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Minus, Square, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { OS_MIN_SIZE, OS_TASKBAR_HEIGHT, useOS, type DesktopWindow } from "./OSContext";

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export default function Window({
  win,
  icon,
  children
}: {
  win: DesktopWindow;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isMobile, focusWindow } = useOS();
  const motionDivRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const mobileFull = isMobile;

  const applyRect = useCallback((x: number, y: number, w: number, h: number) => {
    const el = motionDivRef.current;
    if (!el) {
      return;
    }
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
    el.style.width = `${Math.round(w)}px`;
    el.style.height = `${Math.round(h)}px`;
  }, []);

  useEffect(() => {
    if (win.state === "normal") {
      applyRect(win.rect.x, win.rect.y, win.rect.w, win.rect.h);
    }
  }, [applyRect, win.rect, win.state]);

  const maximized = !mobileFull && win.state === "maximized";

  return (
    <motion.div
      ref={motionDivRef}
      role="dialog"
      aria-modal="false"
      aria-label={win.title}
      data-window-id={win.id}
      className={cn(
        "os-window",
        mobileFull && "os-window--mobile-full",
        maximized && "os-window--maximized"
      )}
      style={{
        left: win.rect.x,
        top: win.rect.y,
        width: win.rect.w,
        height: win.rect.h,
        zIndex: win.z
      }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 8 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 6 }}
      transition={{ duration: reducedMotion ? 0.05 : 0.18, ease: "easeOut" }}
      onPointerDown={() => focusWindow(win.id)}
    >
      <WindowHeader
        win={win}
        icon={icon}
        maximized={maximized}
        mobileFull={mobileFull}
        applyRect={applyRect}
      />
      <div className="os-window__content">{children}</div>
      {!mobileFull && !maximized && <ResizeHandles win={win} applyRect={applyRect} />}
    </motion.div>
  );
}

function WindowHeader({
  win,
  icon,
  maximized,
  mobileFull,
  applyRect
}: {
  win: DesktopWindow;
  icon: React.ReactNode;
  maximized: boolean;
  mobileFull: boolean;
  applyRect: (x: number, y: number, w: number, h: number) => void;
}) {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, updateRect } = useOS();

  const onHeaderPointerDown = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    if (mobileFull || win.state === "maximized") {
      return;
    }
    event.preventDefault();
    focusWindow(win.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const originX = win.rect.x;
    const originY = win.rect.y;
    let last = { ...win.rect };

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const limit = window.innerHeight - OS_TASKBAR_HEIGHT;
      const x = Math.min(Math.max(-win.rect.w + 120, originX + dx), window.innerWidth - 120);
      const y = Math.min(Math.max(0, originY + dy), limit - 40);
      last = { ...last, x, y };
      applyRect(x, y, last.w, last.h);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      updateRect(win.id, last);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <header
      className="os-window__header"
      onPointerDown={onHeaderPointerDown}
      onDoubleClick={() => toggleMaximize(win.id)}
    >
      <div className="os-window__traffic" role="group" aria-label="Window controls">
        <button
          type="button"
          className="os-window__traffic-btn os-window__traffic-btn--close"
          onClick={() => closeWindow(win.id)}
          aria-label="Close window"
        >
          <X aria-hidden="true" />
        </button>
        <button
          type="button"
          className="os-window__traffic-btn os-window__traffic-btn--minimize"
          onClick={() => minimizeWindow(win.id)}
          aria-label="Minimize window"
        >
          <Minus aria-hidden="true" />
        </button>
        <button
          type="button"
          className="os-window__traffic-btn os-window__traffic-btn--maximize"
          onClick={() => toggleMaximize(win.id)}
          aria-label={maximized ? "Restore window" : "Maximize window"}
          disabled={mobileFull}
        >
          {maximized ? <Copy aria-hidden="true" /> : <Square aria-hidden="true" />}
        </button>
      </div>
      <div className="os-window__title">
        {icon}
        <span className="truncate">{win.title}</span>
      </div>
      <div className="os-window__header-spacer" aria-hidden="true" />
    </header>
  );
}

function ResizeHandles({
  win,
  applyRect
}: {
  win: DesktopWindow;
  applyRect: (x: number, y: number, w: number, h: number) => void;
}) {
  const { updateRect, focusWindow } = useOS();

  const bind = (edge: ResizeEdge) => (event: React.PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    focusWindow(win.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const { x: originX, y: originY, w: originW, h: originH } = win.rect;
    let last = { ...win.rect };

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const limit = window.innerHeight - OS_TASKBAR_HEIGHT;
      let x = originX;
      let y = originY;
      let w = originW;
      let h = originH;

      if (edge.includes("e")) {
        w = Math.min(Math.max(OS_MIN_SIZE.w, originW + dx), window.innerWidth - x);
      }
      if (edge.includes("s")) {
        h = Math.min(Math.max(OS_MIN_SIZE.h, originH + dy), limit - y);
      }
      if (edge.includes("w")) {
        const nextW = Math.max(OS_MIN_SIZE.w, originW - dx);
        x = Math.max(0, originX + (originW - nextW));
        w = originX + originW - x;
      }
      if (edge.includes("n")) {
        const nextH = Math.max(OS_MIN_SIZE.h, originH - dy);
        y = Math.max(0, originY + (originH - nextH));
        h = originY + originH - y;
      }

      last = { x, y, w, h };
      applyRect(x, y, w, h);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      updateRect(win.id, last);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const edges: ResizeEdge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  return (
    <>
      {edges.map((edge) => (
        <div
          key={edge}
          className={`os-resize-handle os-resize-handle--${edge}`}
          onPointerDown={bind(edge)}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
