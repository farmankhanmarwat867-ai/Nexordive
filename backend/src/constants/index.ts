export const ADMIN_ROLES = ['superadmin', 'admin'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const LEAD_STATUSES = ['New', 'Contacted', 'In Progress', 'Closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ['contact_form', 'estimator', 'modal', 'manual'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const SITE_CONTENT_SECTIONS = [
  'global',
  'hero',
  'services',
  'mission',
  'process',
  'portfolio',
  'pricing',
  'streamer',
  'testimonials',
  'blog',
  'partners',
  'ctaBanner',
  'contact',
  'aboutPage',
  'pageHeaders',
  'faq',
  'sectionsManager',
  'seo',
  'customSections',
] as const;
export type SiteContentSection = (typeof SITE_CONTENT_SECTIONS)[number];

export const AUTH_LIMITS = {
  BCRYPT_ROUNDS: 12,
  MAX_FAILED_LOGIN_ATTEMPTS: 5,
  LOCK_DURATION_MINUTES: 15,
  MAX_ACTIVE_REFRESH_TOKENS: 5,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ] as readonly string[],
} as const;
