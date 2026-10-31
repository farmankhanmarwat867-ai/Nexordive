/**
 * NexorDive Content Repository
 * Provides a versioned, safe storage layer for browser persistence.
 * Designed to be replaced with real backend API services in the future.
 */

import { SiteContent } from '../types/content';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';

const STORAGE_KEY = 'nexordive_site_content_v1';
const BACKUP_STORAGE_KEY = 'nexordive_site_content_backup';

export const PRESET_PROJECT_ASSETS = [
  { label: 'Hero Cybernetic AI Graphic', path: '/assets/khyber/hero_graphic.png', category: 'Hero' },
  { label: 'Mission Collaboration Visual', path: '/assets/khyber/mission_graphic.png', category: 'About' },
  { label: 'Partners Official Banner', path: '/assets/khyber/partners_banner.png', category: 'Partners' },
  { label: 'Farman Khalil (Avatar 2)', path: '/assets/khyber/avatar2.png', category: 'Avatars' },
  { label: 'Arsalan Khan (Avatar 1)', path: '/assets/khyber/avatar1.png', category: 'Avatars' },
  { label: 'Chris Bell (Avatar 3)', path: '/assets/khyber/avatar3.png', category: 'Avatars' },
  { label: 'Blog 1 - Google Ranking', path: '/assets/khyber/blog1.png', category: 'Blog' },
  { label: 'Blog 2 - SEO Services', path: '/assets/khyber/blog2.png', category: 'Blog' },
  { label: 'Blog 3 - Digital Marketing', path: '/assets/khyber/blog3.png', category: 'Blog' },
  { label: 'Streamer Stage Canvas', path: '/assets/streamer/stage_canvas.png', category: 'Streamer' },
  { label: 'Streamer Full Stage Mockup', path: '/assets/streamer/full_stage_mockup.png', category: 'Streamer' },
  { label: 'Streamer Alert Card', path: '/assets/streamer/alert_card.png', category: 'Streamer' },
  { label: 'Streamer Chat Panel', path: '/assets/streamer/chat_panel.png', category: 'Streamer' },
  { label: 'Streamer Cam Border (Main)', path: '/assets/streamer/cam1_streamer.png', category: 'Streamer' },
  { label: 'Producer Cam Border', path: '/assets/streamer/cam2_producer.png', category: 'Streamer' },
  { label: 'Tournament Bracket Graphic', path: '/assets/streamer/tournament.png', category: 'Streamer' },
  { label: 'Broadcast Platforms Graphic', path: '/assets/streamer/platforms.png', category: 'Streamer' },
  { label: 'Emotes Pack 1', path: '/assets/streamer/emotes1.png', category: 'Streamer' },
  { label: 'Emotes Pack 2', path: '/assets/streamer/emotes2.png', category: 'Streamer' },
];

/**
 * Deep merge function to guarantee that any missing fields in stored content
 * are safely populated from default content without dropping user edits.
 */
