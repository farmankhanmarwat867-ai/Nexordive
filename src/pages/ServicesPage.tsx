'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Services } from '../components/Services';
import { ServicesBento } from '../components/ServicesBento';
import { ProcessTimeline } from '../components/ProcessTimeline';

interface ServicesPageProps {
  onNavigateHome?: () => void;
  onNavigatePricing?: () => void;
  onNavigateWebDevelopment?: () => void;
  onNavigateGraphicDesign?: () => void;
  onNavigateDigitalMarketing?: () => void;
  onNavigateSaaS?: () => void;
  onNavigateShopify?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigateHome,
  onNavigatePricing,
  onNavigateWebDevelopment,
  onNavigateGraphicDesign,
  onNavigateDigitalMarketing,
  onNavigateSaaS,
  onNavigateShopify,
  onOpenContactWithSummary,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const handleSelectService = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('web') && onNavigateWebDevelopment) {
      onNavigateWebDevelopment();
    } else if ((name.includes('graphic') || name.includes('design') || name.includes('brand')) && onNavigateGraphicDesign) {
      onNavigateGraphicDesign();
    } else if ((name.includes('market') || name.includes('seo') || name.includes('social')) && onNavigateDigitalMarketing) {
      onNavigateDigitalMarketing();
    } else if (name.includes('saas') && onNavigateSaaS) {
      onNavigateSaaS();
    } else if ((name.includes('shopify') || name.includes('commerce')) && onNavigateShopify) {
      onNavigateShopify();
    } else {
      onOpenContactWithSummary(`Inquiring about core capability: ${serviceName}`);
    }
  };

  return (
    <div className="flex-1 bg-[#f8fafc]">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="Development & Marketing Services"
        title="Digital Solutions & Engineering Services"
        description="NexorDive helps startups, growing businesses, and creators design, build, automate, and market practical digital experiences across web development, SaaS, Shopify, mobile apps, and digital growth."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services' },
        ]}
        actions={[
          {
            label: 'Scope a Custom Build',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Enterprise Software, SaaS & Shopify Engineering Services'),
          },
          ...(onNavigatePricing
            ? [
                {
                  label: 'Explore Transparent Pricing',
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
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search engineering capabilities (e.g. Next.js, SaaS, Shopify, AI, Mobile)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-cyan-100/60 text-xs sm:text-sm border border-cyan-400/30 focus:outline-hidden focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 transition-all backdrop-blur-md"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-cyan-200 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        }
      />

      {/* 2. Main Core Services Staggered Grid */}
      <Services
        searchFilter={filterQuery}
        onSelectService={handleSelectService}
      />

      {/* 3. Advanced Disciplines & Full-Stack Capabilities Bento */}
      <ServicesBento
        onSelectService={handleSelectService}
      />

      {/* 4. Disciplined Six-Phase Execution Pipeline */}
      <ProcessTimeline />
    </div>
  );
};
