'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  Zap,
  Compass,
  Layout,
  ShieldCheck,
  Rocket,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { useAdmin } from '../context/AdminStore';

interface MobileAppDevelopmentPageProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigatePricing?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

interface MobileCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
  deliverables: string[];
}

const MOBILE_CAPABILITIES: MobileCapability[] = [
  {
    id: 'app-discovery-planning',
    title: 'App Discovery & Requirements Planning',
    tagline: 'Translating concepts into structured product requirements and functional scopes',
    description:
      'We work with you to unpack your app vision, understand target audience behaviors, evaluate competitive solutions, and outline clear functional requirements before writing code.',
    icon: <Compass className="w-6 h-6 text-cyan-300" />,
    specs: [
      'Problem statement and primary user personas definition',
      'Feature scope matrix balancing business goals with technical practicality',
      'Technical feasibility assessment for device sensors, APIs, and permissions',
      'Initial tech stack evaluation based on performance and budget',
    ],
    deliverables: ['Product Scope Brief', 'Feature Matrix', 'Tech Stack Evaluation', 'Target User Profiles'],
  },
  {
    id: 'user-flows-wireframes-ui',
    title: 'User Flows, Wireframes & UI Design',
    tagline: 'Intuitive user journeys crafted for touch ergonomics and visual clarity',
    description:
      'We design modern, user-friendly mobile interfaces that make key tasks effortless, with clean visual hierarchies, thumb-friendly tap targets, and consistent brand styling.',
    icon: <Layout className="w-6 h-6 text-teal-300" />,
    specs: [
      'Low-fidelity wireframing of primary user navigation journeys',
      'High-fidelity screen mockups in light and dark mode styling',
      'Interactive Figma prototypes illustrating taps, swipes, and transitions',
      'Mobile-first UI component library with typography and color tokens',
    ],
    deliverables: ['Clickable Prototype', 'High-Fidelity Screens', 'Design Token System', 'Exported Asset Pack'],
  },
  {
    id: 'android-ios-solution-planning',
    title: 'Android & iOS Solution Planning',
    tagline: 'Practical multi-platform architecture tailored to your audience and constraints',
    description:
      'Whether your users are primarily on iPhone, Android, or both, we evaluate cross-platform frameworks (e.g. React Native / Flutter) and native platform requirements to find the right balance of speed, cost, and maintainability.',
    icon: <Smartphone className="w-6 h-6 text-sky-300" />,
    specs: [
      'Cross-platform vs. native framework architectural analysis',
      'Screen density, notch, dynamic island, and tablet layout adaptations',
      'Backend API contracts and data exchange specifications',
      'Offline state handling and local caching strategies',
    ],
    deliverables: ['Architecture Blueprint', 'Device Matrix Plan', 'API Schema Specs', 'Platform Comparison Matrix'],
  },
  {
    id: 'mvp-feature-prioritization',
    title: 'MVP Feature Prioritization',
    tagline: 'Focusing on core value loops to launch faster and gather real user feedback',
    description:
      'We help founders and growing teams avoid scope creep by narrowing down the smallest useful feature set needed to validate product-market fit, onboard early adopters, and generate actionable insights.',
    icon: <Zap className="w-6 h-6 text-emerald-300" />,
    specs: [
      'MoSCoW feature categorization (Must-have vs. Should-have vs. Could-have)',
      'Primary user loop optimization: onboarding, key action, and outcome',
      'Phased development milestone roadmapping for budget efficiency',
      'Pre-launch user feedback collection mechanism design',
    ],
    deliverables: ['MVP Roadmap', 'Release Sprint Plan', 'Core Loop User Flow', 'Feedback Channel Specs'],
  },
  {
    id: 'testing-release-iteration',
    title: 'Testing, Release Preparation & Iteration Planning',
    tagline: 'Rigorous multi-device QA, store guidelines compliance, and post-launch roadmap',
    description:
      'We prepare your application for reliable real-world usage through systematic device testing, App Store and Google Play compliance review, build signing, and structured post-release iteration steps.',
    icon: <ShieldCheck className="w-6 h-6 text-amber-300" />,
    specs: [
      'Functional and cross-device testing across popular screen resolutions',
      'Apple App Store & Google Play submission checklists and policy audits',
      'Crash reporting, performance monitoring, and basic telemetry setup',
      'Post-launch patch cadence and continuous enhancement backlog',
    ],
    deliverables: ['QA Test Matrix', 'App Store Metadata Pack', 'Submission Checklist', 'Post-Launch Roadmap'],
  },
];

