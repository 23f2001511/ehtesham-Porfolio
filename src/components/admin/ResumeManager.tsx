"use client";

import { useEffect, useState } from "react";
import { FileText, Save } from "lucide-react";
import FileUploader from "@/components/admin/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiResponse, UserProfile } from "@/types";

export default function ResumeManager() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [socials, setSocials] = useState<UserProfile["socials"]>([]);
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/auth", {
        cache: "no-store"
      });
      const payload = (await response.json()) as ApiResponse<UserProfile>;

      if (payload.success) {
        setResumeUrl(payload.data.resumeUrl || "");
        setSocials(payload.data.socials || []);
      }
    }

    loadProfile();
  }, []);

  async function saveResume() {
    setIsSaving(true);
    setFeedback("");

    try {
      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resumeUrl, socials })
      });
      const payload = (await response.json()) as ApiResponse<UserProfile>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Unable to save resume." : payload.error);
      }

      setFeedback("Resume updated successfully.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to save resume.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
      <div className="grid h-12 w-12 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-black text-white">Resume</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Upload a PDF and save its public URL so the homepage resume button always points to the latest file.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="resumeUrl">Resume URL</Label>
          <Input
            id="resumeUrl"
            value={resumeUrl}
            onChange={(event) => setResumeUrl(event.target.value)}
            placeholder="/resume/ehtesham-aalam-resume.pdf"
          />
        </div>

        <FileUploader type="resume" accept="application/pdf" onUploaded={setResumeUrl} />

        {feedback ? (
          <p className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
            {feedback}
          </p>
        ) : null}

        <Button type="button" className="w-full sm:w-max" onClick={saveResume} disabled={isSaving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSaving ? "Saving..." : "Save Resume"}
        </Button>
      </div>
    </section>
  );
}
