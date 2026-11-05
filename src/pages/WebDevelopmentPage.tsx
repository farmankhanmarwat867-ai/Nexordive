'use client';
import { RelatedServices } from '../components/common/RelatedServices';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Layout,
  Smartphone,
  Sliders,
  FileCode,
  Layers,
  Search,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  Sparkles,
  Code2,
  Compass,
  Laptop,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { useAdmin } from '../context/AdminStore';

interface WebDevelopmentPageProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigatePricing?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
  onNavigate?: (page: string) => void;
}

interface WebCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
  techStack: string[];
}

const WEB_CAPABILITIES: WebCapability[] = [
  {
    id: 'business-websites',
    title: 'Business Websites & Service Landing Pages',
    tagline: 'High-clarity layout architecture and rapid page load speeds',
    description:
      'We design and build modern business websites and dedicated service landing pages engineered for readability, audience trust, and measurable conversion.',
    icon: <Globe className="w-6 h-6 text-cyan-300" />,
    specs: [
      'Clear information architecture and visual hierarchy',
      'High-converting landing page layouts with direct CTAs',
      'Sub-second page loading and Core Web Vitals optimization',
      'Modular page components for future content expansion',
    ],
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
  },
  {
    id: 'responsive-layouts',
    title: 'Responsive Layouts for Mobile, Tablet & Desktop',
    tagline: 'Mobile-first design tested across all major viewports',
    description:
      'Every web page is planned mobile-first, ensuring smooth navigation, accessible touch targets, and consistent visual balance from smartphones to ultra-wide desktop monitors.',
    icon: <Smartphone className="w-6 h-6 text-teal-300" />,
    specs: [
      'Fluid typography scales and responsive grid systems',
      'Adaptive image sizing and lazy loading',
      'Cross-browser compatibility across Chrome, Safari, Firefox, and Edge',
      'Touch-friendly mobile navigation and micro-interactions',
    ],
    techStack: ['Mobile-First CSS', 'Responsive Grid', 'Flexbox', 'Modern Web APIs'],
  },
  {
    id: 'custom-dashboards',
    title: 'Custom Dashboards & Connected Web Interfaces',
    tagline: 'Structured client portals and internal web tools (where in scope)',
    description:
      'Where your project requires authenticated workflows or client self-service, we engineer structured admin dashboards and connected web interfaces for clear data presentation.',
    icon: <Layout className="w-6 h-6 text-sky-300" />,
    specs: [
      'Role-based dashboard views and protected routes',
      'Clean tabular and card-based data visualizations',
      'Secure authentication and session management',
      'Reusable component architecture for operational scale',
    ],
    techStack: ['React 19', 'Next.js App Router', 'REST & GraphQL APIs', 'Tailwind'],
  },
  {
    id: 'inquiry-integrations',
    title: 'Contact Forms, Inquiry Flows & Practical Integrations',
    tagline: 'Frictionless lead capture and third-party workflow connections',
    description:
      'We turn passive visitors into prospective inquiries through thoughtfully designed contact forms, WhatsApp click-to-chat triggers, and automated lead capture workflows.',
    icon: <Sliders className="w-6 h-6 text-emerald-300" />,
    specs: [
      'Client-side and server-side form validation',
      'Direct WhatsApp chat integration with pre-filled scope prompts',
      'Automated email notifications and CRM lead synchronization',
      'Webhook connectivity with automation pipelines',
    ],
    techStack: ['Webhooks', 'WhatsApp API', 'Form Validation', 'Email Services'],
  },
  {
    id: 'seo-foundations',
    title: 'On-Page SEO Foundations & Accessible Content Structure',
    tagline: 'Semantic markup, accessible HTML5, and search discoverability',
    description:
      'We build strong technical SEO foundations directly into your site structure, pairing semantic HTML and Open Graph previews with WCAG 2.2 AA accessibility standards.',
    icon: <FileCode className="w-6 h-6 text-amber-300" />,
    specs: [
      'Semantic HTML5 structure (clean single H1 hierarchy)',
      'Schema.org structured data (Organization, WebSite, Service)',
      'Open Graph and Twitter Card social preview metadata',
      'WCAG 2.2 AA color contrast and screen-reader accessibility',
    ],
    techStack: ['JSON-LD', 'Semantic HTML5', 'Open Graph', 'WCAG 2.2 AA'],
  },
];

const APPROACH_STEPS = [
  {
    number: '01',
    title: 'Discovery & Page Planning',
    description:
      'We learn about your business, target audience, core services, and project goals to define a clear sitemap and practical scope.',
  },
  {
    number: '02',
    title: 'UI & Interaction Design',
    description:
      'We develop the page structure, typographic hierarchy, responsive layout, and visual direction for your review and feedback.',
  },
  {
    number: '03',
    title: 'Clean Web Engineering',
    description:
      'We implement the approved design with clean, maintainable code, modern component architecture, and responsive styling.',
  },
  {
    number: '04',
    title: 'Functional Testing',
    description:
      'We verify core functionality, check responsive layouts on phone, tablet, and desktop, and test inquiry forms before launch.',
  },
  {
    number: '05',
    title: 'Launch Preparation & Handover',
    description:
      'We configure custom domains, verify on-page SEO foundations, run final launch checks, and provide repository handover.',
  },
];

const SERVICE_FAQS = [
  {
    id: 'faq-new-business',
    question: 'Can you build a website for a new business?',
    answer:
      'Yes. Share the purpose of the website, pages required and key features to define a suitable approach. We work with founders and startups to launch practical, professional web experiences from day one.',
  },
  {
    id: 'faq-mobile-friendly',
    question: 'Will the website work on mobile?',
    answer:
      'Responsive design can be included as a core requirement and tested across suitable screen sizes. We verify responsive layouts across mobile phones, tablets, laptops, and desktop viewports.',
  },
];

