import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const CertificateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: String,
      required: true,
      trim: true
    },
    credentialUrl: {
      type: String,
      default: ""
    },
    imageUrl: {
      type: String,
      default: ""
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

CertificateSchema.index({ featured: -1, sortOrder: 1, createdAt: -1 });

export type CertificateDocument = InferSchemaType<typeof CertificateSchema>;

const Certificate =
  (models.Certificate as Model<CertificateDocument>) ||
  model<CertificateDocument>("Certificate", CertificateSchema);

export default Certificate;
