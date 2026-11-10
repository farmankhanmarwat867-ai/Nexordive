'use client';

import React, { useState } from 'react';
import { Services } from '../components/Services';
import { ServicesBento } from '../components/ServicesBento';
import { ProcessTimeline } from '../components/ProcessTimeline';

interface ServicesPageProps {
  onNavigateHome?: () => void;
  onNavigatePricing?: () => void;
  onNavigateWebDevelopment?: () => void;
  onNavigateGraphicDesign?: () => void;
  onNavigateDigitalMarketing?: () => void;
  onNavigateAIAutomation?: () => void;
  onNavigateMobileAppDevelopment?: () => void;
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
  onNavigateAIAutomation,
  onNavigateMobileAppDevelopment,
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
    } else if ((name.includes('ai') || name.includes('auto') || name.includes('bot')) && onNavigateAIAutomation) {
      onNavigateAIAutomation();
    } else if ((name.includes('mobile') || name.includes('app') || name.includes('ios') || name.includes('android')) && onNavigateMobileAppDevelopment) {
      onNavigateMobileAppDevelopment();
    } else if (name.includes('saas') && onNavigateSaaS) {
      onNavigateSaaS();
    } else if ((name.includes('shopify') || name.includes('commerce')) && onNavigateShopify) {
      onNavigateShopify();
    } else {
      onOpenContactWithSummary(`Inquiring about core capability: ${serviceName}`);
    }
  };

  return (
    <div className="flex-1 bg-[#f8fafc] pt-12 sm:pt-16">
      {/* 1. Main Core Services (Starts directly with 'We Are Here To Provide Our Services') */}
      <Services
        searchFilter={filterQuery}
        onSelectService={handleSelectService}
      />

      {/* 2. Advanced Disciplines & Full-Stack Capabilities Bento */}
      <ServicesBento
        onSelectService={handleSelectService}
      />

      {/* 3. Disciplined Six-Phase Execution Pipeline */}
      <ProcessTimeline />
    </div>
  );
};
