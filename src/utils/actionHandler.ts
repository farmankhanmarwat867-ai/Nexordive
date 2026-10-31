/**
 * NexorDive Action Handler
 * Unified routing & trigger handler for all interactive buttons across the site.
 */

export interface ActionContext {
  onNavigate?: (page: string) => void;
  onStartProject?: () => void;
  onOpenContact?: () => void;
  onOpenContactWithSummary?: (summary: string) => void;
}

export interface ActionOption {
  value: string;
  label: string;
}

export const COMMON_ACTION_OPTIONS: ActionOption[] = [
  { value: 'start-project', label: 'Start a Project (Scroll to Contact Form)' },
  { value: 'contact', label: 'Contact Page / Inquiry' },
  { value: 'services', label: 'Services Page' },
  { value: 'streamer-assets', label: 'Streamer Assets Page' },
  { value: 'pricing', label: 'Pricing Page' },
  { value: 'portfolio', label: 'Portfolio Page' },
  { value: 'home', label: 'Home Page' },
  { value: '#about', label: 'Scroll to About Section' },
  { value: '#services', label: 'Scroll to Services Section' },
  { value: '#pricing', label: 'Scroll to Pricing Section' },
  { value: '#streamer-assets', label: 'Scroll to Streamer Assets' },
  { value: '#process', label: 'Scroll to Process Section' },
  { value: '#testimonials', label: 'Scroll to Testimonials' },
  { value: '#blog', label: 'Scroll to Blog' },
];

export function executeAction(action: string | undefined | null, context?: ActionContext): void {
  if (!action) return;
  const target = action.trim();
  if (!target) return;

  // 1. External URLs
  if (target.startsWith('http://') || target.startsWith('https://')) {
    window.open(target, '_blank', 'noopener,noreferrer');
    return;
  }

  // 2. Mailto or Tel
  if (target.startsWith('mailto:') || target.startsWith('tel:')) {
    window.location.href = target;
    return;
  }

  // 3. WhatsApp link
  if (target.startsWith('wa.me') || target.startsWith('whatsapp:')) {
    const waUrl = target.startsWith('http') ? target : `https://${target.replace(/^whatsapp:\/?\/?/, '')}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // 4. Start Project action
  if (target === 'start-project' || target === 'startProject') {
    if (context?.onStartProject) {
      context.onStartProject();
    } else if (context?.onNavigate) {
      context.onNavigate('contact');
    } else {
      const formEl = document.getElementById('contact-form') || document.querySelector('form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contact';
      }
    }
    return;
  }

  // 5. Contact modal action
  if (target === 'contact-modal' || target === 'modal') {
    if (context?.onOpenContact) {
      context.onOpenContact();
    } else if (context?.onStartProject) {
      context.onStartProject();
    } else if (context?.onNavigate) {
      context.onNavigate('contact');
    } else {
      window.location.hash = '#contact';
    }
    return;
  }

  // 6. In-page anchor hash (e.g. #about, #services)
  if (target.startsWith('#')) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (context?.onNavigate) {
        context.onNavigate('home');
        setTimeout(() => {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.location.hash = target;
        }, 150);
      } else {
        window.location.hash = target;
      }
    }
    return;
  }

  // 7. Page destination navigation
  const knownPages = ['home', 'services', 'streamer-assets', 'pricing', 'portfolio', 'contact'];
  if (knownPages.includes(target)) {
    if (context?.onNavigate) {
      context.onNavigate(target);
    } else {
      window.location.hash = target === 'home' ? '' : `#${target}`;
    }
    return;
  }

  // 8. Element by ID fallback
  const elementById = document.getElementById(target);
  if (elementById) {
    elementById.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // 9. Generic fallback
  if (context?.onNavigate) {
    context.onNavigate(target);
  } else {
    window.location.hash = `#${target}`;
  }
}
