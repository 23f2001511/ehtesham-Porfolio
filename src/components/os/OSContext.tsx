"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode
} from "react";

export type Rect = { x: number; y: number; w: number; h: number };

export type AppProps = {
  openApp: (appId: string, data?: Record<string, unknown>) => void;
  data?: Record<string, unknown>;
};

export type AppDefinition = {
  id: string;
  title: string;
  component: ComponentType<AppProps>;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  mobileFullScreen?: boolean;
};

export type DesktopWindow = {
  id: number;
  appId: string;
  title: string;
  rect: Rect;
  z: number;
  state: "normal" | "maximized" | "minimized";
  prevRect: Rect | null;
  data?: Record<string, unknown>;
};

export type Wallpaper = {
  name: string;
  base: string;
  blobA: string;
  blobB: string;
  grid: string;
  particle: string;
  swatch: string;
};

export const WALLPAPERS: Wallpaper[] = [
  {
    name: "Deep Space",
    base: "#05070d",
    blobA: "rgba(34, 211, 238, 0.10)",
    blobB: "rgba(99, 102, 241, 0.09)",
    grid: "rgba(148, 163, 184, 0.06)",
    particle: "rgba(165, 243, 252, 0.55)",
    swatch: "linear-gradient(135deg, #0b1220, #164e63)"
  },
  {
    name: "Slate Ember",
    base: "#0b0a10",
    blobA: "rgba(251, 146, 60, 0.08)",
    blobB: "rgba(244, 63, 94, 0.07)",
    grid: "rgba(148, 163, 184, 0.05)",
    particle: "rgba(254, 215, 170, 0.5)",
    swatch: "linear-gradient(135deg, #1c1114, #7c2d12)"
  },
  {
    name: "Evergreen",
    base: "#04100c",
    blobA: "rgba(16, 185, 129, 0.10)",
    blobB: "rgba(34, 211, 238, 0.06)",
    grid: "rgba(148, 163, 184, 0.05)",
    particle: "rgba(167, 243, 208, 0.5)",
    swatch: "linear-gradient(135deg, #062018, #065f46)"
  },
  {
    name: "Graphite",
    base: "#0a0c10",
    blobA: "rgba(148, 163, 184, 0.08)",
    blobB: "rgba(34, 211, 238, 0.05)",
    grid: "rgba(148, 163, 184, 0.07)",
    particle: "rgba(226, 232, 240, 0.4)",
    swatch: "linear-gradient(135deg, #111827, #334155)"
  }
];

const MIN_W = 360;
const MIN_H = 280;
const TASKBAR = 52;

type Settings = {
  wallpaper: number;
  accent: string;
  particles: boolean;
};

type OSContextValue = {
  windows: DesktopWindow[];
  activeId: number | null;
  clipboard: string;
  isMobile: boolean;
  fullBleedMobile: boolean;
  wallpaperIndex: number;
  accent: string;
  particlesEnabled: boolean;
  cycleWallpaper: () => void;
  setWallpaper: (index: number) => void;
  setAccent: (accent: string) => void;
  toggleParticles: () => void;
  setClipboard: (value: string) => void;
  openApp: (appId: string, data?: Record<string, unknown>) => void;
  closeWindow: (winId: number) => void;
  minimizeWindow: (winId: number) => void;
  toggleMaximize: (winId: number) => void;
  focusWindow: (winId: number) => void;
  updateRect: (winId: number, rect: Rect) => void;
  registerApp: (def: AppDefinition) => void;
  getApp: (appId: string) => AppDefinition | undefined;
  listApps: () => AppDefinition[];
};

const OSContext = createContext<OSContextValue | null>(null);

let windowSequence = 0;

