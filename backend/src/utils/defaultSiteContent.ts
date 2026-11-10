import { SiteContentSection } from '../constants/index.js';

export type DefaultSiteContentPayload = {
  schemaVersion: number;
  lastUpdated: string;
} & Record<SiteContentSection, unknown>;

export function buildDefaultSiteContent(): DefaultSiteContentPayload {
  return {
    schemaVersion: 1,
    lastUpdated: new Date().toISOString(),
    global: {
      agencyName: 'NexorDive',
      logoPrefix: 'Nexor',
      logoSuffix: 'Dive',
      whatsappNumber: '+92 314 600 9810',
      whatsappMessage: 'Hello NexorDive, I would like to discuss a project.',
      contactEmail: 'farmanullahk111@gmail.com',
      leaderName: 'Akleem Orakzai',
      leaderRole: 'CEO',
      leaderImage: '/assets/akleem_orakzai_avatar.png',
      categoryTagline: 'SOFTWARE • DIGITAL GROWTH • STREAMER ASSETS',
      footerTagline:
        'Deep Digital Solutions for modern startups, growing enterprises, and digital creators.',
      copyrightText: `© ${new Date().getFullYear()} NexorDive. All rights reserved.`,
      navLinks: [
        { id: 'nav-home', label: 'Home', destination: 'home', visible: true, order: 1 },
        { id: 'nav-about', label: 'About', destination: 'about', visible: true, order: 2 },
        { id: 'nav-services', label: 'Services', destination: 'services', visible: true, order: 3 },
        { id: 'nav-portfolio', label: 'Portfolio', destination: 'portfolio', visible: true, order: 4 },
        { id: 'nav-pricing', label: 'Pricing', destination: 'pricing', visible: true, order: 5 },
        { id: 'nav-streamer', label: 'Streamer Assets', destination: 'streamer-assets', visible: true, order: 6 },
        { id: 'nav-contact', label: 'Contact', destination: 'contact', visible: true, order: 7 },
      ],
      socialLinks: [],
      officeLocations: [],
    },
    hero: {},
    services: {},
    mission: {
      ceoBadgeName: 'Akleem Orakzai',
      ceoBadgeTitle: 'CEO',
      ceoAvatar: '/assets/akleem_orakzai_avatar.png',
    },
    process: {},
    portfolio: {},
    pricing: {},
    streamer: {},
    testimonials: {},
    blog: {},
    partners: {},
    ctaBanner: {},
    contact: {},
    aboutPage: {},
    pageHeaders: {},
    faq: {},
    sectionsManager: {},
    seo: {
      metaTitle: 'NexorDive — Deep Digital Solutions for Modern Businesses',
      metaDescription:
        'NexorDive is an elite digital product agency engineering high-performance web applications, scalable software architectures, and streamer assets.',
      ogTitle: 'NexorDive — Deep Digital Solutions for Modern Businesses',
      ogImageUrl: 'https://nexordive.com/og-image.png',
      keywords: 'Web Development, Software Systems, AI Automation, Streamer Assets',
    },
    customSections: [],
  };
}
