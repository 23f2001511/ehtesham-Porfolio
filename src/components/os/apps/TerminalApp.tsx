"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useAnimatedType } from "@/hooks/useAnimatedType";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { siteConfig } from "@/constants";
import { formatDateTime } from "@/lib/datetime";
import type { AppProps } from "../OSContext";
import { usePortfolioData } from "../PortfolioDataContext";
import { OS_ALL_APPS } from "./registry";
import { AppSurface } from "./appShared";

type HistoryEntry = { id: number; kind: "cmd" | "out"; text: string };
let sequence = 0;

function line(text: string, kind: HistoryEntry["kind"]): HistoryEntry {
  sequence += 1;
  return { id: sequence, kind, text };
}

function OutputLine({ entry }: { entry: HistoryEntry }) {
  const animated = useAnimatedType(entry.text, entry.kind === "cmd" ? 9999 : 90);
  return (
    <p className={entry.kind === "cmd" ? "os-terminal__line os-terminal__line--cmd" : "os-terminal__line"}>
      {animated}
    </p>
  );
}

export default function TerminalApp({ openApp }: AppProps) {
  const { profile, resolved } = usePublicProfile();
  const { projects, skills } = usePortfolioData();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const printableApps = useMemo(
    () => OS_ALL_APPS.filter((app) => app.id !== "launcher" && app.id !== "project-detail"),
    []
  );

  const print = (lines: string[], kind: HistoryEntry["kind"] = "out") => {
    setHistory((prev) => [...prev, ...lines.map((text) => line(text, kind))]);
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) {
      return;
    }
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    print([`$ ${cmd}`], "cmd");

    const parts = cmd.split(/\s+/);
    const head = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    switch (head) {
      case "help":
        print([
          "Available commands:",
          "  help                show this help",
          "  about               open the About app",
          "  about --json        print profile as JSON",
          "  projects            list projects",
          "  projects --open     open the Projects app",
          "  project <slug>      project details / open detail window",
          "  ls                  list openable apps",
          "  open <app>          open an app (about projects skills …)",
          "  skills              grouped skills",
          "  experience          experience timeline",
          "  education           education entries",
          "  certificates        certificates",
          "  resume              open the Resume app",
          "  github              open the GitHub app",
          "  leetcode            open the LeetCode app",
          "  contact             print contact + open Contact app",
          "  neofetch            system summary",
          "  theme [0-3]         change wallpaper",
          "  date                current system time",
          "  whoami              owner",
          "  clear               clear the screen"
        ]);
        break;

    case "about": {
        if (arg === "--json") {
          const summary = {
            name: profile.name,
            email: profile.email || null,
            tagline: profile.tagline || null,
            location: profile.location || null
          };
          print(JSON.stringify(summary, null, 2).split("\n"));
        } else {
          openApp("about");
          print(["Opened About"]);
        }
        break;
      }

      case "projects": {
        if (arg === "--open") {
          openApp("projects");
          break;
        }
        if (!projects.length) {
          print(["No projects configured."]);
          break;
        }
        print(projects.map((project) => `${project.slug.padEnd(32)} ${project.title}  [${project.status}]`));
        break;
      }

      case "project": {
        const project = projects.find((item) => item.slug === arg.toLowerCase());
        if (!arg) {
          print(["usage: project <slug>"]);
        } else if (!project) {
          print([`project not found: ${arg}`]);
        } else {
          openApp("project-detail", { slug: project.slug, title: project.title });
          print([`Opened ${project.title}`]);
        }
        break;
      }

      case "ls":
        print([printableApps.map((app) => app.id).join("  ")]);
        break;

      case "open": {
        const target = printableApps.find((app) => app.id === arg.toLowerCase());
        if (!target) {
          print([`app not found: ${arg}. Try "ls".`]);
        } else {
          openApp(target.id);
          print([`Opened ${target.title}`]);
        }
        break;
      }

      case "skills": {
        if (!skills.length) {
          print(["No skills configured."]);
          break;
        }
        const groups = new Map<string, string[]>();
        for (const skill of skills) {
          const list = groups.get(skill.category) || [];
          list.push(`${skill.name} ${skill.level}%`);
          groups.set(skill.category, list);
        }
        const lines: string[] = [];
        for (const [category, items] of [...groups.entries()].sort()) {
          lines.push(`${category}:`);
          lines.push(`  ${items.join(", ")}`);
        }
        print(lines);
        break;
      }

      case "experience": {
        const items = profile.experience ?? [];
        if (!items.length) {
          print(["No experience recorded yet."]);
        } else {
          print(
            items.flatMap((item) => [
              `${item.role} @ ${item.company} (${item.period})`,
              `  ${item.summary}`
            ])
          );
        }
        break;
      }

      case "education": {
        const items = profile.education ?? [];
        if (!items.length) {
          print(["No education configured."]);
        } else {
          print(items.map((item) => `${item.title} — ${item.institution} (${item.period})`));
        }
        break;
      }

      case "certificates":
        openApp("certificates");
        print(["Opened Certificates"]);
        break;

      case "resume":
        openApp("resume");
        print(["Opened Resume"]);
        break;

      case "github":
        openApp("github");
        print(["Opened GitHub"]);
        break;

      case "leetcode":
        openApp("leetcode");
        print(["Opened LeetCode"]);
        break;

      case "contact": {
        const channels = [profile.email, profile.phone, ...(profile.socials?.map((s) => s.href) ?? [])].filter(
          Boolean
        );
        if (channels.length) {
          print(channels as string[]);
        }
        openApp("contact");
        print(["Opened Contact"]);
        break;
      }

      case "neofetch": {
        print([
          `${siteConfig.name}  ·  Developer OS 1.0`,
          `shell: portfolio-sh   wm: os-wm (floating)`,
          `apps: ${printableApps.length}   projects: ${projects.length}   skills: ${skills.length}`,
          `uptime: since you opened this window   palette: Ctrl/⌘ K`
        ]);
        break;
      }

      case "theme": {
        const index = Number.parseInt(arg, 10);
        if (Number.isNaN(index)) {
          print(["usage: theme [0-3]  — opens Settings otherwise"]);
          openApp("settings");
        } else {
          openApp("settings", { wallpaper: index });
        }
        break;
      }

      case "date":
        print([formatDateTime(new Date(), { dateStyle: "full", timeStyle: "medium" })]);
        break;

      case "whoami":
        print([`guest  (owner: ${siteConfig.name})`]);
        break;

      case "clear":
        setHistory([]);
        break;

      default:
        print([`command not found: ${head}. Type "help".`]);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) {
        return;
      }
      const next = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(commandHistory[next]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) {
        return;
      }
      const next = historyIndex + 1;
      if (next >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(commandHistory[next]);
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const commands = ["help", "about", "projects", "skills", "experience", "education", "certificates", "resume", "github", "leetcode", "contact", "clear"];
      const match = commands.find((cmd) => cmd.startsWith(input.trim().toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  useEffect(() => {
    if (resolved) {
      print([`Developer OS shell — type "help" to begin.`, `logged in as guest on ${siteConfig.name}'s workstation`]);
    }
  }, [resolved]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <AppSurface className="os-terminal" onClick={() => inputRef.current?.focus()}>
      <div className="os-terminal__scroll" ref={scrollRef} aria-live="polite" aria-label="Terminal output">
        {history.map((entry) => (
          <OutputLine key={entry.id} entry={entry} />
        ))}
      </div>
      <label className="os-terminal__prompt">
        <span className="os-terminal__prompt-symbol" aria-hidden="true">
          guest@devos:~$
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal command input"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
        />
      </label>
    </AppSurface>
  );
}
