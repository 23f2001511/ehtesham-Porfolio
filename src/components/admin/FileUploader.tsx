"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiResponse } from "@/types";

type FileUploaderProps = {
  type: "resume" | "project" | "certificate" | "avatar";
  accept: string;
  onUploaded: (url: string) => void;
};

export default function FileUploader({ type, accept, onUploaded }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleUpload() {
    if (!file) {
      setFeedback("Choose a file first.");
      return;
    }

    setIsUploading(true);
    setFeedback("");

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const payload = (await response.json()) as ApiResponse<{ url: string }>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Upload failed." : payload.error);
      }

      onUploaded(payload.data.url);
      setFeedback("Upload complete.");
      setFile(null);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-white/[0.03] p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept={accept}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
        />
        <Button type="button" size="sm" onClick={handleUpload} disabled={isUploading}>
          <Upload className="h-4 w-4" aria-hidden="true" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      {feedback ? <p className="mt-2 text-xs text-muted-foreground">{feedback}</p> : null}
    </div>
  );
}
