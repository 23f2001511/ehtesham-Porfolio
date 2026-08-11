import type { AppDefinition } from "@/components/os/OSContext";
import TerminalApp from "@/components/os/apps/TerminalApp";
import AboutApp from "@/components/os/apps/AboutApp";
import ProjectsApp from "@/components/os/apps/ProjectsApp";
import ProjectDetailApp from "@/components/os/apps/ProjectDetailApp";
import SkillsApp from "@/components/os/apps/SkillsApp";
import ExperienceApp from "@/components/os/apps/ExperienceApp";
import EducationApp from "@/components/os/apps/EducationApp";
import CertificatesApp from "@/components/os/apps/CertificatesApp";
import ResumeApp from "@/components/os/apps/ResumeApp";
import GithubApp from "@/components/os/apps/GithubApp";
import LeetcodeApp from "@/components/os/apps/LeetcodeApp";
import ContactApp from "@/components/os/apps/ContactApp";
import SettingsApp from "@/components/os/apps/SettingsApp";
import LauncherApp from "@/components/os/apps/LauncherApp";

// Apps rendered as grid icons on the desktop wallpaper.
export const OS_DESKTOP_APPS: AppDefinition[] = [
  {
    id: "about",
    title: "About",
    component: AboutApp,
    defaultSize: { w: 720, h: 540 },
    minSize: { w: 480, h: 380 }
  },
  {
    id: "projects",
    title: "Projects",
    component: ProjectsApp,
    defaultSize: { w: 920, h: 620 },
    minSize: { w: 560, h: 380 }
  },
  {
    id: "skills",
    title: "Skills",
    component: SkillsApp,
    defaultSize: { w: 780, h: 580 },
    minSize: { w: 520, h: 360 }
  },
  {
    id: "experience",
    title: "Experience",
    component: ExperienceApp,
    defaultSize: { w: 720, h: 560 },
    minSize: { w: 480, h: 380 }
  },
  {
    id: "education",
    title: "Education",
    component: EducationApp,
    defaultSize: { w: 620, h: 440 },
    minSize: { w: 440, h: 320 }
  },
  {
    id: "certificates",
    title: "Certificates",
    component: CertificatesApp,
    defaultSize: { w: 740, h: 540 },
    minSize: { w: 500, h: 360 }
  },
  {
    id: "contact",
    title: "Contact",
    component: ContactApp,
    defaultSize: { w: 700, h: 560 },
    minSize: { w: 500, h: 420 }
  }
];

// Reachable via launcher / taskbar / palette — hidden from the desktop grid
// to keep the wallpaper uncluttered.
export const OS_HIDDEN_APPS: AppDefinition[] = [
  {
    id: "resume",
    title: "Resume",
    component: ResumeApp,
    defaultSize: { w: 820, h: 600 },
    minSize: { w: 520, h: 400 }
  },
  {
    id: "github",
    title: "GitHub",
    component: GithubApp,
    defaultSize: { w: 900, h: 620 },
    minSize: { w: 560, h: 400 }
  },
  {
    id: "leetcode",
    title: "LeetCode",
    component: LeetcodeApp,
    defaultSize: { w: 860, h: 600 },
    minSize: { w: 540, h: 400 }
  },
  {
    id: "terminal",
    title: "Terminal",
    component: TerminalApp,
    defaultSize: { w: 680, h: 440 },
    minSize: { w: 440, h: 300 }
  },
  {
    id: "project-detail",
    title: "Project",
    component: ProjectDetailApp,
    defaultSize: { w: 760, h: 580 },
    minSize: { w: 480, h: 380 }
  },
  {
    id: "settings",
    title: "Settings",
    component: SettingsApp,
    defaultSize: { w: 620, h: 460 },
    minSize: { w: 440, h: 340 }
  },
  {
    id: "launcher",
    title: "Launcher",
    component: LauncherApp,
    defaultSize: { w: 620, h: 480 },
    minSize: { w: 420, h: 340 }
  }
];

export const OS_ALL_APPS: AppDefinition[] = [...OS_DESKTOP_APPS, ...OS_HIDDEN_APPS];
