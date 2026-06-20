import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const MessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      default: "Portfolio inquiry",
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new"
    }
  },
  {
    timestamps: true
  }
);

MessageSchema.index({ status: 1, createdAt: -1 });

export type MessageDocument = InferSchemaType<typeof MessageSchema>;

const Message =
  (models.Message as Model<MessageDocument>) || model<MessageDocument>("Message", MessageSchema);

export default Message;
