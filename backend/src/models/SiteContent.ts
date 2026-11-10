import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ISiteContent extends Document {
  slug: string;
  schemaVersion: number;
  lastUpdated: string;
  global: Record<string, unknown>;
  hero: Record<string, unknown>;
  services: Record<string, unknown>;
  mission: Record<string, unknown>;
  process: Record<string, unknown>;
  portfolio: Record<string, unknown>;
  pricing: Record<string, unknown>;
  streamer: Record<string, unknown>;
  testimonials: Record<string, unknown>;
  blog: Record<string, unknown>;
  partners: Record<string, unknown>;
  ctaBanner: Record<string, unknown>;
  contact: Record<string, unknown>;
  aboutPage: Record<string, unknown>;
  pageHeaders: Record<string, unknown>;
  faq: Record<string, unknown>;
  sectionsManager: Record<string, unknown>;
  seo: Record<string, unknown>;
  customSections: unknown[];
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const siteContentSchema = new Schema<ISiteContent>(
  {
    slug: {
      type: String,
      default: 'primary',
      unique: true,
      immutable: true,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
    lastUpdated: {
      type: String,
      default: () => new Date().toISOString(),
    },
    global: { type: Schema.Types.Mixed, default: {} },
    hero: { type: Schema.Types.Mixed, default: {} },
    services: { type: Schema.Types.Mixed, default: {} },
    mission: { type: Schema.Types.Mixed, default: {} },
    process: { type: Schema.Types.Mixed, default: {} },
    portfolio: { type: Schema.Types.Mixed, default: {} },
    pricing: { type: Schema.Types.Mixed, default: {} },
    streamer: { type: Schema.Types.Mixed, default: {} },
    testimonials: { type: Schema.Types.Mixed, default: {} },
    blog: { type: Schema.Types.Mixed, default: {} },
    partners: { type: Schema.Types.Mixed, default: {} },
    ctaBanner: { type: Schema.Types.Mixed, default: {} },
    contact: { type: Schema.Types.Mixed, default: {} },
    aboutPage: { type: Schema.Types.Mixed, default: {} },
    pageHeaders: { type: Schema.Types.Mixed, default: {} },
    faq: { type: Schema.Types.Mixed, default: {} },
    sectionsManager: { type: Schema.Types.Mixed, default: {} },
    seo: { type: Schema.Types.Mixed, default: {} },
    customSections: { type: [Schema.Types.Mixed], default: [] },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
    },
  },
  {
    timestamps: true,
    minimize: false,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.__v;
        delete ret.slug;
        return ret;
      },
    },
  }
);

export const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>('SiteContent', siteContentSchema);
