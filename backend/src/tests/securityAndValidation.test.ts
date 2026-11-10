import './testEnvSetup.js';
import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeValue } from '../middlewares/sanitizeInput.js';
import { escapeCsvCell } from '../services/leadService.js';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import {
  changePasswordSchema,
  setupAdminSchema,
  updateAdminEmailSchema,
} from '../validators/authValidators.js';
import { sectionParamSchema } from '../validators/contentValidators.js';
import { createLeadSchema, leadIdParamSchema } from '../validators/leadValidators.js';

test('sanitizeValue strips MongoDB $ operators, prototype pollution keys, and NUL bytes', () => {
  const malicious = {
    email: 'admin@nexordive.com\0',
    password: { $ne: '' },
    nested: [{ $gt: 0, safe: 'ok' }],
    __proto__: { polluted: true },
    constructor: { prototype: { polluted: true } },
  };

  const sanitized = sanitizeValue(malicious) as Record<string, any>;
  assert.equal(sanitized.email, 'admin@nexordive.com');
  assert.deepEqual(sanitized.password, {});
  assert.deepEqual(sanitized.nested, [{ safe: 'ok' }]);
  assert.equal(Object.prototype.hasOwnProperty.call(sanitized, 'constructor'), false);
  assert.equal(({} as any).polluted, undefined);
});

test('escapeCsvCell neutralizes spreadsheet formula injection and escapes quotes', () => {
  assert.equal(escapeCsvCell('=CMD("calc")'), `"'=CMD(""calc"")"`);
  assert.equal(escapeCsvCell('+1+1'), `"'+1+1"`);
  assert.equal(escapeCsvCell('-100'), `"'-100"`);
  assert.equal(escapeCsvCell('@SUM(A1:A2)'), `"'@SUM(A1:A2)"`);
  assert.equal(escapeCsvCell('Line 1\nLine 2'), `"Line 1 Line 2"`);
});

test('JWT access and refresh tokens enforce token type separation', () => {
  const access = signAccessToken({
    sub: '507f1f77bcf86cd799439011',
    email: 'manager@nexordive.com',
    role: 'superadmin',
    tokenVersion: 0,
  });
  const refresh = signRefreshToken({
    sub: '507f1f77bcf86cd799439011',
    tokenVersion: 0,
  });

  const decodedAccess = verifyAccessToken(access);
  assert.equal(decodedAccess.email, 'manager@nexordive.com');
  assert.equal(decodedAccess.type, 'access');

  const decodedRefresh = verifyRefreshToken(refresh);
  assert.equal(decodedRefresh.sub, '507f1f77bcf86cd799439011');
  assert.equal(decodedRefresh.type, 'refresh');

  // Cross-verification must fail
  assert.throws(() => verifyAccessToken(refresh));
  assert.throws(() => verifyRefreshToken(access));
  assert.equal(hashToken(refresh).length, 64);
});

test('Zod auth validators enforce strong passwords and valid emails', () => {
  assert.equal(
    setupAdminSchema.safeParse({ email: 'bad', password: 'Strong123' }).success,
    false
  );
  assert.equal(
    setupAdminSchema.safeParse({ email: 'admin@nexordive.com', password: 'weak' }).success,
    false
  );
  assert.equal(
    setupAdminSchema.safeParse({ email: 'admin@nexordive.com', password: 'OnlyLetters' }).success,
    false
  );
  assert.equal(
    setupAdminSchema.safeParse({ email: ' Admin@NexorDive.com ', password: 'Strong123' }).success,
    true
  );
  assert.equal(
    updateAdminEmailSchema.safeParse({ newEmail: 'new@nexordive.com', currentPassword: '123' }).success,
    true
  );
  assert.equal(
    changePasswordSchema.safeParse({ currentPassword: 'old', newPassword: 'NewPass123' }).success,
    true
  );
});

test('Lead and CMS section validators check ObjectIds and section names', () => {
  assert.equal(leadIdParamSchema.safeParse({ id: 'invalid-id' }).success, false);
  assert.equal(leadIdParamSchema.safeParse({ id: '507f1f77bcf86cd799439011' }).success, true);

  assert.equal(sectionParamSchema.safeParse({ section: 'hero' }).success, true);
  assert.equal(sectionParamSchema.safeParse({ section: 'aboutPage' }).success, true);
  assert.equal(sectionParamSchema.safeParse({ section: 'unknownSection' }).success, false);

  const validLead = createLeadSchema.safeParse({
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    whatsapp: '+1 415 890 2311',
    service: 'Web Development',
    budget: '$300 - $699',
  });
  assert.equal(validLead.success, true);
});
