'use client';

import React from 'react';
import { Services } from '../components/Services';
import { ProcessTimeline } from '../components/ProcessTimeline';

interface ServicesPageProps {
  onNavigateHome?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1 bg-[#f8fafc] pt-12 sm:pt-16">
      {/* Main Core Services Grid */}
      <Services
        onSelectService={(serviceName) =>
          onOpenContactWithSummary(`Inquiring about core capability: ${serviceName}`)
        }
      />

      {/* Four-Phase Execution Pipeline */}
      <ProcessTimeline />
    </div>
  );
};
