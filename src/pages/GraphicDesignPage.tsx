'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Sparkles,
  Layers,
  FileText,
  Megaphone,
  Layout,
  Search,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  PenTool,
  Image as ImageIcon,
  Compass,
  Award,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { useAdmin } from '../context/AdminStore';

interface GraphicDesignPageProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigatePricing?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

interface DesignCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
  deliverables: string[];
}

const DESIGN_CAPABILITIES: DesignCapability[] = [
  {
    id: 'logo-brand-identity',
    title: 'Logo Concepts & Brand Identity Systems',
    tagline: 'Memorable visual marks crafted for recognition across modern channels',
    description:
      'We craft distinct logo concepts, responsive wordmarks, and complete visual identity frameworks that connect your brand personality with your target audience.',
    icon: <PenTool className="w-6 h-6 text-cyan-300" />,
    specs: [
      'Primary logo, secondary marks, and minimal favicon variants',
      'Scalable vector formats for web, digital, and print resolution',
      'Clear space rules, monochrome alternates, and dark/light modes',
      'Industry-aligned visual positioning with zero generic clip-art',
    ],
    deliverables: ['Vector SVG', 'Master AI / EPS', 'High-Res PNG', 'Icon Variants'],
  },
  {
    id: 'palette-typography-guidelines',
    title: 'Color Palettes, Typography & Visual Guidelines',
    tagline: 'Harmonious color systems and typographic hierarchy rules',
    description:
      'We define cohesive brand color schemes, accessible contrast ratios, complementary font pairings, and practical brand guidelines (where in scope).',
    icon: <Palette className="w-6 h-6 text-teal-300" />,
    specs: [
      'Accessible primary, secondary, and luminous accent color palettes',
      'Cross-platform typography pairing (headings, body, and monospace)',
      'Digital color values (HEX, RGB, HSL) and print codes (CMYK, Pantone)',
      'Brand guideline documentation for consistent internal execution',
    ],
    deliverables: ['Color Swatches', 'Font Hierarchy Spec', 'Brand PDF Guide', 'Design Tokens'],
  },
  {
    id: 'social-media-campaigns',
    title: 'Social Media Post & Campaign Creative Design',
    tagline: 'Platform-tailored graphics for consistent social brand presence',
    description:
      'Elevate your social media touchpoints with branded post templates, storytelling carousels, announcement cards, and campaign visuals that capture attention in busy feeds.',
    icon: <ImageIcon className="w-6 h-6 text-sky-300" />,
    specs: [
      'Multi-platform aspect ratios (1:1 square, 4:5 vertical, 9:16 stories)',
      'Editable Figma / Canva templates for agile internal team use',
      'Cohesive campaign aesthetic for launches and seasonal events',
      'High-contrast, legible typography optimized for mobile viewing',
    ],
    deliverables: ['Instagram Carousels', 'LinkedIn Post Cards', 'Story Templates', 'Cover Banners'],
  },
  {
    id: 'presentations-profiles',
    title: 'Presentation, Business Profile & Promotional Graphics',
    tagline: 'Professional pitch decks and digital business collateral',
    description:
      'We transform text-heavy documents into clean, investor-ready pitch decks, corporate company profiles, one-pagers, and promotional brochures that inspire stakeholder confidence.',
    icon: <FileText className="w-6 h-6 text-emerald-300" />,
    specs: [
      'Executive pitch decks and capability presentation templates',
      'Digital company profiles and interactive PDF portfolios',
      'Data visualization graphics, milestone timelines, and infographics',
      'Print-ready vector brochures and promotional one-pagers',
    ],
    deliverables: ['Keynote / PowerPoint', 'Interactive PDF', 'Vector One-Pagers', 'Print Master'],
  },
  {
    id: 'advertising-marketing-assets',
    title: 'Digital Advertising Banners & Marketing Assets',
    tagline: 'High-converting ad creatives built for performance campaigns',
    description:
      'We design high-impact advertising banners, Google Display ad packages, Meta paid social creatives, and website promotional banners focused on clarity and click-through.',
    icon: <Megaphone className="w-6 h-6 text-amber-300" />,
    specs: [
      'Standard IAB display advertising dimensions (e.g. 300x250, 728x90, 160x600)',
      'Performance ad creatives engineered for Meta, Google, and LinkedIn',
      'Clear value propositions and high-contrast call-to-action buttons',
      'Lightweight, optimized asset compression for rapid ad rendering',
    ],
    deliverables: ['Display Ad Suites', 'Meta Ad Creatives', 'Web Promo Banners', 'Retargeting Packs'],
  },
];

