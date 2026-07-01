import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status }
  );
}

export function created<T>(data: T, message = "Created successfully") {
  return ok(data, message, 201);
}

export function fail(error: string, status = 500, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error,
      details
    },
    { status }
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return fail(
      "Validation failed",
      400,
      error.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    );
  }

  const isDev = process.env.NODE_ENV === "development";

  if (error instanceof Error) {
    return fail(isDev ? error.message : "Unexpected server error", 500);
  }

  return fail("Unexpected server error", 500);
}

export async function readJson<T extends Record<string, unknown>>(request: Request) {
  try {
    return (await request.json()) as Partial<T>;
  } catch {
    return {} as Partial<T>;
  }
}

export function getSearchParam(request: Request, key: string) {
  return new URL(request.url).searchParams.get(key);
}
