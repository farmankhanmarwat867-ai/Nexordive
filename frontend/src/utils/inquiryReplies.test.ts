import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeWhatsAppNumber,
  generateWhatsAppUrl,
  validateEmail,
  generateMailtoUrl,
  generateDefaultReplies,
  InquiryDraft,
} from './inquiryReplies.js';
import { Lead } from '../context/AdminStore.js';

test('normalizeWhatsAppNumber correctly normalizes international numbers', () => {
  const res1 = normalizeWhatsAppNumber('+1 415 890 2311');
  assert.equal(res1.valid, true);
  assert.equal(res1.normalized, '14158902311');

  const res2 = normalizeWhatsAppNumber('+92 300 1234567');
  assert.equal(res2.valid, true);
  assert.equal(res2.normalized, '923001234567');

  const res3 = normalizeWhatsAppNumber('00447700900123');
  assert.equal(res3.valid, true);
  assert.equal(res3.normalized, '447700900123');
});

test('normalizeWhatsAppNumber identifies ambiguous local numbers requiring country code', () => {
  const resLocal = normalizeWhatsAppNumber('03001234567');
  assert.equal(resLocal.valid, false);
  assert.equal(resLocal.requiresCountryCode, true);

  // When user provides country code:
  const resWithCc = normalizeWhatsAppNumber('03001234567', '+92');
  assert.equal(resWithCc.valid, true);
  assert.equal(resWithCc.normalized, '923001234567');
});

test('normalizeWhatsAppNumber rejects empty or invalid strings', () => {
  assert.equal(normalizeWhatsAppNumber('').valid, false);
  assert.equal(normalizeWhatsAppNumber('   ').valid, false);
  assert.equal(normalizeWhatsAppNumber('abc').valid, false);
  assert.equal(normalizeWhatsAppNumber('123').valid, false);
});

test('generateWhatsAppUrl builds valid wa.me URLs with proper URI encoding', () => {
  const url = generateWhatsAppUrl('14158902311', 'Hello Sarah, how are you? & Welcome!');
  assert.equal(url.startsWith('https://wa.me/14158902311?text='), true);
  assert.equal(url.includes('Hello%20Sarah%2C%20how%20are%20you%3F%20%26%20Welcome!'), true);
});

test('validateEmail handles valid, invalid and missing emails', () => {
  assert.equal(validateEmail('sarah.j@auraprime.io').valid, true);
  assert.equal(validateEmail('invalid-email').valid, false);
  assert.equal(validateEmail('').valid, false);
});

test('generateMailtoUrl sanitizes subject newlines and encodes mailto URL', () => {
  const mailto = generateMailtoUrl(
    'sarah.j@auraprime.io',
    'Re: Web Development\ninquiry\r\n— NexorDive',
    'Hi Sarah,\n\nWe received your inquiry.'
  );
  assert.equal(mailto.startsWith('mailto:sarah.j%40auraprime.io?subject='), true);
  // Ensure subject contains single line without raw newlines
  assert.equal(mailto.includes('Re%3A%20Web%20Development%20inquiry%20%E2%80%94%20NexorDive'), true);
  assert.equal(mailto.includes('body=Hi%20Sarah%2C%0A%0AWe%20received%20your%20inquiry.'), true);
});

test('generateDefaultReplies produces deterministic contextual replies', () => {
  const sarahLead: Lead = {
    id: 'NXD-891024',
    name: 'Sarah Jenkins',
    whatsapp: '+1 415 890 2311',
    email: 'sarah.j@auraprime.io',
    service: 'Web Development',
    budget: '$300 – $699',
    date: '2026-10-27',
    status: 'New',
    notes: 'Interested in Next.js 15+ marketing site and custom Figma tokens.',
  };

  const replies = generateDefaultReplies(sarahLead, 'NexorDive');
  assert.equal(replies.whatsappText.includes('Hi Sarah,'), true);
  assert.equal(replies.whatsappText.includes('NexorDive about Web Development'), true);
  assert.equal(replies.whatsappText.includes('your marketing website'), true);
  assert.equal(replies.whatsappText.includes('timeline'), true); // timeline not provided in notes, so asked

  assert.equal(replies.emailSubject, 'Re: Web Development inquiry — NexorDive');
  assert.equal(replies.emailBody.includes('Hi Sarah,'), true);
  assert.equal(replies.emailBody.includes('Best regards,\nNexorDive Team'), true);
});

