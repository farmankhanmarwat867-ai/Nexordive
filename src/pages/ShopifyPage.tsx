'use client';
import { RelatedServices } from '../components/common/RelatedServices';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
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
  Smartphone,
  ShieldCheck,
  Boxes,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { useAdmin } from '../context/AdminStore';

interface ShopifyPageProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigatePricing?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
  onNavigate?: (page: string) => void;
}

interface ShopifyCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
  deliverables: string[];
}

const SHOPIFY_CAPABILITIES: ShopifyCapability[] = [
  {
    id: 'storefront-setup-theme',
    title: 'Shopify Storefront Setup & Theme Customization',
    tagline: 'Clean store foundations and bespoke theme configuration aligned with your brand',
    description:
      'We establish your Shopify store foundation, setting up themes, configuring global typography and palettes, and tailoring sections to showcase your product line with clarity.',
    icon: <ShoppingBag className="w-6 h-6 text-cyan-300" />,
    specs: [
      'Online Store 2.0 theme installation and base layout setup',
      'Brand styling alignment (colors, fonts, logo placement, iconography)',
      'Modular section customization for hero, product grids, and storytelling blocks',
      'Catalog architecture and fundamental store settings configuration',
    ],
    deliverables: ['Theme Setup', 'Brand Style Kit', 'Section Templates', 'Store Settings Config'],
  },
  {
    id: 'collection-navigation-organization',
    title: 'Collection, Navigation & Product Page Organization',
    tagline: 'Intuitive catalog structure making products effortless to discover and buy',
    description:
      'We organize your product catalog with clear multi-level menus, thoughtful collection filters, and rich product description pages that answer buyer questions and drive conversions.',
    icon: <Boxes className="w-6 h-6 text-teal-300" />,
    specs: [
      'Multi-tier navigation menus and catalog search structure',
      'Automated and manual product collection rules with filtering',
      'Product page layout with media gallery, variant pickers, and specifications',
      'Merchandising badges, stock status indicators, and clear action buttons',
    ],
    deliverables: ['Catalog Hierarchy', 'Collection Taxonomy', 'Product Page Layout', 'Menu Architecture'],
  },
  {
    id: 'mobile-responsive-design',
    title: 'Mobile-Responsive Design & Visual Consistency',
    tagline: 'Fluid mobile shopping journeys with thumb-friendly tap targets and speed',
    description:
      'With the majority of e-commerce traffic happening on mobile devices, we ensure your storefront looks polished and functions smoothly across all smartphone and tablet screen sizes.',
    icon: <Smartphone className="w-6 h-6 text-sky-300" />,
    specs: [
      'Touch-first mobile layouts with optimized tap targets and sticky action bars',
      'High-density screen optimization for crisp product photography and media',
      'Fast mobile rendering with responsive image sizing and lazy loading',
      'Visual design consistency across collection, cart, and policy pages',
    ],
    deliverables: ['Mobile Storefront Layout', 'Responsive Component Kit', 'Image Optimization Audit', 'Cross-Device QA'],
  },
  {
    id: 'app-feature-integration',
    title: 'Basic App & Feature Integration Planning',
    tagline: 'Carefully selected Shopify apps that add business value without slow load times',
    description:
      'We plan and integrate essential storefront functionality—such as product reviews, email capture popups, live chat, and currency switchers—without bloating your code or slowing down page speeds.',
    icon: <Zap className="w-6 h-6 text-emerald-300" />,
    specs: [
      'Curated app selection for reviews, customer inquiries, and lead capture',
      'Safe app embed installation avoiding script conflicts and layout shifts',
      'Integration testing across browsers to ensure smooth customer experiences',
      'Elimination of redundant or unused marketplace scripts',
    ],
    deliverables: ['App Stack Audit', 'Integration Blueprint', 'Review & Form Hooks', 'Script Optimization'],
  },
  {
    id: 'checkout-path-launch-readiness',
    title: 'Checkout-Path Review & Launch Readiness Checks',
    tagline: 'Frictionless checkout paths, payment testing, and rigorous launch verification',
    description:
      'We review your complete purchase flow from cart drawer to checkout, test payment gateways, verify shipping and tax rates, and execute comprehensive pre-launch checklists.',
    icon: <ShieldCheck className="w-6 h-6 text-amber-300" />,
    specs: [
      'Cart drawer review with order notes, delivery details, and clear checkout buttons',
      'Payment gateway test transactions (Shopify Payments, PayPal, local gateways)',
      'Shipping zones, delivery rates, and automated tax calculations verification',
      'Custom domain connection, SSL certificate verification, and redirect testing',
    ],
    deliverables: ['Checkout Audit', 'Pre-Launch Checklist', 'Payment Test Verification', 'Domain & SSL Setup'],
  },
];

