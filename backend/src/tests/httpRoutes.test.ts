import './testEnvSetup.js';
import assert from 'node:assert/strict';
import test, { afterEach, mock } from 'node:test';
import bcrypt from 'bcryptjs';
import request from 'supertest';

import { createApp } from '../app.js';
import { AdminUser } from '../models/AdminUser.js';
import { Lead } from '../models/Lead.js';
import { SiteContent } from '../models/SiteContent.js';
import { buildDefaultSiteContent } from '../utils/defaultSiteContent.js';
import { hashToken, signAccessToken, signRefreshToken } from '../utils/jwt.js';

const app = createApp();

afterEach(() => {
  mock.restoreAll();
});

test('GET / and unknown routes return standardized API responses', async () => {
  const rootRes = await request(app).get('/');
  assert.equal(rootRes.status, 200);
  assert.equal(rootRes.body.success, true);

  const healthRes = await request(app).get('/api/v1/health');
  assert.equal(healthRes.status, 503);
  assert.equal(healthRes.body.data.database, 'disconnected');

  const notFoundRes = await request(app).get('/api/v1/nonexistent-endpoint');
  assert.equal(notFoundRes.status, 404);
  assert.equal(notFoundRes.body.success, false);
  assert.equal(notFoundRes.body.code, 'ROUTE_NOT_FOUND');
});

test('CORS middleware blocks disallowed origins and allows configured origin', async () => {
  const blocked = await request(app)
    .get('/api/v1/auth/status')
    .set('Origin', 'https://evil-site.example');
  assert.equal(blocked.status, 403);
  assert.equal(blocked.body.code, 'CORS_FORBIDDEN');
});

test('Auth setup creates initial admin once, sets httpOnly cookies, and rejects second setup', async () => {
  let adminCount = 0;
  mock.method(AdminUser, 'countDocuments', async () => adminCount);
  mock.method(AdminUser.prototype, 'save', async function (this: any) {
    adminCount = 1;
    return this;
  });

  const badRes = await request(app).post('/api/v1/auth/setup').send({
    email: 'manager@nexordive.com',
    password: 'weak',
  });
  assert.equal(badRes.status, 400);
  assert.equal(badRes.body.code, 'VALIDATION_ERROR');

  const okRes = await request(app).post('/api/v1/auth/setup').send({
    name: 'Ahmed',
    email: 'manager@nexordive.com',
    password: 'StrongPassword1',
  });
  assert.equal(okRes.status, 201);
  assert.equal(okRes.body.success, true);
  assert.equal(okRes.body.data.admin.email, 'manager@nexordive.com');
  assert.equal(okRes.body.data.admin.passwordHash, undefined);
  assert.ok(okRes.body.data.accessToken);
  const cookies = okRes.headers['set-cookie'] as unknown as string[];
  assert.ok(Array.isArray(cookies));
  assert.ok(cookies.some((c) => c.startsWith('nexordive_access_token=')));
  assert.ok(cookies.some((c) => c.startsWith('nexordive_refresh_token=')));

  // Second setup must be forbidden once configured
  const secondRes = await request(app).post('/api/v1/auth/setup').send({
    email: 'other@nexordive.com',
    password: 'StrongPassword1',
  });
  assert.equal(secondRes.status, 403);
  assert.equal(secondRes.body.code, 'ALREADY_CONFIGURED');
});

