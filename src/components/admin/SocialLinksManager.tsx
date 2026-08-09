"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiResponse, SocialLink, UserProfile } from "@/types";

const emptyLink: SocialLink = {
  label: "",
  href: "",
  icon: "Globe"
};

export default function SocialLinksManager() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [links, setLinks] = useState<SocialLink[]>([emptyLink]);
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
        setLinks(payload.data.socials?.length ? payload.data.socials : [emptyLink]);
      }
    }

    loadProfile();
  }, []);

  function updateLink(index: number, key: keyof SocialLink, value: string) {
    setLinks((current) =>
      current.map((link, currentIndex) =>
        currentIndex === index
          ? {
              ...link,
              [key]: value
            }
          : link
      )
    );
  }

  async function saveLinks() {
    setIsSaving(true);
    setFeedback("");

    try {
      const cleanedLinks = links.filter((link) => link.label && link.href);
      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeUrl,
          socials: cleanedLinks
        })
      });
      const payload = (await response.json()) as ApiResponse<UserProfile>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Unable to save social links." : payload.error);
      }

      setLinks(payload.data.socials.length ? payload.data.socials : [emptyLink]);
      setFeedback("Social links updated successfully.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to save social links.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
      <h1 className="text-2xl font-black text-white">Social Links</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Manage the public links shown in the footer and profile areas.
      </p>

      <div className="mt-6 grid gap-4">
        {links.map((link, index) => (
          <div key={`${link.label}-${index}`} className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_1.4fr_0.8fr_auto]">
            <div className="space-y-2">
              <Label htmlFor={`label-${index}`}>Label</Label>
              <Input
                id={`label-${index}`}
                value={link.label}
                onChange={(event) => updateLink(index, "label", event.target.value)}
                placeholder="GitHub"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`href-${index}`}>URL</Label>
              <Input
                id={`href-${index}`}
                value={link.href}
                onChange={(event) => updateLink(index, "href", event.target.value)}
                placeholder="https://github.com/23f2001511"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`icon-${index}`}>Icon</Label>
              <select
                id={`icon-${index}`}
                value={link.icon}
                onChange={(event) => updateLink(index, "icon", event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
              >
                {["Github", "Linkedin", "Mail", "Twitter", "Globe"].map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                aria-label="Remove social link"
                onClick={() => setLinks((current) => current.filter((_, currentIndex) => currentIndex !== index))}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={() => setLinks((current) => [...current, emptyLink])}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Link
          </Button>
          <Button type="button" onClick={saveLinks} disabled={isSaving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            {isSaving ? "Saving..." : "Save Links"}
          </Button>
        </div>

        {feedback ? (
          <p className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
            {feedback}
          </p>
        ) : null}
      </div>
    </section>
  );
}
