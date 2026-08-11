"use client";

import { useEffect } from "react";
import { WALLPAPERS, useOS } from "../OSContext";
import type { AppProps } from "../OSContext";
import { AppSection, AppSurface } from "./appShared";

const ACCENTS = [
  { name: "Cyan", value: "#22d3ee" },
  { name: "Emerald", value: "#10b981" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#fb7185" }
];

export default function SettingsApp({ data }: AppProps) {
  const {
    wallpaperIndex,
    setWallpaper,
    accent,
    setAccent,
    particlesEnabled,
    toggleParticles
  } = useOS();

  useEffect(() => {
    const requested = data?.wallpaper;
    if (typeof requested === "number" && !Number.isNaN(requested)) {
      setWallpaper(requested);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppSurface>
      <AppSection title="Wallpaper">
        <div className="os-wallpaper-picker" role="listbox" aria-label="Wallpaper">
          {WALLPAPERS.map((wallpaper, index) => (
            <button
              key={wallpaper.name}
              type="button"
              role="option"
              aria-selected={wallpaperIndex === index}
              className={
                "os-wallpaper-picker__option os-interactive" +
                (wallpaperIndex === index ? " os-wallpaper-picker__option--active" : "")
              }
              onClick={() => setWallpaper(index)}
            >
              <span
                className="os-wallpaper-picker__swatch"
                style={{ background: wallpaper.swatch }}
                aria-hidden="true"
              />
              <span className="os-wallpaper-picker__name">{wallpaper.name}</span>
            </button>
          ))}
        </div>
      </AppSection>

      <AppSection title="Accent color">
        <div className="os-chip-row" role="listbox" aria-label="Accent color">
          {ACCENTS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={accent === option.value}
              className={
                "os-accent-swatch os-interactive" +
                (accent === option.value ? " os-accent-swatch--active" : "")
              }
              style={{ backgroundColor: option.value }}
              onClick={() => setAccent(option.value)}
              aria-label={option.name}
            />
          ))}
        </div>
      </AppSection>

      <AppSection title="Motion">
        <button
          type="button"
          role="switch"
          aria-checked={particlesEnabled}
          className="os-switch os-interactive"
          onClick={toggleParticles}
        >
          <span className="os-switch__track" aria-hidden="true">
            <span className="os-switch__thumb" />
          </span>
          <span>
            Ambient particles
            <span className="os-switch__hint">subtle drifting dots on the desktop</span>
          </span>
        </button>
      </AppSection>
    </AppSurface>
  );
}
