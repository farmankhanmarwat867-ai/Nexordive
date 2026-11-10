/**
 * NexorDive Admin Authentication & Credential Repository
 *
 * Stores salted PBKDF2-SHA256 password hashes in browser localStorage and manages
 * active manager session state in sessionStorage.
 * Designed with async interfaces so it can swap cleanly to a backend auth API later.
 */

export const ADMIN_CREDENTIALS_STORAGE_KEY = 'nexordive_admin_credentials_v1';
export const ADMIN_SESSION_AUTH_KEY = 'nexordive_admin_auth';
export const ADMIN_SESSION_EMAIL_KEY = 'nexordive_admin_email';

const PBKDF2_ITERATIONS_SUBTLE = 100_000;
const PBKDF2_ITERATIONS_FALLBACK = 10_000;
const SALT_BYTE_LENGTH = 16;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_HAS_LETTER = /[A-Za-z]/;
const PASSWORD_HAS_NUMBER = /\d/;
const PASSWORD_HAS_UPPER = /[A-Z]/;
const PASSWORD_HAS_SYMBOL = /[^A-Za-z0-9]/;

export interface StoredAdminCredentials {
  schemaVersion: 1;
  email: string;
  passwordHash: string;
  salt: string;
  iterations: number;
  algorithm: 'pbkdf2-sha256';
  updatedAt: string;
}

export interface AdminAuthResult {
  success: boolean;
  email?: string;
  error?: string;
}

export interface PasswordStrengthInfo {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Empty' | 'Too weak' | 'Fair' | 'Good' | 'Strong';
  checks: {
    minLength: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    hasUpperAndSymbol: boolean;
  };
}

function getLocalStorage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    return null;
  }
  return null;
}

function getSessionStorage(): Storage | null {
  try {
    if (typeof sessionStorage !== 'undefined') return sessionStorage;
    if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage;
  } catch {
    return null;
  }
  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  const clean = normalizeEmail(email);
  if (!clean) {
    return 'Please enter an email address.';
  }
  if (!EMAIL_PATTERN.test(clean)) {
    return 'Enter an email address in the format name@example.com.';
  }
  return null;
}

export function validatePasswordStrength(password: string): string | null {
  if (!password) {
    return 'Please enter a password.';
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
  }
  if (!PASSWORD_HAS_LETTER.test(password) || !PASSWORD_HAS_NUMBER.test(password)) {
    return 'Password must include at least one letter and one number.';
  }
  return null;
}

