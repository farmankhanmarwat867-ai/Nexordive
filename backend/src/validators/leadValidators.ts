import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '../constants/index.js';

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(120),
  email: z.string().trim().toLowerCase().email('Please provide a valid email address.').max(160),
  whatsapp: z
    .string()
    .trim()
    .min(6, 'Please provide a valid WhatsApp or phone number.')
    .max(40),
  service: z.string().trim().min(2, 'Please select a service.').max(120),
  budget: z.string().trim().min(1, 'Please select a budget range.').max(120),
  notes: z.string().trim().max(4000).optional().default(''),
  projectGoals: z.string().trim().max(2000).optional(),
  requiredFeatures: z.string().trim().max(2000).optional(),
  preferredTimeline: z.string().trim().max(200).optional(),
  source: z.enum(LEAD_SOURCES).optional().default('contact_form'),
  // Optional honeypot field: if filled by a bot, controller/service silently rejects spam
  website: z.string().max(200).optional(),
});

export const listLeadsQuerySchema = z.object({
  status: z.enum(['All', ...LEAD_STATUSES]).optional().default('All'),
  service: z.string().trim().max(120).optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const updateLeadSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    notes: z.string().trim().max(4000).optional(),
    preferredTimeline: z.string().trim().max(200).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update.',
  });

export const leadIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lead ID format.'),
});
