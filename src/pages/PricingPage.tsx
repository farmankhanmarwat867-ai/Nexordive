'use client';

import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Pricing } from '../components/Pricing';
import { ProjectEstimator } from '../components/ProjectEstimator';

interface PricingPageProps {
  onNavigateHome: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1">
      {/* Page Header Banner */}
      <PageHeader
        badge="Predictable Investment"
        title="Transparent Pricing Packages & Custom Scopes"
        description="Predictable investment models with zero surprise hourly overages. Every package includes direct engineer communication, weekly demos, full IP assignment, and post-launch bug warranty."
        currentPage="Pricing"
        onNavigateHome={onNavigateHome}
      />

      {/* 4 Pricing Tiers */}
      <Pricing
        onSelectPackage={(pkg, price) =>
          onOpenContactWithSummary(`Selected Package: ${pkg} (${price})`)
        }
      />

      {/* Interactive Scope & Cost Estimator */}
      <ProjectEstimator
        onApplyEstimate={(summary) => onOpenContactWithSummary(summary)}
      />
    </div>
  );
};
