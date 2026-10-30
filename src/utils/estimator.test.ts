import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProjectEstimate, validateLeadForm } from './estimator';

test('calculateProjectEstimate computes baseline budget and timeline for MVP', () => {
  const quote = calculateProjectEstimate({
    projectType: 'mvp',
    timeline: 'standard',
    platforms: ['web'],
    fidelity: 'clean',
  });

  assert.equal(quote.minBudget, 28000);
  assert.equal(quote.maxBudget, 45000);
  assert.equal(quote.minWeeks, 6);
  assert.equal(quote.maxWeeks, 10);
  assert.ok(quote.recommendedTeam.includes('Principal Designer'));
  assert.ok(quote.recommendedTeam.includes('Staff Frontend Architect'));
});

test('calculateProjectEstimate scales properly with multi-platform and award fidelity', () => {
  const quote = calculateProjectEstimate({
    projectType: 'saas',
    timeline: 'fast',
    platforms: ['web', 'backend', 'ai-agent'],
    fidelity: 'award',
  });

  // Fast timeline sprint surcharge + multiplatform + award fidelity
  assert.ok(quote.minBudget > 100000, `Expected minBudget > 100000, got ${quote.minBudget}`);
  assert.ok(quote.maxBudget > quote.minBudget);
  assert.ok(quote.recommendedTeam.includes('Applied AI & LLM Systems Engineer'));
  assert.ok(quote.recommendedTeam.includes('Motion & 3D Interactive Specialist'));
});

test('validateLeadForm rejects invalid submissions and passes valid submissions', () => {
  const invalidResult = validateLeadForm({
    fullName: '',
    email: 'not-an-email',
    company: '',
    serviceCategory: 'Web Engineering',
    budgetRange: '',
    timeline: 'Immediate',
    message: 'Short',
  });

  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.fullName);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.company);
  assert.ok(invalidResult.errors.budgetRange);
  assert.ok(invalidResult.errors.message);

  const validResult = validateLeadForm({
    fullName: 'Sophia Laurent',
    email: 'sophia@acmetech.io',
    company: 'Acme Technologies Inc.',
    serviceCategory: 'Full Product Design & Engineering',
    budgetRange: '$50,000 - $100,000',
    timeline: 'Within 4-8 weeks',
    message: 'We are redesigning our enterprise analytics dashboard and need a world-class team to execute both UI/UX and Next.js frontend.',
  });

  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});
