import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { AUTH_LIMITS } from '../constants/index.js';
import { AdminUser } from '../models/AdminUser.js';
import { SiteContent } from '../models/SiteContent.js';
import { buildDefaultSiteContent } from '../utils/defaultSiteContent.js';

async function runSeed(): Promise<void> {
  await connectDatabase();

  try {
    const existingAdminCount = await AdminUser.countDocuments();
    if (existingAdminCount === 0) {
      const email = (env.SEED_ADMIN_EMAIL || 'manager@nexordive.com').trim().toLowerCase();
      const password = env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
      const passwordHash = await bcrypt.hash(password, AUTH_LIMITS.BCRYPT_ROUNDS);

      await AdminUser.create({
        name: env.SEED_ADMIN_NAME || 'Website Manager',
        email,
        passwordHash,
        role: 'superadmin',
      });
      console.info(`[NexorDive Seed] Initialized manager account: ${email}`);
    } else {
      console.info('[NexorDive Seed] Manager account already exists. Skipping admin seed.');
    }

    const existingContent = await SiteContent.findOne({ slug: 'primary' });
    if (!existingContent) {
      await SiteContent.create({
        slug: 'primary',
        ...buildDefaultSiteContent(),
      });
      console.info('[NexorDive Seed] Initialized primary SiteContent document.');
    } else {
      console.info('[NexorDive Seed] SiteContent already exists. Skipping content seed.');
    }
  } finally {
    await disconnectDatabase();
  }
}

runSeed()
  .then(() => {
    console.info('[NexorDive Seed] Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[NexorDive Seed] Failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