export function getPasswordStrength(password: string): PasswordStrengthInfo {
  const checks = {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasLetter: PASSWORD_HAS_LETTER.test(password),
    hasNumber: PASSWORD_HAS_NUMBER.test(password),
    hasUpperAndSymbol: PASSWORD_HAS_UPPER.test(password) && PASSWORD_HAS_SYMBOL.test(password),
  };

  if (!password) {
    return { score: 0, label: 'Empty', checks };
  }

  let score = 0;
  if (checks.minLength) score += 1;
  if (checks.hasLetter) score += 1;
  if (checks.hasNumber) score += 1;
  if (checks.hasUpperAndSymbol || password.length >= 12) score += 1;

  const clamped = Math.min(4, Math.max(1, score)) as 1 | 2 | 3 | 4;
  const labels: Record<1 | 2 | 3 | 4, PasswordStrengthInfo['label']> = {
    1: 'Too weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };

  return {
    score: clamped,
    label: labels[clamped],
    checks,
  };
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function generateRandomSaltHex(): string {
  const bytes = new Uint8Array(SALT_BYTE_LENGTH);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytesToHex(bytes);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Minimal pure-JS SHA-256 + HMAC-SHA256 + PBKDF2 fallback for non-secure HTTP LAN contexts
// where browsers omit window.crypto.subtle.
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function sha256Bytes(data: Uint8Array): Uint8Array {
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const bitLen = data.length * 8;
  const paddedLen = Math.ceil((data.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(data);
  padded[data.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);

  const w = new Uint32Array(64);
  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = ((w[i - 15] >>> 7) | (w[i - 15] << 25)) ^ ((w[i - 15] >>> 18) | (w[i - 15] << 14)) ^ (w[i - 15] >>> 3);
      const s1 = ((w[i - 2] >>> 17) | (w[i - 2] << 15)) ^ ((w[i - 2] >>> 19) | (w[i - 2] << 13)) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i += 1) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      hh = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i += 1) {
    outView.setUint32(i * 4, h[i], false);
  }
  return out;
}

function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  const blockSize = 64;
  const normKey = key.length > blockSize ? sha256Bytes(key) : key;
  const oPad = new Uint8Array(blockSize + 32);
  const iPad = new Uint8Array(blockSize + message.length);
  oPad.fill(0x5c, 0, blockSize);
  iPad.fill(0x36, 0, blockSize);
  for (let i = 0; i < normKey.length; i += 1) {
    oPad[i] ^= normKey[i];
    iPad[i] ^= normKey[i];
  }
  iPad.set(message, blockSize);
  oPad.set(sha256Bytes(iPad), blockSize);
  return sha256Bytes(oPad);
}

function pbkdf2FallbackHex(passwordBytes: Uint8Array, saltBytes: Uint8Array, iterations: number): string {
  const blockInput = new Uint8Array(saltBytes.length + 4);
  blockInput.set(saltBytes);
  blockInput[saltBytes.length + 3] = 1; // Big-endian block index 1 (32-byte key)

  let u = hmacSha256(passwordBytes, blockInput);
  const dk = new Uint8Array(u);
  for (let i = 1; i < iterations; i += 1) {
    u = hmacSha256(passwordBytes, u);
    for (let j = 0; j < dk.length; j += 1) {
      dk[j] ^= u[j];
    }
  }
  return bytesToHex(dk);
}

async function derivePasswordHash(
  password: string,
  saltHex: string,
  iterations: number
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = hexToBytes(saltHex);

  const subtle = typeof globalThis !== 'undefined' ? globalThis.crypto?.subtle : undefined;
  if (subtle) {
    const keyMaterial = await subtle.importKey(
      'raw',
      passwordBytes,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derivedBits = await subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes.buffer as ArrayBuffer,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );
    return bytesToHex(new Uint8Array(derivedBits));
  }

  return pbkdf2FallbackHex(passwordBytes, saltBytes, iterations);
}

function defaultIterationCount(): number {
  const hasSubtle = typeof globalThis !== 'undefined' && Boolean(globalThis.crypto?.subtle);
  return hasSubtle ? PBKDF2_ITERATIONS_SUBTLE : PBKDF2_ITERATIONS_FALLBACK;
}

export function getStoredCredentials(): StoredAdminCredentials | null {
  const storage = getLocalStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(ADMIN_CREDENTIALS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAdminCredentials>;
    if (
      parsed &&
      parsed.schemaVersion === 1 &&
      typeof parsed.email === 'string' &&
      typeof parsed.passwordHash === 'string' &&
      typeof parsed.salt === 'string' &&
      typeof parsed.iterations === 'number' &&
      parsed.iterations > 0
    ) {
      return parsed as StoredAdminCredentials;
    }
  } catch {
    return null;
  }
  return null;
}

function saveStoredCredentials(credentials: StoredAdminCredentials): { success: boolean; error?: string } {
  const storage = getLocalStorage();
  if (!storage) {
    return { success: false, error: 'Browser storage is unavailable.' };
  }

  try {
    storage.setItem(ADMIN_CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
    return { success: true };
  } catch (err: any) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      return {
        success: false,
        error: 'Storage quota exceeded. Please free up browser storage space and try again.',
      };
    }
    return {
      success: false,
      error: err?.message || 'Unable to save credentials to browser storage.',
    };
  }
}

export function isAdminAccountConfigured(): boolean {
  return getStoredCredentials() !== null;
}

export function getAdminSession(): { authenticated: boolean; email: string | null } {
  const storage = getSessionStorage();
  if (!storage) return { authenticated: false, email: null };

  const authenticated = storage.getItem(ADMIN_SESSION_AUTH_KEY) === 'true';
  const email = storage.getItem(ADMIN_SESSION_EMAIL_KEY);
  return { authenticated, email };
}

export function setAdminSession(email: string): void {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.setItem(ADMIN_SESSION_AUTH_KEY, 'true');
  storage.setItem(ADMIN_SESSION_EMAIL_KEY, normalizeEmail(email));
}

export function clearAdminSession(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.removeItem(ADMIN_SESSION_AUTH_KEY);
  storage.removeItem(ADMIN_SESSION_EMAIL_KEY);
}

export function getActiveAdminEmail(): string | null {
  const stored = getStoredCredentials();
  if (stored?.email) return stored.email;
  return getAdminSession().email;
}

export async function setupAdminCredentials(
  email: string,
  password: string
): Promise<AdminAuthResult> {
  if (getStoredCredentials()) {
    return {
      success: false,
      error: 'Manager account is already configured. Please sign in or update credentials from Settings.',
    };
  }

  const emailError = validateEmail(email);
  if (emailError) return { success: false, error: emailError };

  const passwordError = validatePasswordStrength(password);
  if (passwordError) return { success: false, error: passwordError };

  const cleanEmail = normalizeEmail(email);
  const salt = generateRandomSaltHex();
  const iterations = defaultIterationCount();
  const passwordHash = await derivePasswordHash(password, salt, iterations);

  const credentials: StoredAdminCredentials = {
    schemaVersion: 1,
    email: cleanEmail,
    passwordHash,
    salt,
    iterations,
    algorithm: 'pbkdf2-sha256',
    updatedAt: new Date().toISOString(),
  };

  const saved = saveStoredCredentials(credentials);
  if (!saved.success) {
    return { success: false, error: saved.error };
  }

  setAdminSession(cleanEmail);
  return { success: true, email: cleanEmail };
}

export async function verifyAdminLogin(
  email: string,
  password: string
): Promise<AdminAuthResult> {
  const emailError = validateEmail(email);
  if (emailError) return { success: false, error: emailError };

  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const stored = getStoredCredentials();
  if (!stored) {
    return {
      success: false,
      error: 'No manager account has been set up yet.',
    };
  }

  const cleanEmail = normalizeEmail(email);
  const candidateHash = await derivePasswordHash(password, stored.salt, stored.iterations);

  const emailMatches = constantTimeEqual(cleanEmail, normalizeEmail(stored.email));
  const passwordMatches = constantTimeEqual(candidateHash, stored.passwordHash);

  if (!emailMatches || !passwordMatches) {
    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials and try again.',
    };
  }

  return { success: true, email: stored.email };
}

