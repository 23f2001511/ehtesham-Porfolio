"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOS } from "./OSContext";

const Workstation3DScene = dynamic(() => import("./Workstation3DScene"), { ssr: false });

type Hotspot = { appId: string; label: string };

const HOTSPOTS: Hotspot[] = [
  { appId: "projects", label: "Projects" },
  { appId: "github", label: "GitHub" },
  { appId: "leetcode", label: "LeetCode" },
  { appId: "terminal", label: "Terminal" },
  { appId: "contact", label: "Contact" }
];

export default function WorkstationBackdrop() {
  const { accent, openApp, isMobile } = useOS();
  const reducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<Hotspot | null>(null);
  const [failed, setFailed] = useState(false);

  const hotspots = useMemo(() => HOTSPOTS, []);

  // Mobile or reduced motion gets an elegant static fallback instead of WebGL.
  if (reducedMotion || isMobile || failed) {
    return (
      <div className="os-3d os-3d--static" aria-hidden="true">
        <div className="os-3d__glow os-3d__glow--accent" />
        <div className="os-3d__glow os-3d__glow--violet" />
        <div className="os-3d__grid" />
      </div>
    );
  }

  return (
    <div className="os-3d">
      <WebGLErrorBoundary onError={() => setFailed(true)}>
        <Workstation3DScene
          accent={accent}
          hotspots={hotspots}
          interactive
          onHotspotClick={(appId) => openApp(appId)}
          onHotspotHover={setHovered}
        />
      </WebGLErrorBoundary>
      {hovered && (
        <div className="os-3d__tooltip" role="status">
          {hovered.label}
        </div>
      )}
      <p className="os-3d__hint">Hover the workspace · click a node to open its app</p>
    </div>
  );
}

// Minimal boundary so a WebGL failure degrades to the static backdrop.
import { Component, type ReactNode } from "react";

class WebGLErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
