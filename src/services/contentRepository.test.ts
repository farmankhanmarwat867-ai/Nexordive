import test from 'node:test';
import assert from 'node:assert/strict';

// Mock browser environment for node testing
const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (k: string) => storage[k] || null,
  setItem: (k: string, v: string) => { storage[k] = v; },
  removeItem: (k: string) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
  key: (i: number) => Object.keys(storage)[i] || null,
  length: 0,
};

(global as any).window = {
  localStorage: mockLocalStorage,
};
(global as any).localStorage = mockLocalStorage;

import { getStoredContent, resetContentToDefaults, saveStoredContent } from './contentRepository';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';

test('getStoredContent returns DEFAULT_SITE_CONTENT when localStorage is empty', () => {
  localStorage.clear();
  const content = getStoredContent();
  assert.equal(content.ctaBanner.heading, "Let's Engineer Your Next Big Digital Milestone.");
  assert.equal(content.global.categoryTagline, 'SOFTWARE • DIGITAL GROWTH • STREAMER ASSETS');
  assert.equal(content.mission.preheading, 'About NexorDive');
  assert.equal(content.pricing.reassuranceBanner?.visible, true);
  assert.equal(content.streamer.suitesSectionTitle, 'All-Inclusive Broadcast Suites');
});

test('getStoredContent preserves empty array when manager deletes all broadcast suites', () => {
  localStorage.clear();
  const custom = {
    ...DEFAULT_SITE_CONTENT,
    streamer: {
      ...DEFAULT_SITE_CONTENT.streamer,
      suites: [], // Manager deleted all suites
    },
  };
  saveStoredContent(custom);

  const retrieved = getStoredContent();
  assert.equal(Array.isArray(retrieved.streamer.suites), true);
  assert.equal(retrieved.streamer.suites.length, 0); // Must remain 0, NOT restored to default
});

test('getStoredContent safely populates missing new fields on legacy stored data', () => {
  localStorage.clear();
  // Simulate legacy stored data lacking new fields
  const legacyData = {
    schemaVersion: 1,
    global: { agencyName: 'My Custom Agency' },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(legacyData));

  const retrieved = getStoredContent();
  assert.equal(retrieved.global.agencyName, 'My Custom Agency');
  assert.equal(retrieved.global.categoryTagline, 'SOFTWARE • DIGITAL GROWTH • STREAMER ASSETS');
  assert.equal(retrieved.ctaBanner.eyebrow, 'Ready to Scale Your Brand?');
  assert.equal(retrieved.pricing.reassuranceBanner?.ctaLabel, 'Need Custom Scope?');
  assert.equal(retrieved.mission.readMoreLabel, 'Read More');
  assert.equal(retrieved.mission.readMoreAction, 'about');
});

test('getStoredContent preserves explicitly configured readMoreAction', () => {
  localStorage.clear();
  const customData = {
    schemaVersion: 1,
    mission: {
      readMoreAction: 'services',
    },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(customData));

  const retrieved = getStoredContent();
  assert.equal(retrieved.mission.readMoreAction, 'services');
});
