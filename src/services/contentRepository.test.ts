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

test('getStoredContent safely populates aboutPage defaults when missing in legacy storage', () => {
  localStorage.clear();
  const legacyData = {
    schemaVersion: 1,
    global: { agencyName: 'NexorDive Custom' },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(legacyData));

  const retrieved = getStoredContent();
  assert.ok(retrieved.aboutPage);
  assert.equal(retrieved.aboutPage.intro.heading, 'Choose NexorDive');
  assert.equal(retrieved.aboutPage.consultation.heading, 'Start Project With Us ?');
  assert.equal(retrieved.aboutPage.teamMembers.length, 9);
  assert.equal(retrieved.aboutPage.corePillars.length, 4);
});

test('getStoredContent preserves manager edits to aboutPage and empty arrays', () => {
  localStorage.clear();
  const customData = {
    schemaVersion: 1,
    aboutPage: {
      intro: {
        eyebrow: 'Custom Eyebrow',
        heading: 'Custom About Heading',
        paragraph1: 'P1 text',
        paragraph2: 'P2 text',
        buttonLabel: 'Schedule Call',
        buttonAction: 'contact',
        techTreeImage: '/assets/custom_tree.png',
        techTreeImageAlt: 'Custom Tree',
      },
      consultation: {
        heading: 'Start Your Build',
        description: 'Consultation copy',
        buttonLabel: 'Get In Touch',
        buttonAction: 'start-project',
        backgroundImage: '/assets/custom_bg.jpg',
        backgroundImageAlt: 'Custom BG',
      },
      teamSection: {
        eyebrow: 'Our Squad',
        title: 'Engineering Guild',
        description: 'Guild details',
      },
      teamMembers: [], // Manager explicitly cleared members
      pillarsSection: {
        title: 'Our Standards',
      },
      corePillars: [
        {
          id: 'pillar-1',
          title: 'Speed Above All',
          description: 'Sub-second response guarantee',
          iconName: 'Zap',
          visible: true,
          order: 1,
        },
      ],
      sectionsVisibility: {
        intro: true,
        consultation: false,
        team: false,
        pillars: true,
      },
    },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(customData));

  const retrieved = getStoredContent();
  assert.equal(retrieved.aboutPage?.intro.heading, 'Custom About Heading');
  assert.equal(retrieved.aboutPage?.teamMembers.length, 0); // Empty array preserved
  assert.equal(retrieved.aboutPage?.corePillars.length, 1);
  assert.equal(retrieved.aboutPage?.sectionsVisibility.consultation, false);
});

// Regression tests for Navigation migration & Manager Authority (Requirements a - e)
test('a. Fresh defaults include About navigation link', () => {
  localStorage.clear();
  const retrieved = getStoredContent();
  const aboutLink = retrieved.global.navLinks.find((l) => l.destination === 'about');
  assert.ok(aboutLink, 'Fresh defaults must include About link');
  assert.equal(aboutLink?.label, 'About');
  assert.equal(aboutLink?.visible, true);
});

test('b. A saved navigation array intentionally excluding About stays unchanged after reload', () => {
  localStorage.clear();
  const savedNav = [
    { id: 'home', label: 'Home', destination: 'home', visible: true, order: 1 },
    { id: 'services', label: 'Services', destination: 'services', visible: true, order: 2 },
    { id: 'contact', label: 'Contact', destination: 'contact', visible: true, order: 3 },
  ];
  const customData = {
    schemaVersion: 1,
    global: {
      ...DEFAULT_SITE_CONTENT.global,
      navLinks: savedNav,
    },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(customData));

  const retrieved = getStoredContent();
  const links = retrieved.global.navLinks;
  const hasAbout = links.some((l) => l.destination === 'about');
  assert.equal(hasAbout, false, 'Deleted or excluded About link must NOT be reinserted');
  assert.equal(links.length, 3);
  assert.deepEqual(links.map((l) => l.destination), ['home', 'services', 'contact']);
});

test('c. An empty saved navigation array stays empty', () => {
  localStorage.clear();
  const customData = {
    schemaVersion: 1,
    global: {
      ...DEFAULT_SITE_CONTENT.global,
      navLinks: [], // Intentionally emptied by manager
    },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(customData));

  const retrieved = getStoredContent();
  assert.equal(Array.isArray(retrieved.global.navLinks), true);
  assert.equal(retrieved.global.navLinks.length, 0, 'Empty saved navigation array must remain empty');
});

