import mongoose, { Document, Model, Schema } from 'mongoose';
import { LEAD_SOURCES, LEAD_STATUSES, LeadSource, LeadStatus } from '../constants/index.js';

export interface ILead extends Document {
  referenceCode: string;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  budget: string;
  status: LeadStatus;
  notes?: string;
  projectGoals?: string;
  requiredFeatures?: string;
  preferredTimeline?: string;
  source: LeadSource;
  ipHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    referenceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    service: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    budget: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: '',
    },
    projectGoals: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    requiredFeatures: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    preferredTimeline: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: 'contact_form',
    },
    ipHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.ipHash;
        return ret;
      },
    },
  }
);

leadSchema.index({ createdAt: -1, status: 1 });

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);
