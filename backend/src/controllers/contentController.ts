import { Request, Response } from 'express';
import { SiteContentSection } from '../constants/index.js';
import * as contentService from '../services/contentService.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export async function getContent(_req: Request, res: Response): Promise<void> {
  const content = await contentService.getSiteContent();
  sendSuccess(res, 200, 'Site content retrieved successfully.', { content });
}

export async function replaceContent(req: Request, res: Response): Promise<void> {
  if (!req.admin) throw ApiError.unauthorized();
  const content = await contentService.replaceSiteContent(req.body, req.admin._id as any);
  sendSuccess(res, 200, 'Site content published successfully.', { content });
}

export async function updateSection(req: Request, res: Response): Promise<void> {
  if (!req.admin) throw ApiError.unauthorized();
  const section = req.params.section as SiteContentSection;
  const content = await contentService.updateContentSection(
    section,
    req.body.data,
    req.admin._id as any
  );
  sendSuccess(res, 200, `Section "${section}" updated successfully.`, { content });
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  if (!req.admin) throw ApiError.unauthorized();
  const content = await contentService.updateSiteSettings(req.body, req.admin._id as any);
  sendSuccess(res, 200, 'Site settings updated successfully.', { content });
}

export async function resetContent(req: Request, res: Response): Promise<void> {
  if (!req.admin) throw ApiError.unauthorized();
  const content = await contentService.resetSiteContent(req.admin._id as any);
  sendSuccess(res, 200, 'Site content reset to defaults.', { content });
}