test('d. Hidden About stays hidden (visible: false) after reload', () => {
  localStorage.clear();
  const customData = {
    schemaVersion: 1,
    global: {
      ...DEFAULT_SITE_CONTENT.global,
      navLinks: [
        { id: 'home', label: 'Home', destination: 'home', visible: true, order: 1 },
        { id: 'about', label: 'Company About', destination: 'about', visible: false, order: 2 },
        { id: 'contact', label: 'Contact', destination: 'contact', visible: true, order: 3 },
      ],
    },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(customData));

  const retrieved = getStoredContent();
  const aboutLink = retrieved.global.navLinks.find((l) => l.destination === 'about');
  assert.ok(aboutLink);
  assert.equal(aboutLink.visible, false, 'Hidden state visible: false must be preserved');
  assert.equal(aboutLink.label, 'Company About', 'Custom label must be preserved');
});

test('e. Custom ordering is preserved without duplicate orders or injected links', () => {
  localStorage.clear();
  const customOrdering = [
    { id: 'contact', label: 'Contact Us', destination: 'contact', visible: true, order: 1 },
    { id: 'about', label: 'About Agency', destination: 'about', visible: true, order: 2 },
    { id: 'home', label: 'Main', destination: 'home', visible: true, order: 3 },
  ];
  const customData = {
    schemaVersion: 1,
    global: {
      ...DEFAULT_SITE_CONTENT.global,
      navLinks: customOrdering,
    },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(customData));

  const retrieved = getStoredContent();
  assert.deepEqual(
    retrieved.global.navLinks.map((l) => ({ id: l.id, order: l.order, destination: l.destination })),
    [
      { id: 'contact', order: 1, destination: 'contact' },
      { id: 'about', order: 2, destination: 'about' },
      { id: 'home', order: 3, destination: 'home' },
    ]
  );
});

// Storage Failure Simulation Tests
test('saveStoredContent returns failure result when localStorage.setItem throws QuotaExceededError', () => {
  localStorage.clear();
  const originalSetItem = mockLocalStorage.setItem;
  try {
    mockLocalStorage.setItem = () => {
      const err = new Error('The quota has been exceeded.');
      err.name = 'QuotaExceededError';
      throw err;
    };

    const result = saveStoredContent(DEFAULT_SITE_CONTENT);
    assert.equal(result.success, false);
    assert.ok(result.error);
    assert.match(result.error, /quota/i);
  } finally {
    mockLocalStorage.setItem = originalSetItem;
  }
});

test('saveStoredContent retries cleanly and persists content after storage failure is resolved', () => {
  localStorage.clear();
  const originalSetItem = mockLocalStorage.setItem;
  try {
    // 1. First attempt fails due to quota
    mockLocalStorage.setItem = () => {
      const err = new Error('Storage failure');
      err.name = 'QuotaExceededError';
      throw err;
    };
    const failedResult = saveStoredContent(DEFAULT_SITE_CONTENT);
    assert.equal(failedResult.success, false);

    // 2. Storage is restored / recovered
    mockLocalStorage.setItem = originalSetItem;

    // 3. Single retry succeeds
    const customContent = {
      ...DEFAULT_SITE_CONTENT,
      global: {
        ...DEFAULT_SITE_CONTENT.global,
        agencyName: 'Recovered Agency Name',
      },
    };
    const retryResult = saveStoredContent(customContent);
    assert.equal(retryResult.success, true);

    const reloaded = getStoredContent();
    assert.equal(reloaded.global.agencyName, 'Recovered Agency Name');
  } finally {
    mockLocalStorage.setItem = originalSetItem;
  }
});

test('getStoredContent merges partners platforms and preserves manager platforms list', () => {
  localStorage.clear();
  const customData = {
    schemaVersion: 1,
    partners: {
      platforms: [
        { id: 'custom-1', name: 'Custom Discord', platformKey: 'discord', url: 'https://discord.gg/test', visible: true, order: 1 },
      ],
    },
  };
  localStorage.setItem('nexordive_site_content_v1', JSON.stringify(customData));

  const retrieved = getStoredContent();
  assert.equal(retrieved.partners.platforms?.length, 1);
  assert.equal(retrieved.partners.platforms?.[0].url, 'https://discord.gg/test');
});