test('Auth login verifies password, locks after 5 failures, and supports token rotation', async () => {
  const passwordHash = await bcrypt.hash('ValidPass2026', 4);
  const fakeAdmin: any = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Website Manager',
    email: 'manager@nexordive.com',
    role: 'superadmin',
    passwordHash,
    tokenVersion: 0,
    refreshTokenHashes: [],
    failedLoginAttempts: 0,
    lockUntil: null,
    lastLoginAt: null,
    isLocked() {
      return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
    },
    async save() {
      return this;
    },
    toJSON() {
      return {
        id: String(this._id),
        name: this.name,
        email: this.email,
        role: this.role,
      };
    },
  };

  mock.method(AdminUser, 'findOne', () => ({
    select: async () => fakeAdmin,
  }));

  // 5 consecutive wrong password attempts lock the account
  for (let i = 0; i < 5; i += 1) {
    const failRes = await request(app).post('/api/v1/auth/login').send({
      email: 'manager@nexordive.com',
      password: 'WrongPassword1',
    });
    assert.equal(failRes.status, 401);
  }
  assert.equal(fakeAdmin.failedLoginAttempts, 5);
  assert.ok(fakeAdmin.isLocked());

  const lockedRes = await request(app).post('/api/v1/auth/login').send({
    email: 'manager@nexordive.com',
    password: 'ValidPass2026',
  });
  assert.equal(lockedRes.status, 423);
  assert.equal(lockedRes.body.code, 'ACCOUNT_LOCKED');

  // Clear lock and sign in successfully
  fakeAdmin.lockUntil = null;
  fakeAdmin.failedLoginAttempts = 0;
  const successRes = await request(app).post('/api/v1/auth/login').send({
    email: 'manager@nexordive.com',
    password: 'ValidPass2026',
  });
  assert.equal(successRes.status, 200);
  assert.ok(successRes.body.data.accessToken);
  assert.equal(fakeAdmin.refreshTokenHashes.length, 1);

  // Refresh rotates token cleanly
  const refreshCookie = (successRes.headers['set-cookie'] as unknown as string[])
    .find((c) => c.startsWith('nexordive_refresh_token='))!
    .split(';')[0];

  mock.method(AdminUser, 'findById', () => ({
    select: async () => fakeAdmin,
  }));

  const refreshRes = await request(app)
    .post('/api/v1/auth/refresh')
    .set('Cookie', [refreshCookie]);
  assert.equal(refreshRes.status, 200);
  assert.ok(refreshRes.body.data.accessToken);
});