export const WebDevelopmentPage: React.FC<WebDevelopmentPageProps> = ({
  onNavigateHome,
  onNavigateServices,
  onNavigatePricing,
  onOpenContactWithSummary,
  onNavigate,
}) => {
  const { content } = useAdmin();
  const pageHeader = content?.pageHeaders?.webDevelopment;
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(SERVICE_FAQS[0].id);

  const filteredCapabilities = WEB_CAPABILITIES.filter((cap) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cap.title.toLowerCase().includes(q) ||
      cap.tagline.toLowerCase().includes(q) ||
      cap.description.toLowerCase().includes(q) ||
      cap.specs.some((s) => s.toLowerCase().includes(q)) ||
      cap.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 bg-white">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge={pageHeader?.badge || 'Web Development Services'}
        title={pageHeader?.title || 'Web Development Services Built Around Your Business'}
        description={
          pageHeader?.description ||
          'Your website should make it easy for visitors to understand what you offer, find information and take the next step. Nexordive creates responsive web experiences with thoughtful structure, readable content and clear calls to action.'
        }
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services', onClick: onNavigateServices },
          { label: 'Web Development' },
        ]}
        actions={[
          {
            label: 'Discuss Your Website Project',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Web Development Services & Business Website Build'),
          },
          ...(onNavigatePricing
            ? [
                {
                  label: 'Explore Pricing',
                  variant: 'secondary' as const,
                  onClick: onNavigatePricing,
                },
              ]
            : []),
        ]}
        searchSlot={
          <div className="relative w-full">
            <Search className="w-4 h-4 text-cyan-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search web capabilities (e.g. landing pages, responsive, forms, SEO)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-cyan-100/60 text-xs sm:text-sm border border-cyan-400/30 focus:outline-hidden focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-cyan-200 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        }
      />

      {/* 2. What We Can Help With Section */}
      <section className="py-20 lg:py-28 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-4">
              <Layers className="w-3.5 h-3.5 text-[#0d5363]" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight">
              What We Can Help With
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              From business websites and conversion landing pages to accessible responsive layouts and integrated inquiry flows.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCapabilities.map((cap, idx) => (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#0d5363]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#004d6a] flex items-center justify-center mb-6 shadow-md shadow-[#004d6a]/20 group-hover:scale-105 transition-transform">
                    {cap.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#004d6a] transition-colors mb-2">
                    {cap.title}
                  </h3>
                  <div className="text-xs font-mono font-semibold text-[#0d5363] mb-3">
                    {cap.tagline}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {cap.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      What is included
                    </span>
                    {cap.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100">
                    {cap.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenContactWithSummary(`Inquiring about Web Development: ${cap.title}`)
                    }
                    className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#004d6a] hover:text-white text-[#0d5363] text-xs font-bold tracking-wide transition-all cursor-pointer group/btn border border-slate-200"
                  >
                    <span>Inquire About This Service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCapabilities.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-slate-600 text-sm mb-4">
                No capabilities matched your search term "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-6 py-2.5 rounded-full bg-[#004d6a] text-white text-xs font-bold tracking-wide"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. How Nexordive Approaches the Project */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-4">
              <Compass className="w-3.5 h-3.5 text-[#0d5363]" />
              <span>Our Methodology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance">
              How Nexordive Approaches the Project
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              We begin with discovery and page planning, then move through UI design, development, functional testing and launch preparation. The final scope depends on your content, integrations and technical requirements.
            </p>
          </div>

          {/* Sequential Approach Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {APPROACH_STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-[#0d5363]/40 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0d5363] mb-3">
                  {step.number}
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Selected Web Projects & Demonstrations */}
      <ProjectShowcase
        limit={3}
        onInquireProject={(project) =>
          onOpenContactWithSummary(`Inquiring about Web Project Reference: ${project}`)
        }
      />

      {/* 5. Service FAQ Section */}
      <section className="py-20 lg:py-28 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0d5363] shadow-xs mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#0d5363]" />
              <span>Service FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-950 tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Clear answers regarding new business websites, responsive mobile performance, and project scoping.
            </p>
          </div>

          <div className="space-y-3.5">
            {SERVICE_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#0d5363]/40 shadow-md shadow-[#004d6a]/5'
                      : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004d6a]"
                  >
                    <span className="text-base sm:text-lg font-serif font-bold text-slate-900 pr-2">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isOpen ? 'bg-[#004d6a] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

            {/* Complementary & Related Services Cross-Links */}
      <RelatedServices currentSlug="web-development" onNavigate={onNavigate} />

      {/* 6. Conversion CTA Block */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-[#004d6a] via-[#093c47] to-[#06242c] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Web Development Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance">
            Discuss Your Website Project
          </h2>

          <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto font-normal leading-relaxed">
            Your website should make it easy for visitors to understand what you offer, find information and take the next step. Let's discuss your requirements and build a tailored solution.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                onOpenContactWithSummary(
                  'Inquiry: Web Development Services & Project Consultation'
                )
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <span>Discuss Your Website Project</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/923146009810?text=Hello%20Nexordive%2C%20I%20would%20like%20to%20discuss%20a%20web%20development%20project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm tracking-wide border border-white/20 hover:border-white/40 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Contact via WhatsApp (+92 314 600 9810)</span>
            </a>
          </div>

          <div className="pt-2">
            <a
              href="mailto:hello@nexordive.com"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-200/90 hover:text-white transition-colors underline underline-offset-4"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-300" />
              <span>hello@nexordive.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
