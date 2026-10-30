'use client';

import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Services } from '../components/Services';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { ProjectEstimator } from '../components/ProjectEstimator';

interface ServicesPageProps {
  onNavigateHome: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1">
      {/* Page Header Banner */}
      <PageHeader
        badge="Full-Spectrum Capabilities"
        title="Services Tailored for Modern Market Leaders"
        description="From zero-to-one product engineering and custom cloud architectures to AI automation and high-voltage creator assets, we deliver end-to-end digital excellence."
        currentPage="Services"
        onNavigateHome={onNavigateHome}
      />

      {/* Main Core Services Grid */}
      <Services
        onSelectService={(serviceName) =>
          onOpenContactWithSummary(`Inquiring about core capability: ${serviceName}`)
        }
      />

      {/* Interactive Scope & Cost Estimator */}
      <ProjectEstimator
        onApplyEstimate={(summary) => onOpenContactWithSummary(summary)}
      />

      {/* Four-Phase Execution Pipeline */}
      <ProcessTimeline />
    </div>
  );
};
