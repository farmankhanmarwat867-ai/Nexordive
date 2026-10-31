'use client';

import React from 'react';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { Testimonials } from '../components/Testimonials';
import { PartnersMarquee } from '../components/PartnersMarquee';

interface PortfolioPageProps {
  onNavigateHome?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1 bg-white pt-12 sm:pt-16">
      {/* Case Studies Grid with Category Filters & Modal */}
      <ProjectShowcase
        onInquireProject={(projectName) =>
          onOpenContactWithSummary(`Case Study Reference: ${projectName}`)
        }
      />

      {/* Endorsements from Leaders */}
      <Testimonials />

      {/* Partners Banner */}
      <PartnersMarquee />
    </div>
  );
};
