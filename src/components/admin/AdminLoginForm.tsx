"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, LockKeyhole, LogIn, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiResponse, UserProfile } from "@/types";

type ViewMode = "login" | "reset";

export default function AdminLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<ViewMode>("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetMethod, setResetMethod] = useState<"otp" | "secret">("otp");
  const [otpCode, setOtpCode] = useState("");
  const [masterSecret, setMasterSecret] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
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

  async function handleRequestOtp() {
    if (!resetEmail) {
      setResetError("Please enter your admin email first.");
      return;
    }

    setIsSendingOtp(true);
    setResetError("");
    setResetMessage("");

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_otp",
          email: resetEmail
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to request OTP.");
      }

      setResetMessage(data.message || "OTP code sent to your email.");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setResetError("");
    setResetMessage("");

    if (newPassword.length < 6) {
      setResetError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("New passwords do not match.");
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          email: resetEmail,
          newPassword,
          otp: resetMethod === "otp" ? otpCode : undefined,
          masterSecret: resetMethod === "secret" ? masterSecret : undefined
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setResetMessage("Password reset successfully! You can now log in.");
      setTimeout(() => {
        setEmail(resetEmail);
        setPassword("");
        setMode("login");
      }, 2000);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <main className="section-shell grid min-h-screen place-items-center py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          Back to Portfolio
        </Link>

        {mode === "login" ? (
          <Card>
            <CardHeader>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                Sign in to manage projects, skills, certificates, resume, and contact messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email@gmail.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email || "alamehtesham88@gmail.com");
                        setMode("reset");
                      }}
                      className="text-xs text-primary hover:underline font-mono"
                    >
                      Change / Reset password?
                    </button>
                  </div>
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
        ) : (
          <Card>
            <CardHeader>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-md border border-amber-300/25 bg-amber-300/10 text-amber-200">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle>Reset / Change Password</CardTitle>
              <CardDescription>
                Verify your identity with an Email OTP or your Master Secret Key to set a new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Admin Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="alamehtesham88@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Verification Method</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setResetMethod("otp")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 font-medium transition ${
                        resetMethod === "otp"
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Email Code (OTP)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetMethod("secret")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 font-medium transition ${
                        resetMethod === "secret"
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Master Secret Key
                    </button>
                  </div>
                </div>

                {resetMethod === "otp" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp">6-Digit Email Code</Label>
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={isSendingOtp}
                        className="text-xs text-primary hover:underline font-mono disabled:opacity-50"
                      >
                        {isSendingOtp ? "Sending code..." : "Send / Resend Code"}
                      </button>
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 849201"
                      required={resetMethod === "otp"}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="masterSecret">Master SESSION_SECRET</Label>
                    <Input
                      id="masterSecret"
                      type="password"
                      value={masterSecret}
                      onChange={(e) => setMasterSecret(e.target.value)}
                      placeholder="Paste your SESSION_SECRET from .env or Vercel"
                      required={resetMethod === "secret"}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      This is the secret key defined in your .env or Vercel environment variables.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </div>

                {resetMessage ? (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-300/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{resetMessage}</span>
                  </div>
                ) : null}

                {resetError ? (
                  <p className="rounded-md border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-xs text-rose-200">
                    {resetError}
                  </p>
                ) : null}

                <div className="space-y-2 pt-2">
                  <Button type="submit" className="w-full" disabled={isResetting}>
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                    {isResetting ? "Updating Password..." : "Set New Password"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setResetError("");
                      setResetMessage("");
                    }}
                    className="w-full text-center text-xs text-muted-foreground hover:text-white font-mono py-1 transition"
                  >
                    Cancel and return to Sign In
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
