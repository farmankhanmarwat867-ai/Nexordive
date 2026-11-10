import test from 'node:test';
import assert from 'node:assert/strict';

function createMemoryStorage(): Storage {
  const data: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => {
      data[k] = String(v);
    },
    removeItem: (k: string) => {
      delete data[k];
    },
    clear: () => {
      for (const k of Object.keys(data)) delete data[k];
    },
    key: (i: number) => Object.keys(data)[i] ?? null,
    get length() {
      return Object.keys(data).length;
    },
  };
}

const mockLocalStorage = createMemoryStorage();
const mockSessionStorage = createMemoryStorage();

(globalThis as any).window = {
  localStorage: mockLocalStorage,
  sessionStorage: mockSessionStorage,
};
(globalThis as any).localStorage = mockLocalStorage;
(globalThis as any).sessionStorage = mockSessionStorage;

import {
  ADMIN_CREDENTIALS_STORAGE_KEY,
  clearAdminSession,
  ensureAdminCredentials,
  getActiveAdminEmail,
  getAdminSession,
  getDefaultAdminEmail,
  getPasswordStrength,
  getStoredCredentials,
  isUsingDefaultCredentials,
  setAdminSession,
  updateAdminEmail,
  updateAdminPassword,
  verifyAdminLogin,
} from './adminAuth';

function resetAll() {
  mockLocalStorage.clear();
  mockSessionStorage.clear();
}

test('rejects arbitrary/unauthorized email or wrong password on initial state', async () => {
  resetAll();
  assert.equal(isUsingDefaultCredentials(), true);

  const randomAttempt = await verifyAdminLogin('random.user@example.com', 'Anything123');
  assert.equal(randomAttempt.success, false);
  assert.match(randomAttempt.error || '', /Invalid admin email or password/i);

  const wrongPassword = await verifyAdminLogin(getDefaultAdminEmail(), 'WrongPass123');
  assert.equal(wrongPassword.success, false);
});

test('verifies initial default admin credentials and stores salted PBKDF2 hash (not plaintext)', async () => {
  resetAll();
  const res = await verifyAdminLogin(`  ${getDefaultAdminEmail().toUpperCase()} `, 'NexorDive@2026');

  assert.equal(res.success, true);
  assert.equal(res.email, getDefaultAdminEmail());

  const raw = mockLocalStorage.getItem(ADMIN_CREDENTIALS_STORAGE_KEY) || '';
  assert.ok(raw.length > 0);
  assert.equal(raw.includes('NexorDive@2026'), false, 'Plaintext password must never be stored');

  const stored = getStoredCredentials();
  assert.ok(stored);
  assert.equal(stored.source, 'default');
  assert.equal(stored.algorithm, 'pbkdf2-sha256');
  assert.equal(stored.salt.length, 32);
});

test('updateAdminEmail requires current password, transitions to custom, and blocks old email', async () => {
  resetAll();
  await ensureAdminCredentials();

  const wrongPwd = await updateAdminEmail('owner@nexordive.com', 'WrongPwd123');
  assert.equal(wrongPwd.success, false);
  assert.equal(isUsingDefaultCredentials(), true);

  const sameEmail = await updateAdminEmail(getDefaultAdminEmail(), 'NexorDive@2026');
  assert.equal(sameEmail.success, false);

  setAdminSession(getDefaultAdminEmail());
  const updated = await updateAdminEmail('owner@nexordive.com', 'NexorDive@2026');
  assert.equal(updated.success, true);
  assert.equal(updated.email, 'owner@nexordive.com');
  assert.equal(isUsingDefaultCredentials(), false);
  assert.equal(getActiveAdminEmail(), 'owner@nexordive.com');
  assert.equal(getAdminSession().email, 'owner@nexordive.com');

  clearAdminSession();

  const oldLogin = await verifyAdminLogin(getDefaultAdminEmail(), 'NexorDive@2026');
  assert.equal(oldLogin.success, false);

  const newLogin = await verifyAdminLogin('owner@nexordive.com', 'NexorDive@2026');
  assert.equal(newLogin.success, true);
});

test('updateAdminPassword verifies current password, rotates salt, and invalidates default password', async () => {
  resetAll();
  await ensureAdminCredentials();
  const before = getStoredCredentials();
  assert.ok(before);

  const wrongCurrent = await updateAdminPassword('WrongPass1', 'UpdatedPass2');
  assert.equal(wrongCurrent.success, false);

  const weakNew = await updateAdminPassword('NexorDive@2026', 'weak');
  assert.equal(weakNew.success, false);

  const sameNew = await updateAdminPassword('NexorDive@2026', 'NexorDive@2026');
  assert.equal(sameNew.success, false);

  const ok = await updateAdminPassword('NexorDive@2026', 'CustomStrong99!');
  assert.equal(ok.success, true);
  assert.equal(isUsingDefaultCredentials(), false);

  const after = getStoredCredentials();
  assert.ok(after);
  assert.equal(after.source, 'custom');
  assert.notEqual(after.salt, before.salt);
  assert.notEqual(after.passwordHash, before.passwordHash);

  const oldLogin = await verifyAdminLogin(getDefaultAdminEmail(), 'NexorDive@2026');
  assert.equal(oldLogin.success, false);

  const newLogin = await verifyAdminLogin(getDefaultAdminEmail(), 'CustomStrong99!');
  assert.equal(newLogin.success, true);
});

test('getPasswordStrength computes accurate score and requirement checks', () => {
  assert.equal(getPasswordStrength('').score, 0);
  assert.equal(getPasswordStrength('abc').checks.minLength, false);
  assert.equal(getPasswordStrength('abcdefgh').checks.hasNumber, false);
  assert.equal(getPasswordStrength('Abcd1234!').score, 4);
  assert.equal(getPasswordStrength('Abcd1234!').checks.hasUpperAndSymbol, true);
});

test('handles localStorage QuotaExceededError gracefully during credential updates', async () => {
  resetAll();
  await ensureAdminCredentials();
  const originalSetItem = mockLocalStorage.setItem;
  mockLocalStorage.setItem = () => {
    const err = new Error('Storage full');
    err.name = 'QuotaExceededError';
    throw err;
  };

  try {
    const res = await updateAdminPassword('NexorDive@2026', 'ValidPass123');
    assert.equal(res.success, false);
    assert.match(res.error || '', /quota/i);
  } finally {
    mockLocalStorage.setItem = originalSetItem;
  }
});
