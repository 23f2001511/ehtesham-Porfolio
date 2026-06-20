export function serializeDocument<T>(document: unknown): T {
  const candidate = document as {
    toObject?: (options?: Record<string, unknown>) => Record<string, unknown>;
  };

  const raw =
    typeof candidate?.toObject === "function"
      ? candidate.toObject({ versionKey: false })
      : (document as Record<string, unknown>);

  const data = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;

  if (data._id) {
    data.id = String(data._id);
    delete data._id;
  }

  delete data.__v;

  return data as T;
}

export function serializeDocuments<T>(documents: unknown[]): T[] {
  return documents.map((document) => serializeDocument<T>(document));
}
