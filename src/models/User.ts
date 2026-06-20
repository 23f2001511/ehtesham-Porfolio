import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const SocialLinkSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true
    },
    href: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      enum: ["Github", "Linkedin", "Mail", "Twitter", "Globe"],
      default: "Globe"
    }
  },
  {
    _id: false
  }
);

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin"
    },
    resumeUrl: {
      type: String,
      default: ""
    },
    socials: {
      type: [SocialLinkSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

const User = (models.User as Model<UserDocument>) || model<UserDocument>("User", UserSchema);

export default User;
