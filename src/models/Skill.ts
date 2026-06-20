import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 70
    },
    icon: {
      type: String,
      default: "Code2"
    },
    years: {
      type: Number,
      default: 1
    },
    featured: {
      type: Boolean,
      default: false
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

SkillSchema.index({ category: 1, featured: -1, sortOrder: 1 });

export type SkillDocument = InferSchemaType<typeof SkillSchema>;

const Skill = (models.Skill as Model<SkillDocument>) || model<SkillDocument>("Skill", SkillSchema);

export default Skill;
