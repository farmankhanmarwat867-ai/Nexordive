'use client';

import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Pricing } from '../components/Pricing';
import { useAdmin } from '../context/AdminStore';

interface PricingPageProps {
  onNavigateHome: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  const { content } = useAdmin();
  const header = content?.pageHeaders?.pricing;

  return (
    <div className="flex-1">
      {/* Page Header Banner */}
      <PageHeader
        badge={header?.badge || 'Predictable Investment'}
        title={header?.title || 'Transparent Pricing Packages & Custom Scopes'}
        description={
          header?.description ||
          'Predictable investment models with zero surprise hourly overages. Every package includes direct engineer communication, weekly demos, full IP assignment, and post-launch bug warranty.'
        }
        currentPage="Pricing"
        onNavigateHome={onNavigateHome}
      />

      {/* 4 Pricing Tiers */}
      <Pricing
        onSelectPackage={(pkg, price) =>
          onOpenContactWithSummary(`Selected Package: ${pkg} (${price})`)
        }
      />
    </div>
  );
};
