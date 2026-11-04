'use client';

import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { Testimonials } from '../components/Testimonials';
import { PartnersMarquee } from '../components/PartnersMarquee';

interface PortfolioPageProps {
  onNavigateHome?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1 bg-white">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="Selected Works & Proof"
        title="Transformative Systems with Measurable Impact"
        description="Explore verified client deliveries, architectural prototypes, and performance benchmarks across FinTech, Enterprise SaaS, Headless Shopify, and applied AI systems."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Portfolio' },
        ]}
        actions={[
          {
            label: 'Initiate a Project Discussion',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Architectural Discovery from Portfolio Case Studies'),
          },
        ]}
      />

      {/* 2. Case Studies Grid with Category Filters & Modal */}
      <ProjectShowcase
        onInquireProject={(projectName) =>
          onOpenContactWithSummary(`Case Study Reference: ${projectName}`)
        }
      />

      {/* 3. Endorsements from Leaders */}
      <Testimonials />

      {/* 4. Partners Banner */}
      <PartnersMarquee />
    </div>
  );
};