export async function updateAdminEmail(
  newEmail: string,
  currentPassword: string
): Promise<AdminAuthResult> {
  const stored = getStoredCredentials();
  if (!stored) {
    return {
      success: false,
      error: 'Manager credentials must be initialized before changing your email.',
    };
  }

  const emailError = validateEmail(newEmail);
  if (emailError) return { success: false, error: emailError };

  if (!currentPassword) {
    return { success: false, error: 'Enter your current password to confirm this email change.' };
  }

  const cleanNewEmail = normalizeEmail(newEmail);
  if (constantTimeEqual(cleanNewEmail, normalizeEmail(stored.email))) {
    return { success: false, error: 'New login email matches your current login email.' };
  }

  const currentHash = await derivePasswordHash(currentPassword, stored.salt, stored.iterations);
  if (!constantTimeEqual(currentHash, stored.passwordHash)) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const updated: StoredAdminCredentials = {
    ...stored,
    email: cleanNewEmail,
    updatedAt: new Date().toISOString(),
  };

  const saved = saveStoredCredentials(updated);
  if (!saved.success) {
    return { success: false, error: saved.error };
  }

  if (getAdminSession().authenticated) {
    setAdminSession(cleanNewEmail);
  }

  return { success: true, email: cleanNewEmail };
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<AdminAuthResult> {
  const stored = getStoredCredentials();
  if (!stored) {
    return {
      success: false,
      error: 'Manager credentials must be initialized before changing your password.',
    };
  }

  if (!currentPassword) {
    return { success: false, error: 'Please enter your current password.' };
  }

  const currentHash = await derivePasswordHash(currentPassword, stored.salt, stored.iterations);
  if (!constantTimeEqual(currentHash, stored.passwordHash)) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const passwordError = validatePasswordStrength(newPassword);
  if (passwordError) return { success: false, error: passwordError };

  if (newPassword === currentPassword) {
    return {
      success: false,
      error: 'New password must be different from your current password.',
    };
  }

  const newSalt = generateRandomSaltHex();
  const iterations = defaultIterationCount();
  const newHash = await derivePasswordHash(newPassword, newSalt, iterations);

  const updated: StoredAdminCredentials = {
    ...stored,
    passwordHash: newHash,
    salt: newSalt,
    iterations,
    updatedAt: new Date().toISOString(),
  };

  const saved = saveStoredCredentials(updated);
  if (!saved.success) {
    return { success: false, error: saved.error };
  }

  return { success: true, email: stored.email };
}
