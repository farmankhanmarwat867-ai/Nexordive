import { Lead } from '../context/AdminStore';

export interface WhatsAppValidationResult {
  valid: boolean;
  normalized?: string; // digits only without leading '+' for wa.me URL
  formatted?: string;  // user-friendly display
  requiresCountryCode?: boolean;
  rawDigits?: string;
  error?: string;
}

export interface EmailValidationResult {
  valid: boolean;
  sanitizedEmail?: string;
  error?: string;
}

export interface InquiryDraft {
  whatsappText: string;
  emailSubject: string;
  emailBody: string;
}

/**
 * Normalizes phone numbers for WhatsApp wa.me links.
 * wa.me requires international format without plus or symbols (e.g. 14158902311).
 * Ambiguous local numbers without country codes flag requiresCountryCode.
 */
export function normalizeWhatsAppNumber(
  rawNumber: string,
  userCountryCode?: string
): WhatsAppValidationResult {
  if (!rawNumber || typeof rawNumber !== 'string') {
    return { valid: false, error: 'No phone number provided' };
  }

  const trimmed = rawNumber.trim();
  if (!trimmed) {
    return { valid: false, error: 'No phone number provided' };
  }

  // Extract all numeric digits
  const rawDigits = trimmed.replace(/\D/g, '');
  if (!rawDigits || rawDigits.length < 7) {
    return { valid: false, rawDigits, error: 'Phone number has too few digits' };
  }

  // Case 1: Starts with '+' (explicit international format, e.g. +1 415 890 2311)
  if (trimmed.startsWith('+')) {
    if (rawDigits.length >= 8 && rawDigits.length <= 15) {
      return {
        valid: true,
        normalized: rawDigits,
        formatted: `+${rawDigits}`,
        rawDigits,
      };
    }
    return { valid: false, rawDigits, error: 'International number has invalid digit count' };
  }

  // Case 2: Starts with '00' (international prefix, e.g. 00923001234567)
  if (rawDigits.startsWith('00') && rawDigits.length >= 10) {
    const without00 = rawDigits.slice(2);
    if (without00.length >= 8 && without00.length <= 15) {
      return {
        valid: true,
        normalized: without00,
        formatted: `+${without00}`,
        rawDigits,
      };
    }
  }

  // Case 3: Local number with leading zero (e.g. 03001234567, 07700900123)
  if (rawDigits.startsWith('0')) {
    const localDigits = rawDigits.replace(/^0+/, '');
    if (userCountryCode) {
      const ccDigits = userCountryCode.replace(/\D/g, '');
      if (ccDigits) {
        const full = `${ccDigits}${localDigits}`;
        return {
          valid: true,
          normalized: full,
          formatted: `+${full}`,
          rawDigits,
        };
      }
    }
    return {
      valid: false,
      requiresCountryCode: true,
      rawDigits,
      error: 'Local number requires a country code (e.g. +92 or +1)',
    };
  }

  // Case 4: Digits without leading 0 or +:
  // If user provided a country code override, apply it
  if (userCountryCode) {
    const ccDigits = userCountryCode.replace(/\D/g, '');
    if (ccDigits) {
      const full = `${ccDigits}${rawDigits}`;
      return {
        valid: true,
        normalized: full,
        formatted: `+${full}`,
        rawDigits,
      };
    }
  }

  // If already standard length 11-15 digits without leading zero, treat as international digits
  if (rawDigits.length >= 11 && rawDigits.length <= 15) {
    return {
      valid: true,
      normalized: rawDigits,
      formatted: `+${rawDigits}`,
      rawDigits,
    };
  }

  // Otherwise ambiguous 7-10 digit local number
  return {
    valid: false,
    requiresCountryCode: true,
    rawDigits,
    error: 'Country code needed for local number (e.g. +1 or +44)',
  };
}

/**
 * Builds standard WhatsApp direct chat link with prefilled message.
 */
export function generateWhatsAppUrl(normalizedDigits: string, text: string): string {
  return `https://wa.me/${encodeURIComponent(normalizedDigits)}?text=${encodeURIComponent(text)}`;
}

/**
 * Validates email address format.
 */
export function validateEmail(email: string): EmailValidationResult {
  const clean = email?.trim() || '';
  if (!clean) {
    return { valid: false, error: 'No email address provided' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: 'Invalid email address format' };
  }
  return { valid: true, sanitizedEmail: clean };
}

/**
 * Builds mailto: URL with sanitized subject and encoded body.
 */
export function generateMailtoUrl(email: string, subject: string, body: string): string {
  // Sanitize line breaks in subject to prevent header injection issues
  const sanitizedSubject = subject.replace(/[\r\n]+/g, ' ').trim();
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(sanitizedSubject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generates deterministic contextual replies for an inquiry based on actual saved fields.
 */
export function generateDefaultReplies(lead: Lead, agencyName?: string): InquiryDraft {
  const businessName = agencyName?.trim() || 'NexorDive';
  const fullName = lead.name?.trim() || 'there';
  const firstName = fullName.split(' ')[0] || fullName;
  const service = lead.service?.trim() || 'your project';
  const notes = lead.notes?.trim() || '';

  // Check if timeline or deadline was already specified by the client
  const timelineRegex = /\b(timeline|deadline|asap|urgent|urgently|weeks?|months?|days?|launch by|ready by|finish by|sprint|kickoff)\b/i;
  const hasTimeline = timelineRegex.test(notes);

  // Check if a specific project focus is reliably mentioned in notes
  let projectFocus = '';
  if (/marketing\s+website|marketing\s+site/i.test(notes)) {
    projectFocus = 'your marketing website';
  } else if (/ecommerce|shop|store/i.test(notes)) {
    projectFocus = 'your e-commerce platform';
  } else if (/mvp|saas|app/i.test(notes)) {
    projectFocus = 'your application build';
  } else if (/streamer|twitch|kick|vtuber|overlay/i.test(notes)) {
    projectFocus = 'your stream branding & assets';
  } else if (/automation|workflow|ai|agent/i.test(notes)) {
    projectFocus = 'your automation setup';
  } else if (/redesign|rebrand/i.test(notes)) {
    projectFocus = 'your platform redesign';
  } else {
    // Neutral fallback without fabricating unstated details
    projectFocus = `your ${service.toLowerCase()} project`;
  }

  // Construct context-appropriate follow-up question
  let followUpQuestion = '';
  if (hasTimeline) {
    followUpQuestion = 'Could you share any reference examples or project requirements so we can discuss the next steps?';
  } else {
    followUpQuestion = 'Could you share your preferred timeline and any reference websites so we can discuss the next steps?';
  }

  // WhatsApp template
  const whatsappText = `Hi ${firstName}, thank you for contacting ${businessName} about ${service}. We received your inquiry regarding ${projectFocus}. ${followUpQuestion}`;

  // Email subject and body template
  const emailSubject = `Re: ${service} inquiry — ${businessName}`;
  const emailBody = `Hi ${firstName},\n\nThank you for contacting ${businessName} about ${service}.\n\nWe received your inquiry regarding ${projectFocus}. ${followUpQuestion}\n\nBest regards,\n${businessName} Team`;

  return {
    whatsappText,
    emailSubject,
    emailBody,
  };
}
