"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminNavItems, siteConfig } from "@/constants";
import { cn } from "@/lib/utils";
import type { ApiResponse, UserProfile } from "@/types";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth", {
          cache: "no-store"
        });
        const payload = (await response.json()) as ApiResponse<UserProfile>;

        if (!response.ok || !payload.success) {
          throw new Error(payload.success ? "Unauthorized" : payload.error);
        }

        if (active) {
          setUser(payload.data);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : "Unauthorized");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    await fetch("/api/auth", {
      method: "DELETE"
    });
    router.push("/admin/login");
    router.refresh();
  }

  if (isLoading) {
    return (
      <main className="section-shell py-8">
        <Skeleton className="h-16" />
        <div className="mt-6 grid gap-4 lg:grid-cols-[240px_1fr]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="section-shell grid min-h-screen place-items-center py-12">
        <div className="max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-cyan-100" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-black text-white">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in before managing portfolio content.
          </p>
          <Link
            href="/admin/login"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-cyan-300 px-5 text-sm font-semibold text-slate-950"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="section-shell flex min-h-16 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-cyan-100">
              {siteConfig.name}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">Admin dashboard</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
              {user.email}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="section-shell grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-max rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <nav className="grid gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white",
                  pathname === item.href && "bg-cyan-300/10 text-cyan-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
