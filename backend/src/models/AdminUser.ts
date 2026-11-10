import mongoose, { Document, Model, Schema } from 'mongoose';
import { ADMIN_ROLES, AdminRole } from '../constants/index.js';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  tokenVersion: number;
  refreshTokenHashes: string[];
  failedLoginAttempts: number;
  lockUntil: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isLocked(): boolean;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'Website Manager',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      default: 'superadmin',
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    refreshTokenHashes: {
      type: [String],
      default: [],
      select: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.refreshTokenHashes;
        return ret;
      },
    },
  }
);

adminUserSchema.methods.isLocked = function (this: IAdminUser): boolean {
  return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', adminUserSchema);
