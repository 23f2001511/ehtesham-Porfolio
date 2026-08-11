"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/constants";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PortfolioDataProvider } from "./PortfolioDataContext";
import { OSProvider, useOS } from "./OSContext";
import { OS_ALL_APPS, OS_DESKTOP_APPS } from "./apps/registry";
import Desktop from "./Desktop";
import "./os.css";
import DesktopIcon, { type OsIconId } from "./DesktopIcon";
import Taskbar from "./Taskbar";
import WindowManager from "./WindowManager";
import CommandPalette from "./CommandPalette";
import BootScreen from "./BootScreen";
import HeroOverlay from "./HeroOverlay";
import WorkstationBackdrop from "./WorkstationBackdrop";

const HERO_SEEN_KEY = "portfolio-os-hero-dismissed";

function AppRegistrar() {
  const { registerApp } = useOS();

  useEffect(() => {
    for (const app of OS_ALL_APPS) {
      registerApp(app);
    }
  }, [registerApp]);

  return null;
}

export function DesktopIconGrid() {
  const { isMobile } = useOS();
  const style = isMobile
    ? undefined
    : { ["--os-icon-columns" as string]: 7, top: "calc(var(--os-hero-height, 452px) + 16px)" };
  return (
    <nav className="os-desktop-grid" style={style} aria-label="Portfolio applications">
      {OS_DESKTOP_APPS.map((app) => (
        <DesktopIcon key={app.id} appId={app.id as OsIconId} label={app.title} />
      ))}
    </nav>
  );
}

function MobileNotice() {
  return (
    <div className="os-mobile-notice" role="status">
      <p>{siteConfig.name} · Developer OS</p>
      <p>Tap an app to open it. Windows work full-screen here.</p>
    </div>
  );
}

function OSShell() {
  const { isMobile, windows } = useOS();
  const reducedMotion = usePrefersReducedMotion();
  const [booted, setBooted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const finishBoot = useCallback(() => {
    setBooted(true);
    if (isMobile) {
      // Mobile goes straight to the launcher; no hero / 3D there.
      return;
    }
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(HERO_SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    setHeroVisible(!seen);
  }, [isMobile]);

  const dismissHero = useCallback(() => {
    setHeroVisible(false);
    try {
      window.sessionStorage.setItem(HERO_SEEN_KEY, "1");
    } catch {
      // storage is best-effort
    }
  }, []);

  // Keep the hero readable: it yields the moment any window opens or is
  // maximized (desktop icons, palette, 3D nodes, CTA all open windows).
  const heroSuppressed = windows.some((win) => win.state !== "minimized");
  const showHero = heroVisible && !heroSuppressed;

  return (
    <div className="os-root">
      <Desktop />
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.3 }}
            style={{ position: "fixed", inset: 0, zIndex: 100 }}
          >
            <BootScreen onDone={finishBoot} />
          </motion.div>
        )}
      </AnimatePresence>

      {booted && (
        <>
          <AppRegistrar />
          {!isMobile && (
            <div className="os-3d-wrap" aria-hidden="true">
              <WorkstationBackdrop />
            </div>
          )}
          <DesktopIconGrid />
          <MobileNotice />
          <AnimatePresence>
            {showHero && <HeroOverlay key="hero" onDismiss={dismissHero} />}
          </AnimatePresence>
          <WindowManager />
          <CommandPalette />
          <Taskbar />
        </>
      )}
    </div>
  );
}

export default function PortfolioOS() {
  return (
    <OSProvider>
      <PortfolioDataProvider>
        <noscript>
          <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
            <h1>{siteConfig.name} — Full Stack Developer</h1>
            <p>{siteConfig.description}</p>
          </div>
        </noscript>
        <OSShell />
      </PortfolioDataProvider>
    </OSProvider>
  );
}
