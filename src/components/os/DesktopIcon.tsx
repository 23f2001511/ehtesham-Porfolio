"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Briefcase,
  Code,
  FolderKanban,
  Github,
  GraduationCap,
  Mail,
  ScrollText,
  Settings,
  SquareChevronRight,
  UserRound,
  Wrench
} from "lucide-react";
import { useOS } from "./OSContext";

export type OsIconId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "certificates"
  | "resume"
  | "github"
  | "leetcode"
  | "contact"
  | "terminal"
  | "settings";

export const OS_ICON_MAP: Record<OsIconId, React.ComponentType<{ className?: string }>> = {
  about: UserRound,
  projects: FolderKanban,
  skills: Wrench,
  experience: Briefcase,
  education: GraduationCap,
  certificates: ScrollText,
  resume: BookOpen,
  github: Github,
  leetcode: Code,
  contact: Mail,
  terminal: SquareChevronRight,
  settings: Settings
};

export function AppGlyph({ appId, className }: { appId: string; className?: string }) {
  const Icon = OS_ICON_MAP[appId as OsIconId];
  if (!Icon) {
    return null;
  }
  return <Icon className={className} />;
}

export default function DesktopIcon({ appId, label }: { appId: OsIconId; label: string }) {
  const { openApp } = useOS();
  const [lastTap, setLastTap] = useState(0);
  const Glyph = OS_ICON_MAP[appId];
  const labelId = useMemo(() => `desktop-icon-${appId}`, [appId]);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastTap < 400) {
      openApp(appId);
      setLastTap(0);
    } else {
      setLastTap(now);
    }
  };

  return (
    <button
      type="button"
      className="os-desktop-icon group"
      aria-labelledby={labelId}
      onClick={handleClick}
      onDoubleClick={() => openApp(appId)}
    >
      <span className="os-desktop-icon__tile">
        <Glyph className="h-6 w-6 text-[var(--fg-strong)]" />
      </span>
      <span id={labelId} className="os-desktop-icon__label">
        {label}
      </span>
    </button>
  );
}