const APPROACH_STEPS = [
  {
    number: '01',
    title: 'Discovery & Product Brief',
    description:
      'We learn about your products, target audience, brand standards, and commercial objectives to guide the store structure.',
  },
  {
    number: '02',
    title: 'Storefront Architecture',
    description:
      'We organize the catalog, collection groupings, navigation menus, and key user conversion paths.',
  },
  {
    number: '03',
    title: 'Component Customization',
    description:
      'We customize the agreed theme sections, product templates, mobile layouts, and essential feature integrations.',
  },
  {
    number: '04',
    title: 'Review & QA Testing',
    description:
      'We test responsiveness, verify cart and checkout flows, test payment gateways, and audit mobile load speeds.',
  },
  {
    number: '05',
    title: 'Launch & Handover',
    description:
      'We connect your custom domain, execute final readiness checks, and provide documentation so your team can manage daily operations.',
  },
];

const SERVICE_FAQS = [
  {
    id: 'faq-new-shopify-store',
    question: 'Can you help with a new Shopify store?',
    answer:
      'Yes. Store setup and launch planning can be defined around your catalog and business requirements. We help you choose a suitable theme foundation, configure essential pages, and prepare your store for a confident launch.',
  },
  {
    id: 'faq-improve-existing-store',
    question: 'Can you improve an existing Shopify store?',
    answer:
      'Yes. Share the current storefront and priority issues for a scope review. We can audit page layout issues, mobile responsiveness, navigation roadblocks, or cart drop-offs to recommend targeted enhancements.',
  },
];

export const ShopifyPage: React.FC<ShopifyPageProps> = ({
  onNavigateHome,
  onNavigateServices,
  onNavigatePricing,
  onOpenContactWithSummary,
  onNavigate,
}) => {
  const { content } = useAdmin();
  const pageHeader = content?.pageHeaders?.shopify;
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(SERVICE_FAQS[0].id);

  const filteredCapabilities = SHOPIFY_CAPABILITIES.filter((cap) => {
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
        badge={pageHeader?.badge || 'Shopify Development Services'}
        title={pageHeader?.title || 'Shopify Development for Better Online Store Experiences'}
        description={
          pageHeader?.description ||
          'Your Shopify store should present products clearly and make shopping straightforward. Nexordive supports storefront setup, layout customization and user-focused improvements that reflect your brand and operational needs.'
        }
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services', onClick: onNavigateServices },
          { label: 'Shopify Store' },
        ]}
        actions={[
          {
            label: 'Discuss Your Shopify Store',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Shopify Store Setup & Theme Customization'),
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
              placeholder="Search Shopify capabilities (e.g. theme setup, mobile, collections, checkout)..."
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
              <span>Core Shopify Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight">
              What We Can Help With
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              From initial store setup and theme customization to collection organization, mobile optimization, app integration, and launch verification.
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
                      Engineering & Merchandising Focus
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
                      onOpenContactWithSummary(`Inquiring about Shopify Capability: ${cap.title}`)
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
              <span>Project Approach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance">
              How Nexordive Approaches the Project
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              We learn about your products, audience and store goals, organize the storefront structure, customize the agreed components and review the experience before launch.
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

      {/* 4. Selected Shopify Storefronts & Concepts */}
      <ProjectShowcase
        limit={3}
        onInquireProject={(project) =>
          onOpenContactWithSummary(`Inquiring about Shopify Case Reference: ${project}`)
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
              Straightforward answers about launching new Shopify stores or improving existing storefronts.
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
      <RelatedServices currentSlug="shopify-development" onNavigate={onNavigate} />

      {/* 6. Conversion CTA Block */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-[#004d6a] via-[#093c47] to-[#06242c] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Shopify Development Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance">
            Discuss Your Shopify Store
          </h2>

          <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto font-normal leading-relaxed">
            Your Shopify store should present products clearly and make shopping straightforward. Nexordive supports storefront setup, layout customization and user-focused improvements that reflect your brand and operational needs.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                onOpenContactWithSummary(
                  'Inquiry: Shopify Store Setup & Theme Customization'
                )
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <span>Discuss Your Shopify Store</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/923146009810?text=Hello%20Nexordive%2C%20I%20would%20like%20to%20discuss%20a%20Shopify%20store%20project"
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
