import { Types } from 'mongoose';
import { SITE_CONTENT_SECTIONS, SiteContentSection } from '../constants/index.js';
import { ISiteContent, SiteContent } from '../models/SiteContent.js';
import { buildDefaultSiteContent } from '../utils/defaultSiteContent.js';

export interface SiteSettingsInput {
  agencyName?: string;
  whatsappNumber?: string;
  contactEmail?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  leaderName?: string;
  leaderRole?: string;
  leaderImage?: string;
}

async function ensureContentDocument(): Promise<ISiteContent> {
  let doc = await SiteContent.findOne({ slug: 'primary' });
  if (!doc) {
    doc = await SiteContent.create({
      slug: 'primary',
      ...buildDefaultSiteContent(),
    });
  }
  return doc;
}

export async function getSiteContent(): Promise<Record<string, unknown>> {
  const doc = await ensureContentDocument();
  return doc.toJSON();
}

export async function replaceSiteContent(
  payload: Record<string, unknown>,
  adminId: Types.ObjectId
): Promise<Record<string, unknown>> {
  await ensureContentDocument();

  const updateFields: Record<string, unknown> = {
    lastUpdated: new Date().toISOString(),
    updatedBy: adminId,
  };

  if (typeof payload.schemaVersion === 'number') {
    updateFields.schemaVersion = payload.schemaVersion;
  }

  for (const section of SITE_CONTENT_SECTIONS) {
    if (payload[section] !== undefined) {
      updateFields[section] = payload[section];
    }
  }

  const updated = await SiteContent.findOneAndUpdate(
    { slug: 'primary' },
    { $set: updateFields },
    { new: true }
  );

  return updated!.toJSON();
}

export async function updateContentSection(
  section: SiteContentSection,
  data: unknown,
  adminId: Types.ObjectId
): Promise<Record<string, unknown>> {
  await ensureContentDocument();

  const updated = await SiteContent.findOneAndUpdate(
    { slug: 'primary' },
    {
      $set: {
        [section]: data,
        lastUpdated: new Date().toISOString(),
        updatedBy: adminId,
      },
    },
    { new: true }
  );

  return updated!.toJSON();
}

export async function updateSiteSettings(
  settings: SiteSettingsInput,
  adminId: Types.ObjectId
): Promise<Record<string, unknown>> {
  const doc = await ensureContentDocument();

  const nextGlobal = {
    ...(doc.global || {}),
    ...(settings.agencyName !== undefined ? { agencyName: settings.agencyName } : {}),
    ...(settings.whatsappNumber !== undefined ? { whatsappNumber: settings.whatsappNumber } : {}),
    ...(settings.contactEmail !== undefined ? { contactEmail: settings.contactEmail } : {}),
    ...(settings.leaderName !== undefined ? { leaderName: settings.leaderName } : {}),
    ...(settings.leaderRole !== undefined ? { leaderRole: settings.leaderRole } : {}),
    ...(settings.leaderImage !== undefined ? { leaderImage: settings.leaderImage } : {}),
  };

  const nextSeo = {
    ...(doc.seo || {}),
    ...(settings.metaTitle !== undefined
      ? { metaTitle: settings.metaTitle, ogTitle: settings.metaTitle }
      : {}),
    ...(settings.metaDescription !== undefined ? { metaDescription: settings.metaDescription } : {}),
    ...(settings.ogImageUrl !== undefined ? { ogImageUrl: settings.ogImageUrl } : {}),
  };

  const nextMission = {
    ...(doc.mission || {}),
    ...(settings.leaderName !== undefined ? { ceoBadgeName: settings.leaderName } : {}),
    ...(settings.leaderRole !== undefined ? { ceoBadgeTitle: settings.leaderRole } : {}),
    ...(settings.leaderImage !== undefined ? { ceoAvatar: settings.leaderImage } : {}),
  };

  const currentAboutPage = (doc.aboutPage || {}) as Record<string, unknown>;
  let nextAboutPage = currentAboutPage;
  if (Array.isArray(currentAboutPage.teamMembers)) {
    nextAboutPage = {
      ...currentAboutPage,
      teamMembers: currentAboutPage.teamMembers.map((member: any) =>
        member && (member.isLeader || member.id === 'ceo')
          ? {
              ...member,
              ...(settings.leaderName !== undefined ? { name: settings.leaderName } : {}),
              ...(settings.leaderRole !== undefined ? { role: settings.leaderRole } : {}),
              ...(settings.leaderImage !== undefined ? { image: settings.leaderImage } : {}),
            }
          : member
      ),
    };
  }

  const updated = await SiteContent.findOneAndUpdate(
    { slug: 'primary' },
    {
      $set: {
        global: nextGlobal,
        seo: nextSeo,
        mission: nextMission,
        aboutPage: nextAboutPage,
        lastUpdated: new Date().toISOString(),
        updatedBy: adminId,
      },
    },
    { new: true }
  );

  return updated!.toJSON();
}

export async function resetSiteContent(adminId: Types.ObjectId): Promise<Record<string, unknown>> {
  const defaults = buildDefaultSiteContent();
  const updated = await SiteContent.findOneAndUpdate(
    { slug: 'primary' },
    {
      $set: {
        ...defaults,
        updatedBy: adminId,
      },
    },
    { new: true, upsert: true }
  );

  return updated.toJSON();
}