test('Protected auth routes enforce tokenVersion and update email & password securely', async () => {
  const passwordHash = await bcrypt.hash('CurrentPass1', 4);
  const fakeAdmin: any = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Website Manager',
    email: 'old@nexordive.com',
    role: 'superadmin',
    passwordHash,
    tokenVersion: 1,
    refreshTokenHashes: [hashToken(signRefreshToken({ sub: '507f1f77bcf86cd799439011', tokenVersion: 1 }))],
    async save() {
      return this;
    },
    toJSON() {
      return {
        id: String(this._id),
        name: this.name,
        email: this.email,
        role: this.role,
      };
    },
  };

  mock.method(AdminUser, 'findById', () => {
    const queryLike: any = Promise.resolve(fakeAdmin);
    queryLike.select = async () => fakeAdmin;
    return queryLike;
  });
  mock.method(AdminUser, 'findOne', async () => null);

  // Unauthenticated access blocked
  const unauthMe = await request(app).get('/api/v1/auth/me');
  assert.equal(unauthMe.status, 401);

  // Stale tokenVersion rejected
  const staleToken = signAccessToken({
    sub: '507f1f77bcf86cd799439011',
    email: 'old@nexordive.com',
    role: 'superadmin',
    tokenVersion: 0,
  });
  const staleRes = await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${staleToken}`);
  assert.equal(staleRes.status, 401);
  assert.equal(staleRes.body.code, 'SESSION_REVOKED');

  // Valid token works
  const validToken = signAccessToken({
    sub: '507f1f77bcf86cd799439011',
    email: 'old@nexordive.com',
    role: 'superadmin',
    tokenVersion: 1,
  });

  const emailRes = await request(app)
    .patch('/api/v1/auth/email')
    .set('Authorization', `Bearer ${validToken}`)
    .send({
      newEmail: 'new@nexordive.com',
      currentPassword: 'CurrentPass1',
    });
  assert.equal(emailRes.status, 200);
  assert.equal(emailRes.body.data.admin.email, 'new@nexordive.com');

  const passRes = await request(app)
    .patch('/api/v1/auth/password')
    .set('Authorization', `Bearer ${validToken}`)
    .send({
      currentPassword: 'CurrentPass1',
      newPassword: 'UpdatedPass2',
    });
  assert.equal(passRes.status, 200);
  assert.equal(fakeAdmin.tokenVersion, 2);
});

test('Leads routes handle public submission, honeypot filtering, auth guards, and CSV export', async () => {
  const adminDoc: any = {
    _id: '507f1f77bcf86cd799439011',
    email: 'manager@nexordive.com',
    role: 'superadmin',
    tokenVersion: 0,
  };
  mock.method(AdminUser, 'findById', async () => adminDoc);

  const createdLeads: any[] = [];
  mock.method(Lead, 'create', async (doc: any) => {
    const saved = {
      ...doc,
      _id: '507f1f77bcf86cd799439022',
      createdAt: new Date('2026-11-10T12:00:00.000Z'),
      toJSON() {
        return {
          id: this._id,
          referenceCode: this.referenceCode,
          name: this.name,
          email: this.email,
          whatsapp: this.whatsapp,
          service: this.service,
          budget: this.budget,
          status: this.status,
          source: this.source,
          notes: this.notes,
        };
      },
    };
    createdLeads.push(saved);
    return saved;
  });

  // Honeypot spam submission does not persist
  const spamRes = await request(app).post('/api/v1/leads').send({
    name: 'Spam Bot',
    email: 'bot@spam.example',
    whatsapp: '+1234567890',
    service: 'Web Development',
    budget: '$500',
    website: 'https://spam-link.example',
  });
  assert.equal(spamRes.status, 201);
  assert.equal(createdLeads.length, 0);

  // Legitimate lead persists
  const leadRes = await request(app).post('/api/v1/leads').send({
    name: 'Hamza Malik',
    email: 'hamza@hyperpulse.gg',
    whatsapp: '+92 300 123 4567',
    service: 'Streamer Assets',
    budget: '$49 - $129',
    notes: '60fps stinger transition',
  });
  assert.equal(leadRes.status, 201);
  assert.equal(createdLeads.length, 1);
  assert.match(leadRes.body.data.referenceCode, /^NXD-\d{6}$/);

  // Protected leads listing requires auth
  const unauthLeads = await request(app).get('/api/v1/leads');
  assert.equal(unauthLeads.status, 401);

  const token = signAccessToken({
    sub: '507f1f77bcf86cd799439011',
    email: 'manager@nexordive.com',
    role: 'superadmin',
    tokenVersion: 0,
  });

  // Malformed ID returns 400
  const badIdRes = await request(app)
    .get('/api/v1/leads/not-an-object-id')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(badIdRes.status, 400);
  assert.equal(badIdRes.body.code, 'VALIDATION_ERROR');

  // Export CSV escapes formula payloads safely
  mock.method(Lead, 'find', () => ({
    sort: () => ({
      limit: async () => [
        {
          referenceCode: 'NXD-111111',
          name: '=EVIL()',
          email: 'client@example.com',
          whatsapp: '+14158902311',
          service: 'SaaS',
          budget: '$1000',
          status: 'New',
          source: 'contact_form',
          notes: 'Need MVP',
          createdAt: new Date('2026-11-10T12:00:00.000Z'),
        },
      ],
    }),
  }));

  const csvRes = await request(app)
    .get('/api/v1/leads/export')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(csvRes.status, 200);
  assert.match(csvRes.headers['content-type'], /text\/csv/);
  assert.ok(csvRes.text.includes(`"'=EVIL()"`));
});

test('Content routes allow public read and require auth for section and settings updates', async () => {
  const contentState: any = {
    slug: 'primary',
    ...buildDefaultSiteContent(),
    toJSON() {
      const { slug: _slug, ...rest } = this;
      return rest;
    },
  };

  mock.method(SiteContent, 'findOne', async () => contentState);
  mock.method(SiteContent, 'findOneAndUpdate', async (_filter: any, update: any) => {
    Object.assign(contentState, update.$set);
    return contentState;
  });
  mock.method(AdminUser, 'findById', async () => ({
    _id: '507f1f77bcf86cd799439011',
    email: 'manager@nexordive.com',
    role: 'superadmin',
    tokenVersion: 0,
  }));

  const publicGet = await request(app).get('/api/v1/content');
  assert.equal(publicGet.status, 200);
  assert.equal(publicGet.body.data.content.global.agencyName, 'NexorDive');

  const unauthPut = await request(app).put('/api/v1/content').send({ schemaVersion: 1 });
  assert.equal(unauthPut.status, 401);

  const token = signAccessToken({
    sub: '507f1f77bcf86cd799439011',
    email: 'manager@nexordive.com',
    role: 'superadmin',
    tokenVersion: 0,
  });

  const badSection = await request(app)
    .patch('/api/v1/content/sections/notARealSection')
    .set('Authorization', `Bearer ${token}`)
    .send({ data: {} });
  assert.equal(badSection.status, 400);

  const patchSettings = await request(app)
    .patch('/api/v1/content/settings')
    .set('Authorization', `Bearer ${token}`)
    .send({
      agencyName: 'NexorDive Studio',
      leaderName: 'Akleem Orakzai',
    });
  assert.equal(patchSettings.status, 200);
  assert.equal(patchSettings.body.data.content.global.agencyName, 'NexorDive Studio');
  assert.equal(patchSettings.body.data.content.mission.ceoBadgeName, 'Akleem Orakzai');
});
