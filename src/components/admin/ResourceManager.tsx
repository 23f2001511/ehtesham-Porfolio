"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import FileUploader from "@/components/admin/FileUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { ApiResponse } from "@/types";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "tags" | "select" | "url" | "date" | "upload";
  placeholder?: string;
  options?: string[];
  uploadType?: "project" | "certificate";
};

type ResourceItem = Record<string, unknown> & {
  id?: string;
  title?: string;
  name?: string;
  summary?: string;
  category?: string;
  issuer?: string;
  email?: string;
};

type ResourceManagerProps = {
  title: string;
  description: string;
  endpoint: string;
  fields: FieldConfig[];
  emptyTitle: string;
  emptyDescription: string;
};

type FormState = Record<string, string | number | boolean>;

function getInitialForm(fields: FieldConfig[]): FormState {
  return fields.reduce<FormState>((accumulator, field) => {
    if (field.type === "checkbox") {
      accumulator[field.name] = false;
    } else if (field.type === "number") {
      accumulator[field.name] = 0;
    } else if (field.type === "select") {
      accumulator[field.name] = field.options?.[0] || "";
    } else {
      accumulator[field.name] = "";
    }

    return accumulator;
  }, {});
}

function toFormValue(field: FieldConfig, value: unknown) {
  if (field.type === "tags" && Array.isArray(value)) {
    return value.join(", ");
  }

  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "number") {
    return Number(value || 0);
  }

  return typeof value === "string" || typeof value === "number" ? value : "";
}

function toPayload(fields: FieldConfig[], form: FormState) {
  return fields.reduce<Record<string, unknown>>((accumulator, field) => {
    const value = form[field.name];

    if (field.type === "tags") {
      accumulator[field.name] = String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (field.type === "number") {
      accumulator[field.name] = Number(value || 0);
    } else if (field.type === "checkbox") {
      accumulator[field.name] = Boolean(value);
    } else {
      accumulator[field.name] = String(value || "");
    }

    return accumulator;
  }, {});
}

export default function ResourceManager({
  title,
  description,
  endpoint,
  fields,
  emptyTitle,
  emptyDescription
}: ResourceManagerProps) {
  const initialForm = useMemo(() => getInitialForm(fields), [fields]);
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setFeedback("");

    try {
      const response = await fetch(endpoint, {
        cache: "no-store"
      });
      const payload = (await response.json()) as ApiResponse<ResourceItem[]>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Unable to load records." : payload.error);
      }

      setItems(payload.data);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to load records.");
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function resetForm() {
    setForm(initialForm);
    setEditingId("");
  }

  function startEdit(item: ResourceItem) {
    const nextForm = fields.reduce<FormState>((accumulator, field) => {
      accumulator[field.name] = toFormValue(field, item[field.name]);
      return accumulator;
    }, {});

    setForm(nextForm);
    setEditingId(item.id || "");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback("");

    try {
      const payload = toPayload(fields, form);
      const response = await fetch(endpoint, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload)
      });
      const result = (await response.json()) as ApiResponse<ResourceItem>;

      if (!response.ok || !result.success) {
        throw new Error(result.success ? "Save failed." : result.error);
      }

      setFeedback(result.message || "Saved successfully.");
      resetForm();
      await loadItems();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) {
      return;
    }

    setFeedback("");

    try {
      const response = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      const result = (await response.json()) as ApiResponse<ResourceItem>;

      if (!response.ok || !result.success) {
        throw new Error(result.success ? "Delete failed." : result.error);
      }

      setFeedback(result.message || "Deleted successfully.");
      await loadItems();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          {editingId ? (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              <X className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" || field.type === "upload" ? "space-y-2 md:col-span-2" : "space-y-2"}
              >
                {field.type === "checkbox" ? (
                  <label className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-input px-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, [field.name]: event.target.checked }))
                      }
                    />
                    {field.label}
                  </label>
                ) : (
                  <>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        value={String(form[field.name] || "")}
                        placeholder={field.placeholder}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, [field.name]: event.target.value }))
                        }
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name}
                        value={String(form[field.name] || "")}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, [field.name]: event.target.value }))
                        }
                        className="h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "upload" ? (
                      <div className="grid gap-3">
                        <Input
                          id={field.name}
                          value={String(form[field.name] || "")}
                          placeholder={field.placeholder}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, [field.name]: event.target.value }))
                          }
                        />
                        {field.uploadType ? (
                          <FileUploader
                            type={field.uploadType}
                            accept="image/png,image/jpeg,image/webp"
                            onUploaded={(url) =>
                              setForm((current) => ({ ...current, [field.name]: url }))
                            }
                          />
                        ) : null}
                      </div>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        value={String(form[field.name] || "")}
                        placeholder={field.placeholder}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [field.name]:
                              field.type === "number" ? Number(event.target.value) : event.target.value
                          }))
                        }
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {feedback ? (
            <p className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
              {feedback}
            </p>
          ) : null}

          <Button type="submit" disabled={isSaving} className="w-full sm:w-max">
            {editingId ? <Save className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
          </Button>
        </form>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-lg font-black text-white">Published Records</h2>

        {isLoading ? (
          <div className="mt-5 grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          </div>
        ) : items.length ? (
          <div className="mt-5 grid gap-3">
            {items.map((item) => {
              const titleValue = item.title || item.name || item.email || "Untitled";
              const subtitle = item.summary || item.category || item.issuer || "";

              return (
                <article key={item.id || String(titleValue)} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{String(titleValue)}</h3>
                      {subtitle ? (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{String(subtitle)}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {typeof item.status === "string" ? <Badge tone="cyan">{item.status}</Badge> : null}
                        {item.featured === true ? <Badge tone="emerald">Featured</Badge> : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => startEdit(item)}>
                        <Edit3 className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState title={emptyTitle} description={emptyDescription} className="mt-5" />
        )}
      </section>
    </div>
  );
}
