import { created, fail, handleRouteError, ok, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { localStore } from "@/lib/local-store";
import { messageSchema, updateMessageSchema } from "@/lib/validators";
import Message from "@/models/Message";
import type { Message as MessageType } from "@/types";
import { serializeDocument, serializeDocuments } from "@/utils/serialize";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = requireAdmin(request);

  if (!session) {
    return fail("Unauthorized", 401);
  }

  try {
    if (!process.env.MONGODB_URI) {
      const messages = await localStore.listMessages();
      return ok(messages);
    }

    await connectToDatabase();
    const messages = await Message.find({}).sort({ createdAt: -1 });

    return ok(serializeDocuments<MessageType>(messages));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = messageSchema.parse(await request.json());

    if (!process.env.MONGODB_URI) {
      const message = await localStore.createMessage(body);
      return created(message, "Message sent successfully");
    }

    await connectToDatabase();

    const message = await Message.create(body);

    return created(serializeDocument<MessageType>(message), "Message sent successfully");
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
    const body = updateMessageSchema.parse(await request.json());

    if (!process.env.MONGODB_URI) {
      const message = await localStore.updateMessageStatus(body.id, body.status);

      if (!message) {
        return fail("Message was not found.", 404);
      }

      return ok(message, "Message updated successfully");
    }

    await connectToDatabase();

    const message = await Message.findByIdAndUpdate(
      body.id,
      {
        status: body.status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!message) {
      return fail("Message was not found.", 404);
    }

    return ok(serializeDocument<MessageType>(message), "Message updated successfully");
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
      return fail("Message id is required.", 400);
    }

    if (!process.env.MONGODB_URI) {
      const message = await localStore.deleteMessage(id);

      if (!message) {
        return fail("Message was not found.", 404);
      }

      return ok(message, "Message deleted successfully");
    }

    await connectToDatabase();
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return fail("Message was not found.", 404);
    }

    return ok(serializeDocument<MessageType>(message), "Message deleted successfully");
  } catch (error) {
    return handleRouteError(error);
  }
}
