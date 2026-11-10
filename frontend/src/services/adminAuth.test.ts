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
  getActiveAdminEmail,
  getAdminSession,
  getPasswordStrength,
  getStoredCredentials,
  isAdminAccountConfigured,
  setupAdminCredentials,
  updateAdminEmail,
  updateAdminPassword,
  verifyAdminLogin,
} from './adminAuth';

function resetAll() {
  mockLocalStorage.clear();
  mockSessionStorage.clear();
}

test('unconfigured state reports false and rejects login attempts', async () => {
  resetAll();
  assert.equal(isAdminAccountConfigured(), false);
  assert.equal(getStoredCredentials(), null);

  const loginRes = await verifyAdminLogin('manager@nexordive.com', 'NexorDive123');
  assert.equal(loginRes.success, false);
  assert.match(loginRes.error || '', /No manager account has been set up yet/i);
});

test('setupAdminCredentials validates email and password strength before storing', async () => {
  resetAll();

  const badEmail = await setupAdminCredentials('not-an-email', 'StrongPass1');
  assert.equal(badEmail.success, false);

  const shortPass = await setupAdminCredentials('admin@nexordive.com', 'Abc123');
  assert.equal(shortPass.success, false);

  const noNumberPass = await setupAdminCredentials('admin@nexordive.com', 'OnlyLettersHere');
  assert.equal(noNumberPass.success, false);

  assert.equal(isAdminAccountConfigured(), false);
});

test('setupAdminCredentials stores salted PBKDF2 hash (not plaintext) and activates session', async () => {
  resetAll();
  const secret = 'NexorAdmin2026!';
  const res = await setupAdminCredentials('  Admin@NexorDive.com ', secret);

  assert.equal(res.success, true);
  assert.equal(res.email, 'admin@nexordive.com');
  assert.equal(isAdminAccountConfigured(), true);

  const raw = mockLocalStorage.getItem(ADMIN_CREDENTIALS_STORAGE_KEY) || '';
  assert.ok(raw.length > 0);
  assert.equal(raw.includes(secret), false, 'Plaintext password must never be stored');

  const stored = getStoredCredentials();
  assert.ok(stored);
  assert.equal(stored.email, 'admin@nexordive.com');
  assert.equal(stored.algorithm, 'pbkdf2-sha256');
  assert.ok(stored.salt.length === 32);

  const session = getAdminSession();
  assert.equal(session.authenticated, true);
  assert.equal(session.email, 'admin@nexordive.com');
});

test('setupAdminCredentials refuses overwriting an already configured account', async () => {
  resetAll();
  await setupAdminCredentials('first@nexordive.com', 'FirstPass123');

  const second = await setupAdminCredentials('hacker@evil.com', 'SecondPass123');
  assert.equal(second.success, false);
  assert.equal(getActiveAdminEmail(), 'first@nexordive.com');
});

test('verifyAdminLogin succeeds only with matching email and password', async () => {
  resetAll();
  await setupAdminCredentials('owner@nexordive.com', 'OwnerPass99');
  clearAdminSession();

  const ok = await verifyAdminLogin('  OWNER@nexordive.com ', 'OwnerPass99');
  assert.equal(ok.success, true);
  assert.equal(ok.email, 'owner@nexordive.com');

  const wrongEmail = await verifyAdminLogin('other@nexordive.com', 'OwnerPass99');
  assert.equal(wrongEmail.success, false);

  const wrongPass = await verifyAdminLogin('owner@nexordive.com', 'WrongPass99');
  assert.equal(wrongPass.success, false);
});

test('updateAdminEmail requires current password and updates stored + session email', async () => {
  resetAll();
  await setupAdminCredentials('old@nexordive.com', 'SecurePass2026');

  const wrongPwd = await updateAdminEmail('new@nexordive.com', 'WrongPwd123');
  assert.equal(wrongPwd.success, false);
  assert.equal(getActiveAdminEmail(), 'old@nexordive.com');

  const sameEmail = await updateAdminEmail('OLD@nexordive.com', 'SecurePass2026');
  assert.equal(sameEmail.success, false);

  const updated = await updateAdminEmail('new@nexordive.com', 'SecurePass2026');
  assert.equal(updated.success, true);
  assert.equal(updated.email, 'new@nexordive.com');
  assert.equal(getActiveAdminEmail(), 'new@nexordive.com');
  assert.equal(getAdminSession().email, 'new@nexordive.com');

  // Old email must no longer sign in, new email must work with existing password
  const oldLogin = await verifyAdminLogin('old@nexordive.com', 'SecurePass2026');
  assert.equal(oldLogin.success, false);

  const newLogin = await verifyAdminLogin('new@nexordive.com', 'SecurePass2026');
  assert.equal(newLogin.success, true);
});

test('updateAdminPassword verifies current password, rotates salt, and switches valid password', async () => {
  resetAll();
  await setupAdminCredentials('manager@nexordive.com', 'InitialPass1');
  const before = getStoredCredentials();
  assert.ok(before);

  const wrongCurrent = await updateAdminPassword('WrongPass1', 'UpdatedPass2');
  assert.equal(wrongCurrent.success, false);

  const weakNew = await updateAdminPassword('InitialPass1', 'weak');
  assert.equal(weakNew.success, false);

  const sameNew = await updateAdminPassword('InitialPass1', 'InitialPass1');
  assert.equal(sameNew.success, false);

  const ok = await updateAdminPassword('InitialPass1', 'UpdatedPass2');
  assert.equal(ok.success, true);

  const after = getStoredCredentials();
  assert.ok(after);
  assert.notEqual(after.salt, before.salt);
  assert.notEqual(after.passwordHash, before.passwordHash);

  const oldLogin = await verifyAdminLogin('manager@nexordive.com', 'InitialPass1');
  assert.equal(oldLogin.success, false);

  const newLogin = await verifyAdminLogin('manager@nexordive.com', 'UpdatedPass2');
  assert.equal(newLogin.success, true);
});

test('getPasswordStrength computes accurate score and requirement checks', () => {
  assert.equal(getPasswordStrength('').score, 0);
  assert.equal(getPasswordStrength('abc').checks.minLength, false);
  assert.equal(getPasswordStrength('abcdefgh').checks.hasNumber, false);
  assert.equal(getPasswordStrength('Abcd1234!').score, 4);
  assert.equal(getPasswordStrength('Abcd1234!').checks.hasUpperAndSymbol, true);
});

test('handles localStorage QuotaExceededError gracefully during setup', async () => {
  resetAll();
  const originalSetItem = mockLocalStorage.setItem;
  mockLocalStorage.setItem = () => {
    const err = new Error('Storage full');
    err.name = 'QuotaExceededError';
    throw err;
  };

  try {
    const res = await setupAdminCredentials('admin@nexordive.com', 'ValidPass123');
    assert.equal(res.success, false);
    assert.match(res.error || '', /quota/i);
  } finally {
    mockLocalStorage.setItem = originalSetItem;
  }
});
