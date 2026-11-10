'use client';

import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Pricing } from '../components/Pricing';
import { ProjectEstimator } from '../components/ProjectEstimator';

interface PricingPageProps {
  onNavigateHome?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1 bg-white">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="Transparent Investments"
        title="Predictable Engineering Pricing & Sprint Scope"
        description="Zero hidden costs, no surprise invoices. Choose transparent fixed-scope packages or dedicated sprint teams with defined sprint milestones, complete IP transfer, and post-launch code warranty."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Pricing' },
        ]}
        actions={[
          {
            label: 'Schedule Scoping Session',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Custom Scope & Pricing Discussion'),
          },
        ]}
      />

      {/* 2. Transparent Pricing Packages */}
      <Pricing
        onSelectPackage={(pkg, price) =>
          onOpenContactWithSummary(`Selected Package: ${pkg} (${price})`)
        }
      />

      {/* 3. Interactive Real-Time Scope & Investment Estimator */}
      <ProjectEstimator
        onApplyEstimate={(summary) => onOpenContactWithSummary(summary)}
      />
    </div>
  );
};
