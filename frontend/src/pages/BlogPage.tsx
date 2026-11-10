'use client';

import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { BlogSection } from '../components/BlogSection';

interface BlogPageProps {
  onNavigateHome?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="flex-1 bg-white">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="Technical Insights & Engineering"
        title="Engineering Insights & Digital Growth Strategies"
        description="In-depth perspectives from our software architects on React 19, sub-second Core Web Vitals, headless e-commerce, multi-tenant SaaS architecture, and applied AI workflows."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Blog' },
        ]}
      />

      {/* 2. Blog Articles Section */}
      <BlogSection />
    </div>
  );
};
