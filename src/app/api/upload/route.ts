import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fail, handleRouteError, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

type UploadType = "resume" | "project" | "certificate" | "avatar";

const uploadConfig: Record<
  UploadType,
  {
    folder: string;
    maxSize: number;
    mimeTypes: string[];
  }
> = {
  resume: {
    folder: "resume",
    maxSize: 10 * 1024 * 1024,
    mimeTypes: ["application/pdf"]
  },
  project: {
    folder: "projects",
    maxSize: 5 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"]
  },
  certificate: {
    folder: "certificates",
    maxSize: 5 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"]
  },
  avatar: {
    folder: "avatars",
    maxSize: 5 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"]
  }
};

const extensionByMime: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

function isUploadType(value: string): value is UploadType {
  return value === "resume" || value === "project" || value === "certificate" || value === "avatar";
}

export async function POST(request: Request) {
  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const uploadTypeValue = String(formData.get("type") || "");
    const file = formData.get("file");

    if (!isUploadType(uploadTypeValue)) {
      return fail("Upload type must be resume, project, certificate, or avatar.", 400);
    }

    if (!(file instanceof File)) {
      return fail("A file is required.", 400);
    }

    const config = uploadConfig[uploadTypeValue];

    if (!config.mimeTypes.includes(file.type)) {
      return fail("Unsupported file type.", 415);
    }

    if (file.size > config.maxSize) {
      return fail("File is too large.", 413);
    }

    const extension = extensionByMime[file.type] || path.extname(file.name);
    const filename = `${uploadTypeValue}-${randomUUID()}${extension}`;
    const directory = path.join(process.cwd(), "public", config.folder);
    const destination = path.join(directory, filename);

    await mkdir(directory, { recursive: true });
    await writeFile(destination, Buffer.from(await file.arrayBuffer()));

    return ok(
      {
        url: `/${config.folder}/${filename}`
      },
      "File uploaded successfully"
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
