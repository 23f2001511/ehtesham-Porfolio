"use client";

import { useEffect, useState } from "react";
import { Archive, Check, FolderKanban, GraduationCap, Mail, Trash2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse, Certificate, Message, Project, Skill } from "@/types";

type DashboardData = {
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  messages: Message[];
};

const metricConfig = [
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "skills", label: "Skills", icon: Wrench },
  { key: "certificates", label: "Certificates", icon: GraduationCap },
  { key: "messages", label: "Messages", icon: Mail }
] as const;

async function fetchCollection<T>(endpoint: string) {
  const response = await fetch(endpoint, {
    cache: "no-store"
  });
  const payload = (await response.json()) as ApiResponse<T[]>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.success ? "Unable to load dashboard data." : payload.error);
  }

  return payload.data;
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    skills: [],
    certificates: [],
    messages: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setIsLoading(true);
    setError("");

    try {
      const [projects, skills, certificates, messages] = await Promise.all([
        fetchCollection<Project>("/api/projects"),
        fetchCollection<Skill>("/api/skills"),
        fetchCollection<Certificate>("/api/certificates"),
        fetchCollection<Message>("/api/contact")
      ]);

      setData({ projects, skills, certificates, messages });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function updateMessage(id: string | undefined, status: Message["status"]) {
    if (!id) {
      return;
    }

    await fetch("/api/contact", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, status })
    });
    await loadDashboard();
  }

  async function deleteMessage(id: string | undefined) {
    if (!id) {
      return;
    }

    await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    await loadDashboard();
  }

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section>
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Manage portfolio content and respond to contact messages from one place.
        </p>
      </section>

      {error ? (
        <p className="rounded-md border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricConfig.map((metric) => {
          const Icon = metric.icon;
          const count = data[metric.key].length;

          return (
            <div key={metric.key} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-3xl font-black text-white">{count}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-200">{metric.label}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white">Messages</h2>
            <p className="mt-1 text-sm text-muted-foreground">Review, mark, archive, or delete contact requests.</p>
          </div>
        </div>

        {data.messages.length ? (
          <div className="mt-5 grid gap-3">
            {data.messages.map((message) => (
              <article key={message.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{message.name}</h3>
                      <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">
                        {message.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-cyan-100">{message.email}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-200">{message.subject}</p>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{message.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => updateMessage(message.id, "read")}>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Read
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateMessage(message.id, "archived")}
                    >
                      <Archive className="h-4 w-4" aria-hidden="true" />
                      Archive
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => deleteMessage(message.id)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No messages yet"
            description="Contact form submissions will appear here after visitors send a message."
            className="mt-5"
          />
        )}
      </section>
    </div>
  );
}
