import { z } from 'zod';
import { SITE_CONTENT_SECTIONS } from '../constants/index.js';

export const sectionParamSchema = z.object({
  section: z.enum(SITE_CONTENT_SECTIONS),
});

export const updateFullContentSchema = z
  .object({
    schemaVersion: z.number().int().positive().optional(),
    lastUpdated: z.string().optional(),
  })
  .catchall(z.unknown())
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'Content payload cannot be empty.',
  });

export const updateSectionBodySchema = z.object({
  data: z.unknown(),
});

export const updateSiteSettingsSchema = z
  .object({
    agencyName: z.string().trim().min(1).max(120).optional(),
    whatsappNumber: z.string().trim().min(4).max(40).optional(),
    contactEmail: z.string().trim().email().max(160).optional(),
    metaTitle: z.string().trim().min(1).max(200).optional(),
    metaDescription: z.string().trim().min(1).max(500).optional(),
    ogImageUrl: z.string().trim().max(500).optional(),
    leaderName: z.string().trim().min(1).max(120).optional(),
    leaderRole: z.string().trim().min(1).max(120).optional(),
    leaderImage: z.string().trim().max(2000).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'Provide at least one setting field to update.',
  });
