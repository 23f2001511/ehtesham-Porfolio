import { created, fail, handleRouteError, ok, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { localStore } from "@/lib/local-store";
import { projectSchema, updateProjectSchema } from "@/lib/validators";
import Project from "@/models/Project";
import type { Project as ProjectType } from "@/types";
import { serializeDocument, serializeDocuments } from "@/utils/serialize";
import { slugify } from "@/utils/slugify";

export const runtime = "nodejs";

function normalizeProjectSlug(title: string, slug?: string) {
  return slugify(slug || title);
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      const projects = await localStore.listProjects();
      return ok(projects);
    }

    await connectToDatabase();
    const projects = await Project.find({}).sort({ featured: -1, sortOrder: 1, createdAt: -1 });

    return ok(serializeDocuments<ProjectType>(projects));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  try {
    const body = projectSchema.parse(await request.json());

    if (!process.env.MONGODB_URI) {
      const project = await localStore.createProject({
        ...body,
        slug: normalizeProjectSlug(body.title, body.slug)
      });

      return created(project, "Project created successfully");
    }

    await connectToDatabase();

    const project = await Project.create({
      ...body,
      slug: normalizeProjectSlug(body.title, body.slug)
    });

    return created(serializeDocument<ProjectType>(project), "Project created successfully");
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === 11000) {
      return fail("A project with this slug already exists.", 409);
    }

    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  try {
    const body = updateProjectSchema.parse(await request.json());
    const { id, ...updates } = body;

    if (!process.env.MONGODB_URI) {
      if (updates.title || updates.slug) {
        updates.slug = normalizeProjectSlug(updates.title || "", updates.slug);
      }

      const project = await localStore.updateProject(id, updates);

      if (!project) {
        return fail("Project was not found.", 404);
      }

      return ok(project, "Project updated successfully");
    }

    await connectToDatabase();

    if (updates.title || updates.slug) {
      updates.slug = normalizeProjectSlug(updates.title || "", updates.slug);
    }

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return fail("Project was not found.", 404);
    }

    return ok(serializeDocument<ProjectType>(project), "Project updated successfully");
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === 11000) {
      return fail("A project with this slug already exists.", 409);
    }

    return handleRouteError(error);
  }
}

export async function DELETE(request: Request) {
  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  try {
    const body = await readJson<{ id: string }>(request);
    const id = new URL(request.url).searchParams.get("id") || body.id;

    if (!id) {
      return fail("Project id is required.", 400);
    }

    if (!process.env.MONGODB_URI) {
      const project = await localStore.deleteProject(id);

      if (!project) {
        return fail("Project was not found.", 404);
      }

      return ok(project, "Project deleted successfully");
    }

    await connectToDatabase();
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return fail("Project was not found.", 404);
    }

    return ok(serializeDocument<ProjectType>(project), "Project deleted successfully");
  } catch (error) {
    return handleRouteError(error);
  }
}
