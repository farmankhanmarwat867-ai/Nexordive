'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { PortfolioProjectItem } from '../types/content';
import { PortfolioCard } from './common/PortfolioCard';
import { CaseStudyModal } from './common/CaseStudyModal';
import { getAvailableTabs, matchesCategory } from '../utils/portfolioFilter';

interface FeaturedProjectsProps {
  onViewAll?: () => void;
  onSelectProject?: (project: PortfolioProjectItem) => void;
  onInquireProject?: (projectName: string) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  onViewAll,
  onSelectProject,
  onInquireProject,
}) => {
  const { content } = useAdmin();
  const portfolioData = content?.portfolio;

  const rawProjects: PortfolioProjectItem[] = portfolioData?.projects || [];
  const visibleProjects = rawProjects
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<PortfolioProjectItem | null>(null);

  // Available filter tabs adapted for the agency
  const filterTabs = getAvailableTabs(visibleProjects);

  // Filter projects by active tab
  const filteredProjects = visibleProjects.filter((p) =>
    matchesCategory(p.category, activeTab)
  );

  // For the homepage, display initially up to 3 projects in the selected category
  const displayProjects = filteredProjects.slice(0, 3);

  // Open Case Study modal ONLY (do NOT open the contact inquiry form directly)
  const handleSelectCaseStudy = (project: PortfolioProjectItem) => {
    setSelectedCaseStudy(project);
  };

  // Called ONLY when the user clicks the "Inquire" button inside the Case Study modal
  const handleInquireFromCaseStudy = (projectName: string) => {
    if (onInquireProject) {
      onInquireProject(projectName);
    } else if (onSelectProject && selectedCaseStudy) {
      onSelectProject(selectedCaseStudy);
    }
  };

  return (
    <section
      id="featured-projects"
      className="py-20 sm:py-28 relative bg-[#fcfdff] overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-teal-50/50 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0d5363] shadow-xs mb-3">
          <Briefcase className="w-3.5 h-3.5 text-[#0d5363]" />
          <span>{portfolioData?.sectionEyebrow || 'Portfolio'}</span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight mb-3">
          {portfolioData?.sectionTitle ? (
            portfolioData.sectionTitle
          ) : (
            <>
              Selected work and <span className="text-[#0d5363]">project concepts</span>
            </>
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10">
          {portfolioData?.sectionSubtitle ||
            'Explore website layouts, interface concepts, branding directions and automation examples. Where work is a demonstration rather than commissioned client work, it is clearly labeled as a concept.'}
        </p>

        {/* Filter Tabs Bar matching reference design */}
        <div className="flex items-center justify-center mb-12 px-2">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm gap-1 flex-wrap justify-center">
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
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Browser Mockup Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-14 text-left"
          >
            {displayProjects.length > 0 ? (
              displayProjects.map((project, idx) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onSelectCaseStudy={handleSelectCaseStudy}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500">
                No projects found in this category.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View Full Portfolio Button */}
        {onViewAll && (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#004d6a]/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#004d6a]"
            >
              <span>View Our Work</span>
              <ArrowRight className="w-4 h-4 text-cyan-300" />
            </button>
          </div>
        )}
      </div>

      {/* Case Study Modal (Shows full case study; user can scroll to Inquire button) */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onInquire={handleInquireFromCaseStudy}
      />
    </section>
  );
};
