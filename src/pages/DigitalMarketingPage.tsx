'use client';
import { RelatedServices } from '../components/common/RelatedServices';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  TrendingUp,
  Share2,
  Filter,
  BarChart3,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { useAdmin } from '../context/AdminStore';

interface DigitalMarketingPageProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigatePricing?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
  onNavigate?: (page: string) => void;
}

interface MarketingCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
  deliverables: string[];
}

const MARKETING_CAPABILITIES: MarketingCapability[] = [
  {
    id: 'seo-content-planning',
    title: 'SEO Content Planning & On-Page Recommendations',
    tagline: 'Search intent targeting and technical content hierarchy',
    description:
      'We research audience search intent, build structured keyword topic clusters, and provide practical on-page optimization recommendations to help your website get discovered organically.',
    icon: <Search className="w-6 h-6 text-cyan-300" />,
    specs: [
      'Keyword intent mapping and high-opportunity search terms',
      'On-page title tags, meta descriptions, and header hierarchy',
      'Content briefs and editorial guidelines for service pages',
      'Internal linking structures and schema markup guidance',
    ],
    deliverables: ['Keyword Intent Map', 'On-Page Audit Spec', 'Content Briefs', 'Metadata Guides'],
  },
  {
    id: 'social-media-content',
    title: 'Social Media Content & Creative Direction',
    tagline: 'Strategic content pillars and engaging visual direction',
    description:
      'We plan consistent social media content frameworks and creative visual direction across LinkedIn, Instagram, X, and Facebook to foster audience trust and brand authority.',
    icon: <Share2 className="w-6 h-6 text-teal-300" />,
    specs: [
      'Strategic brand content pillars and weekly cadence planning',
      'Platform-specific copywriting with clear calls to action',
      'Visual creative direction for carousels, infographics, and cards',
      'Audience engagement frameworks and hashtag strategies',
    ],
    deliverables: ['Monthly Content Calendar', 'Creative Direction Deck', 'Post Copy Pack', 'Publishing Spec'],
  },
  {
    id: 'paid-campaign-strategy',
    title: 'Paid Campaign Strategy & Ad Creative Support',
    tagline: 'Targeted advertising strategies across Google, Meta & LinkedIn',
    description:
      'We formulate structured paid advertising strategies, audience targeting frameworks, and performance-focused ad creatives designed to drive relevant inquiries without wasted spend.',
    icon: <Target className="w-6 h-6 text-sky-300" />,
    specs: [
      'Audience demographic, interest, and intent segmentation',
      'Compelling ad copywriting tailored for search and feed formats',
      'High-contrast visual creatives and banner dimensions',
      'Campaign budget allocation and bid strategy planning',
    ],
    deliverables: ['Ad Campaign Plan', 'Targeting Matrix', 'Ad Creative Suite', 'Copy Variants'],
  },
  {
    id: 'lead-generation-funnels',
    title: 'Lead Generation Funnel Planning',
    tagline: 'Seamless conversion paths from first click to qualified inquiry',
    description:
      'We plan high-converting lead capture funnels that guide visitors logically toward booking consultations, submitting RFP inquiries, or connecting via WhatsApp.',
    icon: <Filter className="w-6 h-6 text-emerald-300" />,
    specs: [
      'Landing page wireframes and conversion rate optimization (CRO)',
      'Lead magnet structuring and gated resource planning',
      'Frictionless contact form inquiry workflows',
      'Automated follow-up email sequences and lead tagging',
    ],
    deliverables: ['Funnel Architecture', 'Landing Page Wireframe', 'Form Logic Map', 'Follow-up Email Copy'],
  },
  {
    id: 'performance-reporting',
    title: 'Performance Reporting & Continuous Improvement Plans',
    tagline: 'Transparent metric tracking and iterative refinement roadmaps',
    description:
      'We set up clear measurement benchmarks, analyze conversion funnel drop-offs, and deliver practical optimization recommendations to steadily improve marketing outcomes.',
    icon: <BarChart3 className="w-6 h-6 text-amber-300" />,
    specs: [
      'Key performance indicator (KPI) alignment and event tracking',
      'Google Analytics 4 and Google Search Console metric audits',
      'Conversion rate analysis and visitor journey insights',
      'Iterative quarterly testing and improvement recommendations',
    ],
    deliverables: ['KPI Dashboard Setup', 'Monthly Review Summary', 'Funnel Analysis', 'Optimization Action Plan'],
  },
];

