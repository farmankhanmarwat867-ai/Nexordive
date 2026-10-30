'use client';

import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { Testimonials } from '../components/Testimonials';
import { PartnersMarquee } from '../components/PartnersMarquee';

interface PortfolioPageProps {
  onNavigateHome: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1">
      {/* Page Header Banner */}
      <PageHeader
        badge="Selected Works & Case Studies"
        title="Transformative Systems with Measurable Impact"
        description="Review our verified client deliveries, architectural case studies, and performance benchmarks across FinTech, Enterprise SaaS, AI intelligence, and spatial graphics."
        currentPage="Portfolio"
        onNavigateHome={onNavigateHome}
      />

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
