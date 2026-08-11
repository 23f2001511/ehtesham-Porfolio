"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiResponse, EducationItem, ExperienceItem, UserProfile } from "@/types";

const emptyExperience: ExperienceItem = {
  role: "",
  company: "",
  period: "",
  summary: "",
  impact: []
};

const emptyEducation: EducationItem = {
  title: "",
  institution: "",
  period: ""
};

interface ProfileForm {
  tagline: string;
  aboutBio: string;
  phone: string;
  location: string;
  githubUsername: string;
  leetcodeUsername: string;
  experience: ExperienceItem[];
  education: EducationItem[];
}

const emptyForm: ProfileForm = {
  tagline: "",
  aboutBio: "",
  phone: "",
  location: "",
  githubUsername: "",
  leetcodeUsername: "",
  experience: [],
  education: []
};

export default function ProfileManager() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/auth", { cache: "no-store" });
        const payload = (await response.json()) as ApiResponse<UserProfile>;

        if (!payload.success) {
          setFeedback(payload.error || "Unable to load profile.");
          return;
        }

        setForm({
          tagline: payload.data.tagline || "",
          aboutBio: payload.data.aboutBio || "",
          phone: payload.data.phone || "",
          location: payload.data.location || "",
          githubUsername: payload.data.githubUsername || "",
          leetcodeUsername: payload.data.leetcodeUsername || "",
          experience: payload.data.experience ?? [],
          education: payload.data.education ?? []
        });
        setLoaded(true);
      } catch {
        setFeedback("Unable to load profile.");
      }
    }

    void loadProfile();
  }, []);

  const updateField = (key: keyof Omit<ProfileForm, "experience" | "education">, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateExperience = (index: number, patch: Partial<ExperienceItem>) =>
    setForm((prev) => ({
      ...prev,
      experience: prev.experience.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));

  const updateEducation = (index: number, patch: Partial<EducationItem>) =>
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback("");

    const payload = {
      tagline: form.tagline,
      aboutBio: form.aboutBio,
      phone: form.phone,
      location: form.location,
      githubUsername: form.githubUsername,
      leetcodeUsername: form.leetcodeUsername,
      experience: form.experience
        .filter((item) => item.role.trim() && item.company.trim() && item.period.trim())
        .map((item) => ({
          ...item,
          impact: item.impact.map((entry) => entry.trim()).filter(Boolean)
        })),
      education: form.education.filter(
        (item) => item.title.trim() && item.institution.trim() && item.period.trim()
      )
    };

    try {
      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as ApiResponse<UserProfile>;

      if (!result.success) {
        throw new Error(result.error);
      }

      setFeedback("Profile saved.");
    } catch (caught) {
      setFeedback(caught instanceof Error ? caught.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!loaded && !feedback) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">Identity</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(event) => updateField("tagline", event.target.value)}
              placeholder="Short line shown under your name"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Shown only if set"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="aboutBio">About bio</Label>
          <textarea
            id="aboutBio"
            value={form.aboutBio}
            onChange={(event) => updateField("aboutBio", event.target.value)}
            rows={4}
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
            placeholder="A short professional bio for the About app"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">Developer profiles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="githubUsername">GitHub username</Label>
            <Input
              id="githubUsername"
              value={form.githubUsername}
              onChange={(event) => updateField("githubUsername", event.target.value)}
              placeholder="e.g. octocat"
            />
          </div>
          <div>
            <Label htmlFor="leetcodeUsername">LeetCode username</Label>
            <Input
              id="leetcodeUsername"
              value={form.leetcodeUsername}
              onChange={(event) => updateField("leetcodeUsername", event.target.value)}
              placeholder="e.g. octocat"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Experience</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((prev) => ({ ...prev, experience: [...prev.experience, { ...emptyExperience }] }))
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add role
          </Button>
        </div>
        {form.experience.length === 0 ? (
          <p className="text-sm text-muted-foreground">No roles yet.</p>
        ) : (
          form.experience.map((item, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Role"
                  value={item.role}
                  onChange={(event) => updateExperience(index, { role: event.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={item.company}
                  onChange={(event) => updateExperience(index, { company: event.target.value })}
                />
                <Input
                  placeholder="Period (e.g. 2024 - Present)"
                  value={item.period}
                  onChange={(event) => updateExperience(index, { period: event.target.value })}
                />
              </div>
              <textarea
                placeholder="Summary"
                rows={2}
                value={item.summary}
                onChange={(event) => updateExperience(index, { summary: event.target.value })}
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
              />
              <Input
                placeholder="Impact highlights, comma-separated"
                value={item.impact.join(", ")}
                onChange={(event) =>
                  updateExperience(index, {
                    impact: event.target.value.split(",").map((entry) => entry.trim()).filter(Boolean)
                  })
                }
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    experience: prev.experience.filter((_, i) => i !== index)
                  }))
                }
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            </div>
          ))
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Education</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((prev) => ({ ...prev, education: [...prev.education, { ...emptyEducation }] }))
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add education
          </Button>
        </div>
        {form.education.length === 0 ? (
          <p className="text-sm text-muted-foreground">No education entries yet.</p>
        ) : (
          form.education.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-4">
              <Input
                placeholder="Degree / program"
                value={item.title}
                onChange={(event) => updateEducation(index, { title: event.target.value })}
              />
              <Input
                placeholder="Institution"
                value={item.institution}
                onChange={(event) => updateEducation(index, { institution: event.target.value })}
              />
              <Input
                placeholder="Period"
                value={item.period}
                onChange={(event) => updateEducation(index, { period: event.target.value })}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    education: prev.education.filter((_, i) => i !== index)
                  }))
                }
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            </div>
          ))
        )}
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSaving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSaving ? "Saving…" : "Save profile"}
        </Button>
        {feedback && (
          <p className="text-sm text-muted-foreground" role="status">
            {feedback}
          </p>
        )}
      </div>
    </form>
  );
}
