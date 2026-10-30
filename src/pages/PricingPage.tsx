'use client';

import React from 'react';
import { Pricing } from '../components/Pricing';

interface PricingPageProps {
  onNavigateHome?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1 bg-white pt-12 sm:pt-16">
      {/* 4 Pricing Tiers */}
      <Pricing
        onSelectPackage={(pkg, price) =>
          onOpenContactWithSummary(`Selected Package: ${pkg} (${price})`)
        }
      />
    </div>
  );
};
