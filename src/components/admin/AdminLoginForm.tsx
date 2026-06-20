"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiResponse, UserProfile } from "@/types";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const payload = (await response.json()) as ApiResponse<UserProfile>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Login failed." : payload.error);
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="section-shell grid min-h-screen place-items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in to manage projects, skills, certificates, resume, social links, and messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error ? (
              <p className="rounded-md border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
