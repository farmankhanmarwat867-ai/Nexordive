'use client';

import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { Testimonials } from '../components/Testimonials';
import { PartnersMarquee } from '../components/PartnersMarquee';
import { useAdmin } from '../context/AdminStore';

interface PortfolioPageProps {
  onNavigateHome: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  const { content } = useAdmin();
  const header = content?.pageHeaders?.portfolio;

  return (
    <div className="flex-1">
      {/* Page Header Banner */}
      <PageHeader
        badge={header?.badge || 'Selected Works & Case Studies'}
        title={header?.title || 'Transformative Systems with Measurable Impact'}
        description={
          header?.description ||
          'Review our verified client deliveries, architectural case studies, and performance benchmarks across FinTech, Enterprise SaaS, AI intelligence, and spatial graphics.'
        }
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
