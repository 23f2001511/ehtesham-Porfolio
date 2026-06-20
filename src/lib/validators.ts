import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || "");

const stringArray = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  },
  z.array(z.string().trim().min(1)).default([])
);

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  slug: z.string().trim().optional().default(""),
  summary: z.string().trim().min(12, "Summary should explain the project."),
  description: z.string().trim().min(20, "Description should be more detailed."),
  imageUrl: optionalUrl,
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  tags: stringArray,
  featured: z.coerce.boolean().default(false),
  status: z.enum(["Planning", "In Progress", "Live", "Archived"]).default("Planning"),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const updateProjectSchema = projectSchema.partial().extend({
  id: z.string().trim().min(1, "Project id is required.")
});

export const skillSchema = z.object({
  name: z.string().trim().min(2, "Skill name is required."),
  category: z.string().trim().min(2, "Category is required."),
  level: z.coerce.number().int().min(1).max(100).default(70),
  icon: z.string().trim().optional().default("Code2"),
  years: z.coerce.number().min(0).max(30).optional().default(1),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const updateSkillSchema = skillSchema.partial().extend({
  id: z.string().trim().min(1, "Skill id is required.")
});

export const certificateSchema = z.object({
  title: z.string().trim().min(2, "Certificate title is required."),
  issuer: z.string().trim().min(2, "Issuer is required."),
  issueDate: z.string().trim().min(4, "Issue date is required."),
  credentialUrl: optionalUrl,
  imageUrl: optionalUrl,
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const updateCertificateSchema = certificateSchema.partial().extend({
  id: z.string().trim().min(1, "Certificate id is required.")
});

export const messageSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  subject: z.string().trim().optional().default("Portfolio inquiry"),
  message: z.string().trim().min(10, "Message should be at least 10 characters.")
});

export const updateMessageSchema = z.object({
  id: z.string().trim().min(1, "Message id is required."),
  status: z.enum(["new", "read", "archived"])
});

export const profileSchema = z.object({
  resumeUrl: z.string().trim().optional(),
  socials: z
    .array(
      z.object({
        label: z.string().trim().min(2),
        href: z.string().trim().min(3),
        icon: z.enum(["Github", "Linkedin", "Mail", "Twitter", "Globe"]).default("Globe")
      })
    )
    .optional()
});
