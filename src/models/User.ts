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
      enum: ["Github", "Linkedin", "Mail", "Twitter", "Globe", "Code"],
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
    avatarUrl: {
      type: String,
      default: ""
    },
    socials: {
      type: [SocialLinkSchema],
      default: []
    },
    tagline: { type: String, default: "" },
    aboutBio: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    githubUsername: { type: String, default: "" },
    leetcodeUsername: { type: String, default: "" },
    collegeEmail: { type: String, default: "" },
    otherEmail: { type: String, default: "" },
    experience: {
      type: [
        {
          _id: false,
          role: { type: String, default: "" },
          company: { type: String, default: "" },
          period: { type: String, default: "" },
          summary: { type: String, default: "" },
          impact: { type: [String], default: [] }
        }
      ],
      default: []
    },
    education: {
      type: [
        {
          _id: false,
          title: { type: String, default: "" },
          institution: { type: String, default: "" },
          period: { type: String, default: "" }
        }
      ],
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
