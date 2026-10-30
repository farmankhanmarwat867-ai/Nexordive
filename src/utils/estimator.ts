import { EstimatorOptions, EstimatorQuote, LeadFormData, FormValidationResult } from '../types/agency';

/**
 * Calculates deterministic budget ranges and delivery timelines for agency inquiries.
 */
export function calculateProjectEstimate(options: EstimatorOptions): EstimatorQuote {
  // Base cost per project type
  const baseRates: Record<EstimatorOptions['projectType'], { min: number; max: number; minWeeks: number; maxWeeks: number }> = {
    mvp: { min: 28000, max: 45000, minWeeks: 6, maxWeeks: 10 },
    saas: { min: 55000, max: 95000, minWeeks: 10, maxWeeks: 16 },
    redesign: { min: 38000, max: 68000, minWeeks: 8, maxWeeks: 12 },
    ai: { min: 48000, max: 88000, minWeeks: 8, maxWeeks: 14 },
  };

  const base = baseRates[options.projectType] || baseRates.mvp;
  let minCost = base.min;
  let maxCost = base.max;
  let minWeeks = base.minWeeks;
  let maxWeeks = base.maxWeeks;

  // Platform multipliers
  const platformCostMap: Record<string, number> = {
    web: 0, // included by default
    mobile: 18000,
    backend: 15000,
    'ai-agent': 22000,
    'design-system': 12000,
  };

  options.platforms.forEach((p) => {
    if (p !== 'web' && platformCostMap[p]) {
      minCost += platformCostMap[p];
      maxCost += platformCostMap[p] * 1.25;
      minWeeks += 1;
      maxWeeks += 2;
    }
  });

  // Fidelity multiplier
  if (options.fidelity === 'bespoke') {
    minCost *= 1.2;
    maxCost *= 1.25;
    minWeeks += 1;
    maxWeeks += 2;
  } else if (options.fidelity === 'award') {
    minCost *= 1.45;
    maxCost *= 1.55;
    minWeeks += 2;
    maxWeeks += 3;
  }

  // Timeline adjustment
  if (options.timeline === 'fast') {
    // Sprint surcharge (+25%) but compresses calendar weeks
    minCost *= 1.25;
    maxCost *= 1.25;
    minWeeks = Math.max(4, Math.round(minWeeks * 0.75));
    maxWeeks = Math.max(6, Math.round(maxWeeks * 0.8));
  } else if (options.timeline === 'extended') {
    // Relaxed pacing
    minWeeks = Math.round(minWeeks * 1.2);
    maxWeeks = Math.round(maxWeeks * 1.25);
  }

  // Team assembly recommendation
  const recommendedTeam: string[] = ['Principal Designer', 'Staff Frontend Architect'];
  if (options.platforms.includes('backend') || options.projectType === 'saas') {
    recommendedTeam.push('Systems & Cloud Engineer');
  }
  if (options.platforms.includes('mobile')) {
    recommendedTeam.push('Mobile React Native / iOS Specialist');
  }
  if (options.platforms.includes('ai-agent') || options.projectType === 'ai') {
    recommendedTeam.push('Applied AI & LLM Systems Engineer');
  }
  if (options.fidelity === 'award') {
    recommendedTeam.push('Motion & 3D Interactive Specialist');
  }
  recommendedTeam.push('Dedicated Technical Delivery Lead');

  const highlights: string[] = [
    `Guaranteed production release within ${minWeeks} to ${maxWeeks} calendar weeks`,
    'Complete IP assignment, zero vendor lock-in & full documentation',
    'Bi-weekly deployable review builds and private staging environment',
    'Sub-100ms Core Web Vitals performance guarantee',
  ];

  return {
    minBudget: Math.round(minCost / 500) * 500,
    maxBudget: Math.round(maxCost / 500) * 500,
    minWeeks,
    maxWeeks,
    recommendedTeam,
    highlights,
  };
}

/**
 * Validates lead generation / discovery call form data.
 */
export function validateLeadForm(data: LeadFormData): FormValidationResult {
  const errors: Partial<Record<keyof LeadFormData, string>> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid work email address.';
  }

  if (!data.company || data.company.trim().length < 2) {
    errors.company = 'Please enter your company or project name.';
  }

  if (!data.budgetRange) {
    errors.budgetRange = 'Please select an estimated budget tier.';
  }

  if (!data.message || data.message.trim().length < 15) {
    errors.message = 'Please share a brief summary of what you are building (min 15 chars).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
