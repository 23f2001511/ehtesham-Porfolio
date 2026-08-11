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

function AppRegistrar() {
  const { registerApp } = useOS();

  useEffect(() => {
    for (const app of OS_ALL_APPS) {
      registerApp(app);
    }
  }, [registerApp]);

  return null;
}

function DesktopIconGrid() {
  return (
    <nav className="os-desktop-grid" aria-label="Portfolio applications">
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
  const { isMobile, openApp } = useOS();
  const reducedMotion = usePrefersReducedMotion();
  const [booted, setBooted] = useState(false);

  const finishBoot = useCallback(() => setBooted(true), []);

  // Double-tap opens About on mobile; open About by default on desktop for a
  // staffed first impression.
  useEffect(() => {
    if (!booted) {
      return;
    }
    openApp(isMobile ? "launcher" : "about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

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
          <DesktopIconGrid />
          <MobileNotice />
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
