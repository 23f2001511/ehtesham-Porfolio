import { created, fail, handleRouteError, ok, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { localStore } from "@/lib/local-store";
import { skillSchema, updateSkillSchema } from "@/lib/validators";
import Skill from "@/models/Skill";
import type { Skill as SkillType } from "@/types";
import { serializeDocument, serializeDocuments } from "@/utils/serialize";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      const skills = await localStore.listSkills();
      return ok(skills);
    }

    await connectToDatabase();
    const skills = await Skill.find({}).sort({ category: 1, featured: -1, sortOrder: 1 });

    return ok(serializeDocuments<SkillType>(skills));
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
    const body = skillSchema.parse(await request.json());

    if (!process.env.MONGODB_URI) {
      const skill = await localStore.createSkill(body);
      return created(skill, "Skill created successfully");
    }

    await connectToDatabase();

    const skill = await Skill.create(body);

    return created(serializeDocument<SkillType>(skill), "Skill created successfully");
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  try {
    const body = updateSkillSchema.parse(await request.json());
    const { id, ...updates } = body;

    if (!process.env.MONGODB_URI) {
      const skill = await localStore.updateSkill(id, updates);

      if (!skill) {
        return fail("Skill was not found.", 404);
      }

      return ok(skill, "Skill updated successfully");
    }

    await connectToDatabase();
    const skill = await Skill.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!skill) {
      return fail("Skill was not found.", 404);
    }

    return ok(serializeDocument<SkillType>(skill), "Skill updated successfully");
  } catch (error) {
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
      return fail("Skill id is required.", 400);
    }

    if (!process.env.MONGODB_URI) {
      const skill = await localStore.deleteSkill(id);

      if (!skill) {
        return fail("Skill was not found.", 404);
      }

      return ok(skill, "Skill deleted successfully");
    }

    await connectToDatabase();
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return fail("Skill was not found.", 404);
    }

    return ok(serializeDocument<SkillType>(skill), "Skill deleted successfully");
  } catch (error) {
    return handleRouteError(error);
  }
}
