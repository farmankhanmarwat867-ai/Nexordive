/**
 * Analytics and Conversion Tracking Utility
 * Dispatches GA4/GTM standard events and custom DOM conversion events
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface ConversionEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  service?: string;
  budget?: string;
  timeline?: string;
  channel?: 'whatsapp' | 'email' | 'form';
  [key: string]: any;
}

/**
 * Universal conversion event dispatcher
 */
export function trackConversion(eventName: string, params: ConversionEventParams = {}) {
  try {
    if (typeof window === 'undefined') return;

    // 1. Google Analytics 4 gtag helper
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // 2. Google Tag Manager dataLayer push
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Native DOM CustomEvent for custom integrations
    const customEvent = new CustomEvent('nexordive:conversion', {
      detail: {
        eventName,
        ...params,
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(customEvent);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Nexordive Analytics] Event: ${eventName}`, params);
    }
  } catch (err) {
    // Fail silently so tracking never disrupts UX
    console.warn('[Nexordive Analytics] Error tracking event:', err);
  }
}

/**
 * Triggered on successful brief inquiry form submission
 */
export function trackLeadSubmission(details: {
  service: string;
  budget?: string;
  preferredTimeline?: string;
}) {
  trackConversion('generate_lead', {
    event_category: 'Inquiry',
    event_label: details.service,
    service: details.service,
    budget: details.budget,
    timeline: details.preferredTimeline,
    channel: 'form',
  });
}

/**
 * Triggered when a visitor clicks WhatsApp or Direct Email links
 */
export function trackContactClick(channel: 'whatsapp' | 'email', contactDetail?: string) {
  trackConversion('contact_initiation', {
    event_category: 'Contact Channel',
    event_label: channel,
    channel,
    contact_target: contactDetail,
  });
}

/**
 * Triggered when a visitor clicks a primary Call-to-Action button
 */
export function trackCtaClick(buttonLabel: string, destination?: string) {
  trackConversion('cta_click', {
    event_category: 'Call to Action',
    event_label: buttonLabel,
    destination,
  });
}
