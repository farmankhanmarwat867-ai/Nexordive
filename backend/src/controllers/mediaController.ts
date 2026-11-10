import { Request, Response } from 'express';
import * as mediaService from '../services/mediaService.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export async function uploadMedia(req: Request, res: Response): Promise<void> {
  if (!req.admin) throw ApiError.unauthorized();
  if (!req.file) {
    throw ApiError.badRequest('Please attach an image file under field name "file".', undefined, 'MISSING_FILE');
  }

  const asset = await mediaService.saveUploadedMedia(req.file, req.admin._id as any);
  sendSuccess(res, 201, 'Image uploaded successfully.', { asset });
}

export async function listMedia(req: Request, res: Response): Promise<void> {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 30;
  const result = await mediaService.listMediaAssets(page, limit);
  sendSuccess(res, 200, 'Media library retrieved.', result);
}

export async function removeMedia(req: Request, res: Response): Promise<void> {
  const id = req.validatedParams?.id || String(req.params.id);
  await mediaService.deleteMediaAsset(id);
  sendSuccess(res, 200, 'Media asset deleted successfully.', null);
}
