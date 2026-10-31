/**
 * NexorDive - CMS Site Content Type Definitions
 */

export interface NavLinkItem {
  id: string;
  label: string;
  destination: string; // e.g. 'home', 'services', 'streamer-assets', 'pricing', 'portfolio', 'contact'
  visible: boolean;
  order: number;
}

export interface SocialLinkItem {
  id: string;
  platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram' | 'github' | 'custom';
  label: string;
  url: string;
  visible: boolean;
}

export interface GlobalContent {
  agencyName: string;
  logoPrefix: string;
  logoSuffix: string;
  navLinks: NavLinkItem[];
  headerCtaLabel: string;
  headerCtaDestination: string;
  socialLinks: SocialLinkItem[];
  whatsappNumber: string;
  whatsappMessage: string;
  contactEmail: string;
  leaderName?: string;
  leaderRole?: string;
  leaderImage?: string;
  categoryTagline?: string;
  footerTagline: string;
  copyrightText: string;
  officeLocations: { city: string; timezone: string; label: string }[];
}

export interface HeroStatCard {
  id: string;
  value: string;
  label: string;
}

export interface HeroContent {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;
  headingLine4: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryButtonLabel: string;
  primaryButtonAction: string; // 'contact' | 'services' | 'portfolio' | 'streamer-assets' | 'start-project' | custom
  secondaryButtonLabel: string;
  secondaryButtonAction: string;
  statCards: HeroStatCard[];
}

export interface ServiceCardItem {
  id: string;
  title: string;
  iconName: string;
  isTealHighlight: boolean;
  description: string;
  features: string[];
  techStack: string[];
  visible: boolean;
  order: number;
}

export interface ServicesContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  highlightedWord: string;
  ctaText: string;
  ctaAction: string;
  cards: ServiceCardItem[];
}

export interface MissionPillar {
  id: string;
  number: string;
  title: string;
}

export interface MetricItem {
  id: string;
  value: string;
  label: string;
  context: string;
}

export interface MissionContent {
  preheading?: string;
  heading: string;
  description: string;
  readMoreLabel?: string;
  readMoreAction?: string;
  ceoBadgeName: string;
  ceoBadgeTitle: string;
  ceoAvatar: string;
  missionImage: string;
  missionImageAlt: string;
  pillars: MissionPillar[];
  metrics: MetricItem[];
}

export interface ProcessStepItem {
  id: string;
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
  keyOutcome: string;
  order: number;
}

export interface ProcessContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  steps: ProcessStepItem[];
}

export interface PortfolioProjectItem {
  id: string;
  title: string;
  client: string;
  category: string; // 'fintech' | 'ai' | 'saas' | 'spatial' | custom
  year: string;
  summary: string;
  impactMetric: string;
  impactLabel: string;
  deliverables: string[];
  techStack: string[];
  challenge: string;
  solution: string;
  outcome: string;
  previewGradient: string;
  accentColor: string;
  image?: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface PortfolioContent {
  sectionEyebrow: string;
  sectionTitle: string;
  projects: PortfolioProjectItem[];
}

export interface PricingPlanItem {
  id: string;
  name: string;
  price: string;
  billing: string;
  badge: string;
  popular: boolean;
  description: string;
  features: string[];
  turnaround: string;
  accentColor: string;
  buttonText: string;
  buttonAction: string;
  isCustomQuote: boolean;
  visible: boolean;
  order: number;
}

export interface EstimatorRateConfig {
  baseRates: Record<string, { min: number; max: number; minWeeks: number; maxWeeks: number }>;
  platformMultipliers: Record<string, number>;
  fidelityMultipliers: {
    clean: { cost: number; weeks: number };
    bespoke: { cost: number; weeks: number };
    award: { cost: number; weeks: number };
  };
  timelineMultipliers: {
    fast: { cost: number; weeksFactor: number };
    standard: { cost: number; weeksFactor: number };
    extended: { cost: number; weeksFactor: number };
  };
}

export interface PricingReassuranceBanner {
  text: string;
  ctaLabel: string;
  ctaAction: string;
  visible: boolean;
}

export interface PricingContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  plans: PricingPlanItem[];
  reassuranceBanner?: PricingReassuranceBanner;
  estimatorRates: EstimatorRateConfig;
}

export interface StreamerStartingCard {
  id: string;
  platform: string;
  startingPrice: string;
  priceNumeric: number;
  iconName: string;
  accentColor: string;
  badge: string;
  description: string;
  features: string[];
  visible: boolean;
  order: number;
}

export interface StreamerSuite {
  id: string;
  name: string;
  turnaround: string;
  description: string;
  items: string[];
  popular: boolean;
  order: number;
  visible?: boolean;
  buttonLabel?: string;
  buttonAction?: string;
}

export interface StreamerContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  suitesSectionEyebrow?: string;
  suitesSectionTitle?: string;
  startingCards: StreamerStartingCard[];
  suites: StreamerSuite[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  metric?: string;
  metricContext?: string;
  visible: boolean;
  order: number;
}

export interface TestimonialsContent {
  sectionTitle: string;
  sectionDescription: string;
  testimonials: TestimonialItem[];
}

export interface BlogCardItem {
  id: string;
  title: string;
  date: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  link: string;
  category: string;
  visible: boolean;
  order: number;
}

export interface BlogContent {
  sectionEyebrow: string;
  sectionTitle: string;
  blogs: BlogCardItem[];
}

export interface PartnerLogoItem {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  visible: boolean;
  order: number;
}

export interface PartnersContent {
  mode: 'banner' | 'grid';
  bannerImage: string;
  bannerAlt: string;
  partners: PartnerLogoItem[];
}

export interface CtaBannerContent {
  eyebrow: string;
  heading: string;
  description: string;
  primaryButtonLabel: string;
  primaryButtonAction: string;
  secondaryButtonLabel: string;
  secondaryButtonAction: string;
}

export interface ContactContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  directHeading: string;
  directDescription: string;
  responseGuarantee: string;
  ndaGuarantee: string;
  successMessage: string;
}

export interface PageHeaderItem {
  badge: string;
  title: string;
  description: string;
}

export interface PageHeadersContent {
  services: PageHeaderItem;
  streamerAssets: PageHeaderItem;
  pricing: PageHeaderItem;
  portfolio: PageHeaderItem;
  contact: PageHeaderItem;
}

export interface SectionOrderItem {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface SectionsManagerContent {
  landingPageSections: SectionOrderItem[];
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  ogTitle: string;
  keywords: string;
}

export interface SiteContent {
  schemaVersion: number;
  lastUpdated: string;
  global: GlobalContent;
  hero: HeroContent;
  services: ServicesContent;
  mission: MissionContent;
  process: ProcessContent;
  portfolio: PortfolioContent;
  pricing: PricingContent;
  streamer: StreamerContent;
  testimonials: TestimonialsContent;
  blog: BlogContent;
  partners: PartnersContent;
  ctaBanner: CtaBannerContent;
  contact: ContactContent;
  pageHeaders: PageHeadersContent;
  sectionsManager: SectionsManagerContent;
  seo: SeoSettings;
}