const APPROACH_STEPS = [
  {
    number: '01',
    title: 'Offer & Audience Review',
    description:
      'We review your core offering, target audience demographics, competitive landscape, and current conversion assets to establish a baseline.',
  },
  {
    number: '02',
    title: 'Channel Identification',
    description:
      'We identify the most suitable channels—organic search visibility, social media, or paid campaigns—based on your audience habits.',
  },
  {
    number: '03',
    title: 'Measurable Objectives',
    description:
      'We define clear, realistic objectives and conversion targets so that every campaign initiative is aligned around tangible business goals.',
  },
  {
    number: '04',
    title: 'Content & Campaign Plan',
    description:
      'We develop a structured content calendar, campaign architecture, creative messaging guidelines, and conversion landing page paths.',
  },
  {
    number: '05',
    title: 'Execution & Improvement',
    description:
      'We assist with execution and ongoing tracking (depending on the chosen package and access available) to plan future refinements.',
  },
];

const SERVICE_FAQS = [
  {
    id: 'faq-seo-social',
    question: 'Do you offer SEO and social media services?',
    answer:
      'Yes. Both can be discussed individually or together as part of a digital marketing plan. We tailor our recommendations based on your immediate priorities, whether that is organic search discoverability or social audience engagement.',
  },
  {
    id: 'faq-guarantees',
    question: 'Can marketing results be guaranteed?',
    answer:
      'No responsible agency can guarantee search rankings, leads or revenue. Results depend on competition, budgets, market conditions, execution and other external factors. We focus on transparent planning, rigorous testing, and continuous improvement.',
  },
];

export const DigitalMarketingPage: React.FC<DigitalMarketingPageProps> = ({
  onNavigateHome,
  onNavigateServices,
  onNavigatePricing,
  onOpenContactWithSummary,
  onNavigate,
}) => {
  const { content } = useAdmin();
  const pageHeader = content?.pageHeaders?.digitalMarketing;
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(SERVICE_FAQS[0].id);

  const filteredCapabilities = MARKETING_CAPABILITIES.filter((cap) => {
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
        badge={pageHeader?.badge || 'Digital Marketing Services'}
        title={pageHeader?.title || 'Digital Marketing Services That Connect Strategy With Action'}
        description={
          pageHeader?.description ||
          'Reach people who are actively looking for solutions like yours. Nexordive helps businesses plan content, search visibility, campaigns and conversion paths that work together rather than in isolation.'
        }
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services', onClick: onNavigateServices },
          { label: 'Digital Marketing' },
        ]}
        actions={[
          {
            label: 'Discuss Your Marketing Goals',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Digital Marketing & Campaign Strategy Consultation'),
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
              placeholder="Search marketing capabilities (e.g. SEO, social, paid campaigns, funnels)..."
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
              <span>Core Marketing Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight">
              What We Can Help With
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              From organic search visibility and social content direction to performance campaigns and continuous reporting.
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
                      Strategy & Scope
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
                      onOpenContactWithSummary(`Inquiring about Digital Marketing: ${cap.title}`)
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
              <span>Marketing Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance">
              How Nexordive Approaches the Project
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              We review your offer and audience, identify suitable channels, define measurable objectives and develop a content or campaign plan. Execution and tracking depend on the chosen package and access available.
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

      {/* 4. Selected Marketing Case Studies & Showcase */}
      <ProjectShowcase
        limit={3}
        onInquireProject={(project) =>
          onOpenContactWithSummary(`Inquiring about Marketing Case Reference: ${project}`)
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
              Transparent answers regarding SEO and social media plans, execution scope, and realistic performance expectations.
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
      <RelatedServices currentSlug="digital-marketing" onNavigate={onNavigate} />

      {/* 6. Conversion CTA Block */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-[#004d6a] via-[#093c47] to-[#06242c] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Digital Marketing Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance">
            Discuss Your Marketing Goals
          </h2>

          <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto font-normal leading-relaxed">
            Reach people who are actively looking for solutions like yours. Let's plan content, search visibility, campaigns and conversion paths that work together.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                onOpenContactWithSummary(
                  'Inquiry: Digital Marketing & Campaign Strategy Consultation'
                )
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <span>Discuss Your Marketing Goals</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/923146009810?text=Hello%20Nexordive%2C%20I%20would%20like%20to%20discuss%20a%20digital%20marketing%20project"
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