function mergeWithDefaults(saved: Partial<SiteContent>, defaults: SiteContent): SiteContent {
  // Preserve explicitly saved navigation arrays as authoritative (including empty arrays,
  // deleted links, custom ordering, hidden links, and labels). Only fall back to defaults if navLinks is undefined.
  const mergedNavLinks = Array.isArray(saved.global?.navLinks)
    ? saved.global.navLinks
    : defaults.global.navLinks;

  const defaultAbout = defaults.aboutPage;

  return {
    schemaVersion: 1,
    lastUpdated: saved.lastUpdated || defaults.lastUpdated,
    global: {
      ...defaults.global,
      ...(saved.global || {}),
      navLinks: mergedNavLinks,
    },
    hero: { ...defaults.hero, ...(saved.hero || {}) },
    services: {
      ...defaults.services,
      ...(saved.services || {}),
      cards: Array.isArray(saved.services?.cards) ? saved.services.cards : defaults.services.cards,
    },
    mission: {
      ...defaults.mission,
      ...(saved.mission || {}),
      pillars: Array.isArray(saved.mission?.pillars) ? saved.mission.pillars : defaults.mission.pillars,
      metrics: Array.isArray(saved.mission?.metrics) ? saved.mission.metrics : defaults.mission.metrics,
    },
    process: {
      ...defaults.process,
      ...(saved.process || {}),
      steps: Array.isArray(saved.process?.steps) ? saved.process.steps : defaults.process.steps,
    },
    portfolio: {
      ...defaults.portfolio,
      ...(saved.portfolio || {}),
      projects: Array.isArray(saved.portfolio?.projects) ? saved.portfolio.projects : defaults.portfolio.projects,
    },
    pricing: {
      ...defaults.pricing,
      ...(saved.pricing || {}),
      plans: Array.isArray(saved.pricing?.plans) ? saved.pricing.plans : defaults.pricing.plans,
      reassuranceBanner: {
        text: saved.pricing?.reassuranceBanner?.text ?? defaults.pricing.reassuranceBanner?.text ?? '',
        ctaLabel: saved.pricing?.reassuranceBanner?.ctaLabel ?? defaults.pricing.reassuranceBanner?.ctaLabel ?? '',
        ctaAction: saved.pricing?.reassuranceBanner?.ctaAction ?? defaults.pricing.reassuranceBanner?.ctaAction ?? 'contact',
        visible: saved.pricing?.reassuranceBanner?.visible ?? defaults.pricing.reassuranceBanner?.visible ?? true,
      },
      estimatorRates: {
        ...defaults.pricing.estimatorRates,
        ...(saved.pricing?.estimatorRates || {}),
      },
    },
    streamer: {
      ...defaults.streamer,
      ...(saved.streamer || {}),
      startingCards: Array.isArray(saved.streamer?.startingCards) ? saved.streamer.startingCards : defaults.streamer.startingCards,
      suites: Array.isArray(saved.streamer?.suites) ? saved.streamer.suites : defaults.streamer.suites,
    },
    testimonials: {
      ...defaults.testimonials,
      ...(saved.testimonials || {}),
      testimonials: Array.isArray(saved.testimonials?.testimonials) ? saved.testimonials.testimonials : defaults.testimonials.testimonials,
    },
    blog: {
      ...defaults.blog,
      ...(saved.blog || {}),
      blogs: Array.isArray(saved.blog?.blogs) ? saved.blog.blogs : defaults.blog.blogs,
    },
    partners: {
      ...defaults.partners,
      ...(saved.partners || {}),
      partners: Array.isArray(saved.partners?.partners) ? saved.partners.partners : defaults.partners.partners,
      platforms: Array.isArray(saved.partners?.platforms) ? saved.partners.platforms : (defaults.partners.platforms || []),
    },
    ctaBanner: {
      ...defaults.ctaBanner,
      ...(saved.ctaBanner || {}),
    },
    contact: { ...defaults.contact, ...(saved.contact || {}) },
    aboutPage: defaultAbout
      ? {
          intro: { ...defaultAbout.intro, ...(saved.aboutPage?.intro || {}) },
          consultation: { ...defaultAbout.consultation, ...(saved.aboutPage?.consultation || {}) },
          teamSection: { ...defaultAbout.teamSection, ...(saved.aboutPage?.teamSection || {}) },
          teamMembers: Array.isArray(saved.aboutPage?.teamMembers)
            ? saved.aboutPage.teamMembers
            : defaultAbout.teamMembers,
          pillarsSection: { ...defaultAbout.pillarsSection, ...(saved.aboutPage?.pillarsSection || {}) },
          corePillars: Array.isArray(saved.aboutPage?.corePillars)
            ? saved.aboutPage.corePillars
            : defaultAbout.corePillars,
          sectionsVisibility: {
            ...defaultAbout.sectionsVisibility,
            ...(saved.aboutPage?.sectionsVisibility || {}),
          },
        }
      : undefined,
    pageHeaders: {
      services: { ...defaults.pageHeaders.services, ...(saved.pageHeaders?.services || {}) },
      streamerAssets: { ...defaults.pageHeaders.streamerAssets, ...(saved.pageHeaders?.streamerAssets || {}) },
      pricing: { ...defaults.pageHeaders.pricing, ...(saved.pageHeaders?.pricing || {}) },
      portfolio: { ...defaults.pageHeaders.portfolio, ...(saved.pageHeaders?.portfolio || {}) },
      contact: { ...defaults.pageHeaders.contact, ...(saved.pageHeaders?.contact || {}) },
    },
    sectionsManager: {
      ...defaults.sectionsManager,
      ...(saved.sectionsManager || {}),
      landingPageSections: Array.isArray(saved.sectionsManager?.landingPageSections)
        ? saved.sectionsManager.landingPageSections
        : defaults.sectionsManager.landingPageSections,
    },
    seo: { ...defaults.seo, ...(saved.seo || {}) },
  };
}

/**
 * Retrieve content from localStorage, or initialize with defaults.
 * Never throws; returns valid SiteContent under all conditions.
 */
export function getStoredContent(): SiteContent {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONTENT;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SITE_CONTENT;
    }

    const parsed = JSON.parse(raw);
    return mergeWithDefaults(parsed, DEFAULT_SITE_CONTENT);
  } catch (err) {
    console.warn('[NexorDive ContentRepository] Error parsing stored content, returning defaults:', err);
    return DEFAULT_SITE_CONTENT;
  }
}

/**
 * Persist content to localStorage.
 * Catches QuotaExceededError and provides user-actionable feedback.
 */
export function saveStoredContent(content: SiteContent): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window object unavailable.' };
  }

  try {
    const payload = JSON.stringify({
      ...content,
      lastUpdated: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, payload);
    return { success: true };
  } catch (err: any) {
    console.error('[NexorDive ContentRepository] Save failed:', err);
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      return {
        success: false,
        error: 'Storage quota exceeded. Please use preset assets or smaller images to save changes.',
      };
    }
    return {
      success: false,
      error: err?.message || 'Unknown storage error occurred while saving.',
    };
  }
}

/**
 * Reset content back to system defaults.
 */
export function resetContentToDefaults(): SiteContent {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }
  return DEFAULT_SITE_CONTENT;
}

/**
 * URL safety validation to reject dangerous javascript: or data: code schemes
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;
  if (/^javascript:/i.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:' || parsed.protocol === 'tel:';
  } catch {
    return false;
  }
}

/**
 * Downscale and compress an image file to a lightweight JPEG data URL
 * so it safely fits within browser localStorage quotas (<60KB).
 */
export async function compressAndEncodeImage(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  // Validate supported image types
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported image format. Please select a PNG, JPG, WebP, or SVG file.');
  }

  // Max 5MB raw upload threshold
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Original file is too large (max 5MB). Please choose a smaller image.');
  }

  // SVG files can be read directly as DataURL without canvas rendering
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context initialization failed.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}
