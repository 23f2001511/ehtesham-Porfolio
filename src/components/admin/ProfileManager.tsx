"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Save, Trash2, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUploader from "@/components/admin/FileUploader";
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
  avatarUrl: string;
  phone: string;
  location: string;
  githubUsername: string;
  leetcodeUsername: string;
  collegeEmail: string;
  otherEmail: string;
  experience: ExperienceItem[];
  education: EducationItem[];
}

const emptyForm: ProfileForm = {
  tagline: "",
  aboutBio: "",
  avatarUrl: "",
  phone: "",
  location: "",
  githubUsername: "",
  leetcodeUsername: "",
  collegeEmail: "",
  otherEmail: "",
  experience: [],
  education: []
};

export default function ProfileManager() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Security / Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", text: "New passwords do not match." });
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change",
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPasswordFeedback({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to change password."
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

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
          avatarUrl: payload.data.avatarUrl || "",
          phone: payload.data.phone || "",
          location: payload.data.location || "",
          githubUsername: payload.data.githubUsername || "",
          leetcodeUsername: payload.data.leetcodeUsername || "",
          collegeEmail: payload.data.collegeEmail || "",
          otherEmail: payload.data.otherEmail || "",
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
      avatarUrl: form.avatarUrl,
      phone: form.phone,
      location: form.location,
      githubUsername: form.githubUsername,
      leetcodeUsername: form.leetcodeUsername,
      collegeEmail: form.collegeEmail,
      otherEmail: form.otherEmail,
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
    <div className="space-y-12">
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
        <div>
          <Label>Profile photo</Label>
          <p className="mb-3 text-xs text-muted-foreground">
            Shown on the home hero. JPG, PNG, or WebP up to 5&nbsp;MB. If no photo is set, an animated
            planet placeholder appears instead.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface">
              {form.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.avatarUrl}
                  alt="Current profile photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/25 to-accent/15 text-xs text-muted-foreground">
                  No photo
                </span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <FileUploader
                type="avatar"
                accept="image/png,image/jpeg,image/webp"
                onUploaded={(url) => setForm((prev) => ({ ...prev, avatarUrl: url }))}
              />
              {form.avatarUrl ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setForm((prev) => ({ ...prev, avatarUrl: "" }))}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Remove photo
                </Button>
              ) : null}
            </div>
          </div>
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
          <div>
            <Label htmlFor="collegeEmail">College email</Label>
            <Input
              id="collegeEmail"
              type="email"
              value={form.collegeEmail}
              onChange={(event) => updateField("collegeEmail", event.target.value)}
              placeholder="e.g. name@college.edu"
            />
          </div>
          <div>
            <Label htmlFor="otherEmail">Other email</Label>
            <Input
              id="otherEmail"
              type="email"
              value={form.otherEmail}
              onChange={(event) => updateField("otherEmail", event.target.value)}
              placeholder="e.g. name@example.com"
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

    {/* Security & Password Change */}
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg border border-amber-300/25 bg-amber-300/10 text-amber-200">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Security & Password</h2>
          <p className="text-xs text-muted-foreground">Update your admin login password securely.</p>
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>

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

        {passwordFeedback && (
          <div
            className={`flex items-center gap-2 rounded-md p-3 text-xs ${
              passwordFeedback.type === "success"
                ? "border border-emerald-300/25 bg-emerald-500/10 text-emerald-200"
                : "border border-rose-300/25 bg-rose-300/10 text-rose-200"
            }`}
          >
            {passwordFeedback.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
            <span>{passwordFeedback.text}</span>
          </div>
        )}

        <Button type="submit" disabled={isChangingPassword} className="w-full sm:w-auto">
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          {isChangingPassword ? "Updating Password…" : "Update Password"}
        </Button>
      </form>
    </section>
  </div>
  );
}