const APPROACH_STEPS = [
  {
    number: '01',
    title: 'Core User Problem',
    description:
      'We start by identifying the core user problem your app solves, clarifying user needs, and establishing concrete success metrics.',
  },
  {
    number: '02',
    title: 'MVP Priorities',
    description:
      'We narrow scope to the critical feature set necessary to deliver user value without unnecessary delays or development bloat.',
  },
  {
    number: '03',
    title: 'Technology Options',
    description:
      'We evaluate and select suitable cross-platform or platform-specific technology options aligned with your budget and scalability goals.',
  },
  {
    number: '04',
    title: 'Agile Design & Development',
    description:
      'Design and development proceed through structured sprint phases with interactive prototypes and regular progress builds.',
  },
  {
    number: '05',
    title: 'Review Milestones & Launch',
    description:
      'We conduct milestone reviews, rigorous quality testing, store preparation, and plan future feature iterations based on real feedback.',
  },
];

const SERVICE_FAQS = [
  {
    id: 'faq-app-mvp',
    question: 'Can you help with an app MVP?',
    answer:
      'Yes. A minimum viable product can be scoped around the smallest useful set of features to validate an idea. This allows you to launch faster, test assumptions with real users, and make informed decisions on future development.',
  },
  {
    id: 'faq-android-ios',
    question: 'Do you build Android and iOS apps?',
    answer:
      'Both platforms can be considered during planning; the final approach depends on technical requirements and scope. We help evaluate whether a cross-platform solution or a platform-focused rollout best serves your audience and budget.',
  },
];

export const MobileAppDevelopmentPage: React.FC<MobileAppDevelopmentPageProps> = ({
  onNavigateHome,
  onNavigateServices,
  onNavigatePricing,
  onOpenContactWithSummary,
}) => {
  const { content } = useAdmin();
  const pageHeader = content?.pageHeaders?.mobileAppDevelopment;
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(SERVICE_FAQS[0].id);

  const filteredCapabilities = MOBILE_CAPABILITIES.filter((cap) => {
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
        badge={pageHeader?.badge || 'Mobile App Development Services'}
        title={pageHeader?.title || 'Mobile App Development From Concept to Usable Product'}
        description={
          pageHeader?.description ||
          'Bring your app idea into focus with clear user journeys, practical features and mobile-first interfaces. Nexordive supports mobile application planning and development for startups and businesses with defined product needs.'
        }
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services', onClick: onNavigateServices },
          { label: 'Mobile Apps' },
        ]}
        actions={[
          {
            label: 'Discuss Your App Idea',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Mobile App Development & MVP Scoping'),
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
              placeholder="Search mobile app capabilities (e.g. MVP, wireframes, iOS, Android, testing)..."
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
              <span>Core Mobile Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight">
              What We Can Help With
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              From initial discovery and touch-optimized UI design to cross-platform architecture, MVP prioritization, and store release planning.
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
                      Engineering & Design Focus
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
                      onOpenContactWithSummary(`Inquiring about Mobile App Service: ${cap.title}`)
                    }
                    className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#004d6a] hover:text-white text-[#0d5363] text-xs font-bold tracking-wide transition-all cursor-pointer group/btn border border-slate-200"
                  >
                    <span>Discuss This Requirement</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCapabilities.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-slate-600 text-sm mb-4">
                No mobile capabilities matched your search term "{searchQuery}".
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
              <span>Project Approach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance">
              How Nexordive Approaches the Project
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              We start by identifying the core user problem, selecting MVP priorities and defining suitable technology options. Design and development proceed through agreed phases and review milestones.
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

      {/* 4. Selected Mobile App Concepts & Case Studies */}
      <ProjectShowcase
        limit={3}
        onInquireProject={(project) =>
          onOpenContactWithSummary(`Inquiring about Mobile App Reference: ${project}`)
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
              Straightforward answers about building mobile MVPs, Android and iOS compatibility, and project scoping.
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
            <span>Mobile App Development Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance">
            Discuss Your App Idea
          </h2>

          <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto font-normal leading-relaxed">
            Bring your app idea into focus with clear user journeys, practical features and mobile-first interfaces. Nexordive supports mobile application planning and development for startups and businesses with defined product needs.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                onOpenContactWithSummary(
                  'Inquiry: Mobile App Development & MVP Scoping'
                )
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <span>Discuss Your App Idea</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/923146009810?text=Hello%20Nexordive%2C%20I%20would%20like%20to%20discuss%20a%20mobile%20app%20project"
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
