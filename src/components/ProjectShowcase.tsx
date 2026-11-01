'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Sparkles, TrendingUp, X } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { CASE_STUDIES } from '../data/agencyData';
import { PortfolioProjectItem } from '../types/content';

interface ProjectShowcaseProps {
  onInquireProject?: (projectName: string) => void;
  onViewAll?: () => void;
  limit?: number;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onInquireProject, onViewAll, limit }) => {
  const { content } = useAdmin();
  const portfolioData = content?.portfolio;

  const rawProjects: PortfolioProjectItem[] = (portfolioData?.projects && portfolioData.projects.length > 0)
    ? portfolioData.projects
    : CASE_STUDIES.map((c, idx) => ({
        id: c.id,
        title: c.title,
        client: c.client,
        category: c.category,
        year: c.year,
        impactMetric: c.impactMetric,
        impactLabel: 'Impact',
        summary: c.summary,
        challenge: '',
        solution: '',
        outcome: '',
        previewGradient: '',
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

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<PortfolioProjectItem | null>(null);

  // Dynamic unique category tags
  const uniqueCategories = Array.from(new Set(visibleProjects.map((p) => p.category))).filter(Boolean);

  const filteredProjects = visibleProjects.filter((p: PortfolioProjectItem) => {
    if (activeFilter === 'all') return true;
    return p.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const displayedProjects = limit && limit > 0 ? filteredProjects.slice(0, limit) : filteredProjects;

  return (
    <section id="work" className="py-24 md:py-32 relative bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3">
              {portfolioData?.sectionEyebrow || 'Selected Works & Proof'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance">
              {portfolioData?.sectionTitle || 'Transformative systems with measurable impact.'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Interactive filter tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                All Projects ({visibleProjects.length})
              </button>
              {uniqueCategories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer capitalize ${
                    activeFilter.toLowerCase() === cat.toLowerCase()
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004d6a] hover:text-[#006f94] transition-colors group cursor-pointer whitespace-nowrap"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Case Studies Responsive Grid (3-Column Card Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {displayedProjects.map((project: PortfolioProjectItem, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => setSelectedCaseStudy(project)}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              {/* Top: Image Preview Container */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] bg-slate-100 overflow-hidden">
                <img
                  src={
                    project.image ||
                    (index === 0
                      ? '/assets/projects/mmc_hospital.png'
                      : index === 1
                      ? '/assets/projects/digital_medical.png'
                      : '/assets/projects/academy_attendance.png')
                  }
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Country / Region Badge (e.g. PK) */}
                {project.countryBadge ? (
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                    {project.countryBadge}
                  </div>
                ) : (
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {project.category}
                  </div>
                )}
              </div>

              {/* Bottom: Project Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {project.summary}
                  </p>

                  {/* Tech Stack Pills */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50/80 text-blue-600 border border-blue-200/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (project.liveUrl) {
                        window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
                      } else {
                        setSelectedCaseStudy(project);
                      }
                    }}
                    className="font-semibold text-xs sm:text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer group/link"
                  >
                    <span>View Live Site</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>

                  <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    Case Study
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedCaseStudy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedCaseStudy(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 text-xs mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedCaseStudy.accentColor || '#6366f1' }}
              />
              <span className="font-mono text-indigo-600 uppercase tracking-wider font-semibold">
                {selectedCaseStudy.category}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-slate-500">{selectedCaseStudy.year}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-700 font-medium">{selectedCaseStudy.client}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display mb-4">
              {selectedCaseStudy.title}
            </h3>

            {/* Image Preview inside modal if available */}
            {selectedCaseStudy.image && (
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 border border-slate-200">
                <img
                  src={selectedCaseStudy.image}
                  alt={selectedCaseStudy.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Impact Metric Callout */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-slate-700">Verified Client Impact</span>
              </div>
              <span className="text-base font-bold text-slate-950 font-display">
                {selectedCaseStudy.impactMetric}
              </span>
            </div>

            {/* Description / Summary */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
              {selectedCaseStudy.summary}
            </p>

            {/* Problem & Solution if provided */}
            {selectedCaseStudy.challenge && (
              <div className="mb-4 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Challenge:</span>
                <p className="text-slate-600 leading-relaxed">{selectedCaseStudy.challenge}</p>
              </div>
            )}
            {selectedCaseStudy.solution && (
              <div className="mb-6 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Solution:</span>
                <p className="text-slate-600 leading-relaxed">{selectedCaseStudy.solution}</p>
              </div>
            )}

            {/* Deliverables */}
            {selectedCaseStudy.deliverables && selectedCaseStudy.deliverables.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Scope & Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCaseStudy.deliverables.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {selectedCaseStudy.techStack && selectedCaseStudy.techStack.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Production Architecture
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaseStudy.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-500 italic">Enterprise deployment NDA protected</span>

              <button
                onClick={() => {
                  setSelectedCaseStudy(null);
                  if (onInquireProject) {
                    onInquireProject(selectedCaseStudy.title);
                  } else {
                    window.location.hash = '#contact';
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Inquire Similar Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
