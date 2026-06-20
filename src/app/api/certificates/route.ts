import { created, fail, handleRouteError, ok, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { localStore } from "@/lib/local-store";
import { certificateSchema, updateCertificateSchema } from "@/lib/validators";
import Certificate from "@/models/Certificate";
import type { Certificate as CertificateType } from "@/types";
import { serializeDocument, serializeDocuments } from "@/utils/serialize";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      const certificates = await localStore.listCertificates();
      return ok(certificates);
    }

    await connectToDatabase();
    const certificates = await Certificate.find({}).sort({
      featured: -1,
      sortOrder: 1,
      createdAt: -1
    });

    return ok(serializeDocuments<CertificateType>(certificates));
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
    const body = certificateSchema.parse(await request.json());

    if (!process.env.MONGODB_URI) {
      const certificate = await localStore.createCertificate(body);

      return created(certificate, "Certificate created successfully");
    }

    await connectToDatabase();

    const certificate = await Certificate.create(body);

    return created(
      serializeDocument<CertificateType>(certificate),
      "Certificate created successfully"
    );
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
    const body = updateCertificateSchema.parse(await request.json());
    const { id, ...updates } = body;

    if (!process.env.MONGODB_URI) {
      const certificate = await localStore.updateCertificate(id, updates);

      if (!certificate) {
        return fail("Certificate was not found.", 404);
      }

      return ok(certificate, "Certificate updated successfully");
    }

    await connectToDatabase();
    const certificate = await Certificate.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!certificate) {
      return fail("Certificate was not found.", 404);
    }

    return ok(
      serializeDocument<CertificateType>(certificate),
      "Certificate updated successfully"
    );
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
      return fail("Certificate id is required.", 400);
    }

    if (!process.env.MONGODB_URI) {
      const certificate = await localStore.deleteCertificate(id);

      if (!certificate) {
        return fail("Certificate was not found.", 404);
      }

      return ok(certificate, "Certificate deleted successfully");
    }

    await connectToDatabase();
    const certificate = await Certificate.findByIdAndDelete(id);

    if (!certificate) {
      return fail("Certificate was not found.", 404);
    }

    return ok(
      serializeDocument<CertificateType>(certificate),
      "Certificate deleted successfully"
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
