/**
 * NexorDive Digital Agency - Data Types
 */

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  metric: {
    value: string;
    label: string;
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: 'ai' | 'fintech' | 'saas' | 'spatial';
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
}

export interface ProcessPhase {
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
  keyOutcome: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
  metricContext: string;
  avatarSeed: string;
}

export interface EstimatorOptions {
  projectType: 'mvp' | 'saas' | 'redesign' | 'ai';
  timeline: 'fast' | 'standard' | 'extended';
  platforms: string[]; // e.g. ['web', 'mobile', 'design-system', 'ai-agent', 'backend']
  fidelity: 'clean' | 'bespoke' | 'award';
}

export interface EstimatorQuote {
  minBudget: number;
  maxBudget: number;
  minWeeks: number;
  maxWeeks: number;
  recommendedTeam: string[];
  highlights: string[];
}

export interface LeadFormData {
  fullName: string;
  email: string;
  company: string;
  serviceCategory: string;
  budgetRange: string;
  timeline: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof LeadFormData, string>>;
}
