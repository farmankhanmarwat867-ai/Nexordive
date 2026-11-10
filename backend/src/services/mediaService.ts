import fs from 'node:fs/promises';
import path from 'node:path';
import { Types } from 'mongoose';
import { UPLOADS_DIR } from '../middlewares/uploadMiddleware.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { ApiError } from '../utils/ApiError.js';

export async function saveUploadedMedia(
  file: Express.Multer.File,
  adminId: Types.ObjectId
): Promise<Record<string, unknown>> {
  const asset = await MediaAsset.create({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
    uploadedBy: adminId,
  });

  return asset.toJSON();
}

export async function listMediaAssets(page = 1, limit = 30) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    MediaAsset.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    MediaAsset.countDocuments(),
  ]);

  return {
    items: items.map((item) => item.toJSON()),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function deleteMediaAsset(id: string): Promise<void> {
  const asset = await MediaAsset.findById(id);
  if (!asset) {
    throw ApiError.notFound('Media asset not found.', 'MEDIA_NOT_FOUND');
  }

  // Prevent path traversal by strictly taking basename inside UPLOADS_DIR
  const safeFilename = path.basename(asset.filename);
  const fullPath = path.join(UPLOADS_DIR, safeFilename);
  try {
    await fs.unlink(fullPath);
  } catch (err: any) {
    if (err?.code !== 'ENOENT') {
      throw err;
    }
  }

  await asset.deleteOne();
}
