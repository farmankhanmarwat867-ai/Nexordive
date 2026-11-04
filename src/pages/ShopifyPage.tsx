'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Zap,
  Globe,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  ShoppingCart,
  Boxes,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { ProjectShowcase } from '../components/ProjectShowcase';

interface ShopifyPageProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigatePricing?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

interface ShopifyCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
  techStack: string[];
}

const SHOPIFY_CAPABILITIES: ShopifyCapability[] = [
  {
    id: 'headless-hydrogen',
    title: 'Headless Hydrogen & Oxygen Architecture',
    tagline: 'Sub-second React 19 storefronts on Shopify Edge',
    description: 'We build headless e-commerce platforms using Shopify Hydrogen and Oxygen edge workers, decoupling the frontend to achieve instantaneous page loads, zero script bloat, and infinite design freedom.',
    icon: <Zap className="w-6 h-6 text-cyan-300" />,
    specs: [
      'Sub-second route navigation with predictive pre-fetching',
      'Shopify Storefront GraphQL API with Edge Caching',
      '99/100 Google Lighthouse Core Web Vitals on mobile',
      'Dynamic product routing & instant variant switching',
    ],
    techStack: ['Shopify Hydrogen', 'React 19', 'GraphQL', 'Tailwind CSS', 'Oxygen'],
  },
  {
    id: 'custom-liquid-theme',
    title: 'Bespoke Liquid 2.0 & Section Themes',
    tagline: 'Zero marketplace bloat, custom section architecture',
    description: 'We code custom Shopify themes from scratch using modern Shopify Online Store 2.0 standards, giving your merchandising team full visual editing control with modular reusable sections.',
    icon: <Sliders className="w-6 h-6 text-emerald-300" />,
    specs: [
      'Modular JSON templates & reusable section blocks',
      'Zero bloated app scripts or sluggish third-party plugins',
      'Fully accessible WCAG 2.2 AA mobile-first UI',
      'Optimized WebP/AVIF image delivery & lazy loading',
    ],
    techStack: ['Shopify Liquid', 'JavaScript', 'CSS3', 'Theme App Extensions'],
  },
  {
    id: 'cart-drawers-upsells',
    title: 'Conversion-Engineered Slide-Out Cart Drawers',
    tagline: 'Dynamic free-shipping thresholds & 1-click upsells',
    description: 'Turn your cart into a high-powered conversion engine with sliding cart drawers, dynamic reward bars, in-cart bundle cross-sells, and instant checkout dispatch.',
    icon: <ShoppingCart className="w-6 h-6 text-amber-300" />,
    specs: [
      'Slide-out Ajax cart drawer with zero page refresh',
      'Dynamic threshold progress bar (e.g. Free Shipping at $100)',
      '1-click product add-on cross-sells and upsell logic',
      'Real-time inventory level validation & reservation',
    ],
    techStack: ['Shopify Ajax API', 'TypeScript', 'Motion', 'Tailwind CSS'],
  },
  {
    id: 'checkout-extensibility',
    title: 'Shopify Plus Checkout Extensibility',
    tagline: 'Custom checkout blocks, post-purchase funnels & loyalty',
    description: 'Leverage modern Shopify Checkout Extensibility to embed bespoke delivery instructions, post-purchase 1-click upsell funnels, and VIP loyalty rewards directly inside checkout.',
    icon: <ShieldCheck className="w-6 h-6 text-sky-300" />,
    specs: [
      'Shopify Checkout UI Extensions with native styling',
      'Post-purchase one-click order bumps and subscriptions',
      'Custom delivery date pickers & address validation',
      'Strict PCI-DSS compliance & accelerated Apple/Google Pay',
    ],
    techStack: ['Checkout UI Extensions', 'Shopify Functions', 'Rust', 'JavaScript'],
  },
  {
    id: 'shopify-markets',
    title: 'Shopify Markets & Global Localization',
    tagline: 'Multi-currency, localized domains & international taxes',
    description: 'Expand internationally with zero friction. We configure Shopify Markets for automated geolocation currency switching, localized product catalogs, and international duties calculation.',
    icon: <Globe className="w-6 h-6 text-purple-300" />,
    specs: [
      'Automated geolocation IP detection & currency switching',
      'Sub-domain or sub-folder international SEO setup',
      'Landed-cost duties and customs tax calculations',
      'Multi-language catalog translation and RTL support',
    ],
    techStack: ['Shopify Markets', 'Cloudflare GeoIP', 'Hreflang SEO', 'Currency API'],
  },
  {
    id: 'app-erp-integrations',
    title: 'Klaviyo, ERP & 3PL Logistics Integrations',
    tagline: 'Automated omnichannel customer journeys & stock sync',
    description: 'We connect your Shopify store to your back-office ecosystem: automated Klaviyo event flows, Gorgias live chat, NetSuite / ShipBob inventory sync, and custom private Shopify apps.',
    icon: <Boxes className="w-6 h-6 text-teal-300" />,
    specs: [
      'Klaviyo Viewed Product & Abandoned Cart telemetry',
      'Gorgias contextual order tracking customer portal',
      'Real-time inventory webhook synchronization',
      'Custom Node.js private Shopify backend apps',
    ],
    techStack: ['Klaviyo API', 'Shopify Admin API', 'Node.js', 'Webhooks'],
  },
];

export const ShopifyPage: React.FC<ShopifyPageProps> = ({
  onNavigateHome,
  onNavigateServices,
  onNavigatePricing,
  onOpenContactWithSummary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCapabilities = SHOPIFY_CAPABILITIES.filter((cap) => {
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

  return (
    <div className="flex-1 bg-white">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="Shopify Development Services"
        title="Shopify Development Services — Store Setup & Speed Optimization"
        description="We provide comprehensive Shopify development services for e-commerce merchants: custom Shopify store setup, speed optimization, bespoke Liquid 2.0 sections, and headless Hydrogen storefronts engineered for higher conversion."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services', onClick: onNavigateServices },
          { label: 'Shopify Engineering' },
        ]}
        actions={[
          {
            label: 'Request Shopify Technical Audit',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Shopify & Headless E-Commerce Technical Audit'),
          },
          {
            label: 'Calculate Store Investment',
            variant: 'secondary',
            onClick: onNavigatePricing,
          },
        ]}
        searchSlot={
          <div className="relative w-full">
            <Search className="w-4 h-4 text-cyan-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Shopify engineering capabilities (e.g. Hydrogen, Liquid, Cart Drawer, Klaviyo)..."
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

      {/* 2. Architectural Capabilities Section */}
      <section className="py-20 lg:py-28 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] mb-4">
              <ShoppingBag className="w-3.5 h-3.5 text-[#0d5363]" />
              <span>E-Commerce Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight">
              Bespoke Shopify Engineering Capabilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Every Shopify build we deploy is optimized for maximum conversion velocity, sub-second mobile page loads, and frictionless international checkout.
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
                      Engineering Specifications
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
                      onOpenContactWithSummary(`Inquiring about Shopify Capability: ${cap.title}`)
                    }
                    className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#004d6a] hover:text-white text-[#0d5363] text-xs font-bold tracking-wide transition-all cursor-pointer group/btn border border-slate-200"
                  >
                    <span>Inquire Shopify Build</span>
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

      {/* 3. E-Commerce Case Studies & Prototype Proof */}
      <ProjectShowcase
        limit={3}
        onInquireProject={(project) =>
          onOpenContactWithSummary(`Inquiring about E-Commerce Case Reference: ${project}`)
        }
      />

      {/* 4. Disciplined Six-Phase Process Timeline */}
      <ProcessTimeline />
    </div>
  );
};
