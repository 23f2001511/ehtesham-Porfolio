import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    liveUrl: {
      type: String,
      default: ""
    },
    repoUrl: {
      type: String,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Live", "Archived"],
      default: "Planning"
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

ProjectSchema.index({ featured: -1, sortOrder: 1, createdAt: -1 });

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>;

const Project =
  (models.Project as Model<ProjectDocument>) || model<ProjectDocument>("Project", ProjectSchema);

export default Project;