const APPROACH_STEPS = [
  {
    number: '01',
    title: 'Audience Review & Goals',
    description:
      'We review your target audience, industry landscape, design references, and core communication objectives to define visual alignment.',
  },
  {
    number: '02',
    title: 'Concept Development',
    description:
      'We explore creative directions, color harmonies, typographic pairings, and initial visual concepts tailored to your brand personality.',
  },
  {
    number: '03',
    title: 'Feedback & Refinement',
    description:
      'We collaborate closely with you to review draft mockups, collect targeted feedback, and refine the chosen design directions.',
  },
  {
    number: '04',
    title: 'Channel Preparation',
    description:
      'We prepare and format agreed final files for relevant digital, social, display, and print channels with correct color profiles and resolutions.',
  },
  {
    number: '05',
    title: 'Guidelines & Handover',
    description:
      'We package complete master asset files (SVG, PNG, PDF, AI) and deliver brand usage guidelines where a full identity system is in scope.',
  },
];

const SERVICE_FAQS = [
  {
    id: 'faq-social-only',
    question: 'Can you design only social media graphics?',
    answer:
      'Yes. Project inquiries can focus on a single design requirement—such as social media post templates, ad banners, or a pitch deck—or a broader end-to-end brand identity package.',
  },
  {
    id: 'faq-brand-guidelines',
    question: 'Do I receive brand guidelines?',
    answer:
      'Brand guidelines can be included in the agreed scope when a full identity system is needed. Guidelines cover logo spacing, color codes (HEX, RGB, CMYK), typography rules, and usage dos and don’ts.',
  },
];

export const GraphicDesignPage: React.FC<GraphicDesignPageProps> = ({
  onNavigateHome,
  onNavigateServices,
  onNavigatePricing,
  onOpenContactWithSummary,
}) => {
  const { content } = useAdmin();
  const pageHeader = content?.pageHeaders?.graphicDesign;
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(SERVICE_FAQS[0].id);

  const filteredCapabilities = DESIGN_CAPABILITIES.filter((cap) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cap.title.toLowerCase().includes(q) ||
      cap.tagline.toLowerCase().includes(q) ||
      cap.description.toLowerCase().includes(q) ||
      cap.specs.some((s) => s.toLowerCase().includes(q)) ||
      cap.deliverables.some((d) => d.toLowerCase().includes(q))
    );
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 bg-white">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge={pageHeader?.badge || 'Graphic Design & Branding'}
        title={pageHeader?.title || 'Graphic Design That Gives Your Brand a Clear Identity'}
        description={
          pageHeader?.description ||
          'Make your business recognizable across every digital touchpoint. Nexordive develops visual assets that connect your brand personality with practical communication needs, from identity systems to marketing graphics.'
        }
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services', onClick: onNavigateServices },
          { label: 'Graphic Design & Branding' },
        ]}
        actions={[
          {
            label: 'Request a Design Consultation',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Graphic Design & Brand Identity Consultation'),
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
              placeholder="Search design capabilities (e.g. logo, brand guidelines, social, banners)..."
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
              <span>Core Design Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight">
              What We Can Help With
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              From foundational logo identity systems and color guidelines to high-converting social media creatives and digital ad banners.
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
                      Design Focus & Scope
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
                  {/* Deliverables Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100">
                    {cap.deliverables.map((deliv) => (
                      <span
                        key={deliv}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200/70"
                      >
                        {deliv}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenContactWithSummary(`Inquiring about Graphic Design: ${cap.title}`)
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
              <span>Design Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance">
              How Nexordive Approaches the Project
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              We review your audience, design references and communication goals, then develop concepts, collect feedback and prepare agreed final files for the relevant channels.
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

      {/* 4. Selected Design Concepts & Project Showcase */}
      <ProjectShowcase
        limit={3}
        onInquireProject={(project) =>
          onOpenContactWithSummary(`Inquiring about Design Case Reference: ${project}`)
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
              Clear answers regarding individual graphic design requirements, social creatives, and brand guidelines.
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

      {/* 6. Conversion CTA Block */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-[#004d6a] via-[#093c47] to-[#06242c] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Brand Identity & Graphic Design</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance">
            Request a Design Consultation
          </h2>

          <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto font-normal leading-relaxed">
            Ready to give your business a consistent, professional brand identity? Share your vision and communication goals with our creative team.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                onOpenContactWithSummary(
                  'Inquiry: Graphic Design & Brand Identity Consultation'
                )
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <span>Request a Design Consultation</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/923146009810?text=Hello%20Nexordive%2C%20I%20would%20like%20to%20discuss%20a%20graphic%20design%20and%20branding%20project"
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