export function OSProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [clipboard, setClipboard] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [accent, setAccentState] = useState("#34d399");
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const zRef = useRef(20);
  const appsRef = useRef(new Map<string, AppDefinition>());

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("portfolio-os-settings");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        if (typeof parsed.wallpaper === "number") {
          setWallpaperIndex(Math.abs(parsed.wallpaper) % WALLPAPERS.length);
        }
        if (typeof parsed.accent === "string" && parsed.accent) {
          setAccentState(parsed.accent);
        }
        if (typeof parsed.particles === "boolean") {
          setParticlesEnabled(parsed.particles);
        }
      }
    } catch {
      // settings are best-effort
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--os-accent", accent);
    try {
      const payload: Settings = { wallpaper: wallpaperIndex, accent, particles: particlesEnabled };
      localStorage.setItem("portfolio-os-settings", JSON.stringify(payload));
    } catch {
      // ignore storage failures
    }
  }, [accent, wallpaperIndex, particlesEnabled]);

  // Keep windows inside the viewport on resize / breakpoint flips.
  useEffect(() => {
    const onResize = () => {
      setWindows((prev) =>
        prev.map((win) => {
          if (win.state === "maximized") {
            return win;
          }
          const maxW = window.innerWidth;
          const maxH = window.innerHeight - TASKBAR;
          const w = Math.min(win.rect.w, maxW);
          const h = Math.min(win.rect.h, maxH);
          const x = Math.min(Math.max(0, win.rect.x), Math.max(0, maxW - w));
          const y = Math.min(Math.max(0, win.rect.y), Math.max(0, maxH - h));
          return { ...win, rect: { x, y, w, h } };
        })
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cycleWallpaper = useCallback(() => {
    setWallpaperIndex((index) => (index + 1) % WALLPAPERS.length);
  }, []);

  const setWallpaper = useCallback((index: number) => {
    setWallpaperIndex(((index % WALLPAPERS.length) + WALLPAPERS.length) % WALLPAPERS.length);
  }, []);

  const setAccent = useCallback((value: string) => setAccentState(value), []);
  const toggleParticles = useCallback(() => setParticlesEnabled((value) => !value), []);

  const registerApp = useCallback((def: AppDefinition) => {
    appsRef.current.set(def.id, def);
  }, []);

  const getApp = useCallback((appId: string) => appsRef.current.get(appId), []);

  const listApps = useCallback(
    () => [...appsRef.current.values()].sort((a, b) => a.title.localeCompare(b.title)),
    []
  );

  const openApp = useCallback(
    (appId: string, data?: Record<string, unknown>) => {
      const def = appsRef.current.get(appId);
      if (!def) {
        return;
      }

      windowSequence += 1;
      zRef.current += 1;
      const id = windowSequence;
      const z = zRef.current;

      setWindows((prev) => {
        const openCount = prev.filter((win) => win.state !== "minimized").length;
        const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
        const vh = typeof window === "undefined" ? 800 : window.innerHeight;
        const w = Math.min(def.defaultSize.w, vw - 24);
        const h = Math.min(def.defaultSize.h, vh - TASKBAR - 24);
        const x = Math.max(8, Math.round((vw - w) / 2) + (openCount % 7) * 28);
        const y = Math.max(8, Math.round((vh - TASKBAR - h) / 2) + (openCount % 7) * 22);

        return [
          ...prev,
          {
            id,
            appId,
            title: data?.title ? String(data.title) : def.title,
            rect: { x, y, w, h },
            z,
            state: "normal",
            prevRect: null,
            data
          }
        ];
      });
      setActiveId(id);
    },
    []
  );

  const closeWindow = useCallback((winId: number) => {
    setWindows((prev) => prev.filter((win) => win.id !== winId));
    setActiveId((current) => (current === winId ? null : current));
  }, []);

  const minimizeWindow = useCallback((winId: number) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === winId ? { ...win, state: "minimized" } : win))
    );
    setActiveId((current) => (current === winId ? null : current));
  }, []);

  const toggleMaximize = useCallback(
    (winId: number) => {
      if (isMobile) {
        return;
      }
      setWindows((prev) =>
        prev.map((win) => {
          if (win.id !== winId) {
            return win;
          }
          if (win.state === "maximized" && win.prevRect) {
            return { ...win, state: "normal", rect: win.prevRect, prevRect: null };
          }
          if (win.state === "normal") {
            return {
              ...win,
              state: "maximized",
              prevRect: win.rect,
              rect: { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - TASKBAR }
            };
          }
          return win;
        })
      );
    },
    [isMobile]
  );

  const focusWindow = useCallback(
    (winId: number) => {
      zRef.current += 1;
      const z = zRef.current;
      setWindows((prev) => {
        const target = prev.find((win) => win.id === winId);
        if (!target) {
          return prev;
        }
        if (target.z === z && target.state !== "minimized") {
          return prev;
        }
        return prev.map((win) =>
          win.id === winId ? { ...win, z, state: "normal" as const } : win
        );
      });
      setActiveId(winId);
    },
    []
  );

  const updateRect = useCallback((winId: number, rect: Rect) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === winId ? { ...win, rect, prevRect: null } : win))
    );
  }, []);

  const value = useMemo<OSContextValue>(
    () => ({
      windows,
      activeId,
      clipboard,
      isMobile,
      fullBleedMobile: isMobile,
      wallpaperIndex,
      accent,
      particlesEnabled,
      cycleWallpaper,
      setWallpaper,
      setAccent,
      toggleParticles,
      setClipboard,
      openApp,
      closeWindow,
      minimizeWindow,
      toggleMaximize,
      focusWindow,
      updateRect,
      registerApp,
      getApp,
      listApps
    }),
    [
      windows,
      activeId,
      clipboard,
      isMobile,
      wallpaperIndex,
      accent,
      particlesEnabled,
      cycleWallpaper,
      setWallpaper,
      setAccent,
      toggleParticles,
      openApp,
      closeWindow,
      minimizeWindow,
      toggleMaximize,
      focusWindow,
      updateRect,
      registerApp,
      getApp,
      listApps
    ]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error("useOS must be used within OSProvider");
  }
  return context;
}

export const OS_MIN_SIZE = { w: MIN_W, h: MIN_H };
export const OS_TASKBAR_HEIGHT = TASKBAR;
