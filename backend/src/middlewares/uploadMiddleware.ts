import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { UPLOAD_LIMITS } from '../constants/index.js';
import { ApiError } from '../utils/ApiError.js';

export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = EXTENSION_BY_MIME[file.mimetype] || path.extname(file.originalname) || '.bin';
    const safeName = `${Date.now()}-${crypto.randomUUID()}${ext.toLowerCase()}`;
    cb(null, safeName);
  },
});

export const uploadImageMiddleware = multer({
  storage,
  limits: {
    fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!UPLOAD_LIMITS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(
        ApiError.badRequest(
          'Unsupported file type. Allowed formats: JPEG, PNG, WebP, SVG.',
          undefined,
          'UNSUPPORTED_FILE_TYPE'
        )
      );
      return;
    }
    cb(null, true);
  },
});