test('generateDefaultReplies avoids asking for timeline when client already specified timeline', () => {
  const urgentLead: Lead = {
    id: 'NXD-999999',
    name: 'Alex Rivera',
    whatsapp: '+1 212 555 0199',
    email: 'alex@startup.co',
    service: 'Web Platform',
    budget: '$5,000+',
    date: '2026-10-28',
    status: 'New',
    notes: 'Need this ready by launch deadline next week.',
  };

  const replies = generateDefaultReplies(urgentLead, 'NexorDive');
  // Should NOT ask "share your preferred timeline"
  assert.equal(replies.whatsappText.includes('share your preferred timeline'), false);
  assert.equal(replies.whatsappText.includes('reference examples or project requirements'), true);
});

test('draft isolation ensures switching inquiries retains independent recipient and content', () => {
  const lead1: Lead = {
    id: 'NXD-1',
    name: 'Sarah Jenkins',
    whatsapp: '+1 415 890 2311',
    email: 'sarah@example.com',
    service: 'Web Development',
    budget: '$500',
    date: '2026-10-27',
    status: 'New',
    notes: 'Marketing site',
  };

  const lead2: Lead = {
    id: 'NXD-2',
    name: 'Hamza Malik',
    whatsapp: '+92 300 1234567',
    email: 'hamza@example.com',
    service: 'Streamer Assets',
    budget: '$100',
    date: '2026-10-26',
    status: 'In Progress',
    notes: 'Twitch overlay',
  };

  // State dictionary pattern used in LeadsView
  const customDrafts: Record<string, InquiryDraft> = {};

  // Default drafts generated independently
  const draft1 = generateDefaultReplies(lead1, 'NexorDive');
  const draft2 = generateDefaultReplies(lead2, 'NexorDive');

  // Verify recipients and contents differ
  assert.equal(draft1.whatsappText.includes('Sarah'), true);
  assert.equal(draft1.whatsappText.includes('Web Development'), true);
  assert.equal(draft2.whatsappText.includes('Hamza'), true);
  assert.equal(draft2.whatsappText.includes('Streamer Assets'), true);

  // Customize lead 1 draft
  customDrafts[lead1.id] = {
    ...draft1,
    whatsappText: 'Customized message for Sarah only.',
  };

  // Verify switching to lead 2 uses lead 2's unpolluted draft
  const activeLead2Draft = customDrafts[lead2.id] || draft2;
  assert.equal(activeLead2Draft.whatsappText.includes('Hamza'), true);
  assert.equal(activeLead2Draft.whatsappText.includes('Customized message for Sarah'), false);

  // Verify switching back to lead 1 retains custom draft
  const activeLead1Draft = customDrafts[lead1.id] || draft1;
  assert.equal(activeLead1Draft.whatsappText, 'Customized message for Sarah only.');
});

test('generating or opening reply link does not alter lead status', () => {
  const originalLead: Lead = {
    id: 'NXD-100',
    name: 'Sarah Jenkins',
    whatsapp: '+1 415 890 2311',
    email: 'sarah@example.com',
    service: 'Web Development',
    budget: '$500',
    date: '2026-10-27',
    status: 'New',
    notes: 'Marketing site',
  };

  // Generate reply URLs
  const replies = generateDefaultReplies(originalLead, 'NexorDive');
  const waUrl = generateWhatsAppUrl('14158902311', replies.whatsappText);
  const mailtoUrl = generateMailtoUrl(originalLead.email, replies.emailSubject, replies.emailBody);

  // Assert URLs generated without mutating the lead record
  assert.ok(waUrl.length > 0);
  assert.ok(mailtoUrl.length > 0);
  assert.equal(originalLead.status, 'New'); // Status remains untouched
});
