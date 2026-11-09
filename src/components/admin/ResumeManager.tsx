"use client";

import { useEffect, useState } from "react";
import { FileText, Save, ExternalLink, CheckCircle2 } from "lucide-react";
import FileUploader from "@/components/admin/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invalidatePublicProfileCache } from "@/hooks/usePublicProfile";
import type { ApiResponse, UserProfile } from "@/types";

export default function ResumeManager() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/auth", { cache: "no-store" });
        const payload = (await response.json()) as ApiResponse<UserProfile>;

        if (payload.success && payload.data.resumeUrl) {
          setResumeUrl(payload.data.resumeUrl);
        }
      } catch (e) {
        console.error("Failed to load profile for resume:", e);
      }
    }

    loadProfile();
  }, []);

  async function saveResume(targetUrl?: string) {
    const urlToSave = targetUrl !== undefined ? targetUrl : resumeUrl;
    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resumeUrl: urlToSave })
      });
      const payload = (await response.json()) as ApiResponse<UserProfile>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Unable to save resume." : payload.error);
      }

      invalidatePublicProfileCache();
      setResumeUrl(urlToSave);
      setFeedback({
        message: "Resume saved and updated across entire portfolio!",
        type: "success"
      });
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : "Unable to save resume.",
        type: "error"
      });
    } finally {
      setIsSaving(false);
    }
  }

  // When a file is uploaded, auto-save it immediately so user doesn't have to click another button
  async function handleFileUploaded(newUrl: string) {
    setResumeUrl(newUrl);
    await saveResume(newUrl);
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
      <div className="grid h-12 w-12 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-black text-white">Resume</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Upload your PDF resume below. It will automatically save and update the download buttons across the entire portfolio (Navbar, Hero, and Footer).
      </p>

      <div className="mt-6 grid gap-5">
        {/* Upload box */}
        <div className="space-y-2">
          <Label>Upload New PDF Resume</Label>
          <FileUploader
            type="resume"
            accept="application/pdf"
            onUploaded={handleFileUploaded}
          />
        </div>

        {/* URL Input and Manual Save */}
        <div className="space-y-2">
          <Label htmlFor="resumeUrl">Live Resume URL / Path</Label>
          <Input
            id="resumeUrl"
            value={resumeUrl}
            onChange={(event) => setResumeUrl(event.target.value)}
            placeholder="/resume/ehtesham-aalam-resume.pdf"
          />
        </div>

        {/* Live Preview Button if resumeUrl exists */}
        {resumeUrl && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-[#7042f8]/30 bg-[#07011d]/60">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-gray-300 truncate font-mono">
              Current File: <strong className="text-white">{resumeUrl}</strong>
            </span>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f0ff] hover:underline shrink-0"
            >
              <span>Preview</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Status Feedback */}
        {feedback && (
          <p
            className={`rounded-md border px-3 py-2 text-sm ${
              feedback.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <Button
          type="button"
          className="w-full sm:w-max"
          onClick={() => saveResume()}
          disabled={isSaving}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSaving ? "Saving..." : "Save Resume URL"}
        </Button>
      </div>
    </section>
  );
}
