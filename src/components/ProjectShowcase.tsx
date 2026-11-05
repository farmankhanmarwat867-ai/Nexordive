'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { CASE_STUDIES } from '../data/agencyData';
import { PortfolioProjectItem } from '../types/content';
import { PortfolioCard } from './common/PortfolioCard';
import { CaseStudyModal } from './common/CaseStudyModal';
import { getAvailableTabs, matchesCategory } from '../utils/portfolioFilter';

interface ProjectShowcaseProps {
  limit?: number;
  onSelectProject?: (project: PortfolioProjectItem) => void;
  onInquireProject?: (projectName: string) => void;
  onViewAll?: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  limit,
  onSelectProject,
  onInquireProject,
  onViewAll,
}) => {
  const { content } = useAdmin();
  const portfolioData = content?.portfolio;

  const rawProjects: PortfolioProjectItem[] =
    portfolioData?.projects && portfolioData.projects.length > 0
      ? portfolioData.projects
      : CASE_STUDIES.map((c, idx) => ({
          id: c.id,
          title: c.title,
          client: c.client,
          category:
            c.category === 'fintech'
              ? 'SaaS Platforms'
              : c.category === 'ai'
              ? 'AI Solutions'
              : 'Business & Web',
          year: c.year,
          impactMetric: c.impactMetric,
          impactLabel: 'Impact',
          summary: c.summary,
          challenge: c.challenge,
          solution: c.solution,
          outcome: c.outcome,
          previewGradient: c.previewGradient,
          techStack: c.techStack,
          deliverables: c.deliverables,
          accentColor: c.accentColor,
          image: '',
          featured: false,
          visible: true,
          order: idx,
        }));

  const visibleProjects = rawProjects
    .filter((p: PortfolioProjectItem) => p.visible !== false)
    .sort((a: PortfolioProjectItem, b: PortfolioProjectItem) => (a.order ?? 0) - (b.order ?? 0));

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<PortfolioProjectItem | null>(null);

  // Available filter tabs
  const filterTabs = getAvailableTabs(visibleProjects);

  // Filter projects by active category tab
  const filteredProjects = visibleProjects.filter((p: PortfolioProjectItem) =>
    matchesCategory(p.category, activeTab)
  );

  const displayedProjects =
    limit && limit > 0 ? filteredProjects.slice(0, limit) : filteredProjects;

  const handleInquire = (projectName: string) => {
    setSelectedCaseStudy(null);
    if (onInquireProject) {
      onInquireProject(projectName);
    } else if (onSelectProject && selectedCaseStudy) {
      onSelectProject(selectedCaseStudy);
    }
  };

  return (
    <section id="work" className="py-20 sm:py-28 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-3">
          <Briefcase className="w-3.5 h-3.5 text-[#0d5363]" />
          <span>{portfolioData?.sectionEyebrow || 'Selected Works & Proof'}</span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight mb-3">
          {portfolioData?.sectionTitle || 'Transformative Systems with Measurable Impact'}
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {portfolioData?.sectionSubtitle ||
            'Explore premium applications developed by NexorDive. We solve core concurrency challenges and craft seamless interfaces that generate revenue or simplify operations.'}
        </p>

        {/* Category Filter Tabs Bar */}
        <div className="flex items-center justify-center mb-12 px-2">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm gap-1 flex-wrap justify-center">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`transition-all duration-300 font-medium px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Case Studies Responsive Grid (3-Column Browser Mockup Card Layout) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 text-left"
          >
            {displayedProjects.length > 0 ? (
              displayedProjects.map((project: PortfolioProjectItem, index: number) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  index={index}
                  onSelectCaseStudy={(p) => setSelectedCaseStudy(p)}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500">
                No projects found in this category.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {onViewAll && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#004d6a]/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#004d6a]"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="w-4 h-4 text-cyan-300" />
            </button>
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onInquire={handleInquire}
      />
    </section>
  );
};
