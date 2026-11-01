'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { PortfolioProjectItem } from '../types/content';

interface FeaturedProjectsProps {
  onViewAll?: () => void;
  onSelectProject?: (project: PortfolioProjectItem) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  onViewAll,
  onSelectProject,
}) => {
  const { content } = useAdmin();
  const portfolioData = content?.portfolio;

  const rawProjects: PortfolioProjectItem[] = portfolioData?.projects || [];
  const visibleProjects = rawProjects.filter((p) => p.visible !== false);

  // Pick top 3 featured projects (fallback to top 3 visible projects)
  const featured = visibleProjects.filter((p) => p.featured);
  const displayProjects = (featured.length >= 3 ? featured : visibleProjects).slice(0, 3);

  return (
    <section id="featured-projects" className="py-20 sm:py-28 relative bg-[#fcfdff] overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-xs mb-3">
          <Briefcase className="w-3.5 h-3.5 text-slate-700" />
          <span>{portfolioData?.sectionEyebrow || 'My Work'}</span>
        </div>

        {/* Title with Blue Accent */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-950 tracking-tight mb-3">
          Featured <span className="text-[#2563eb]">Projects</span>
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {portfolioData?.sectionSubtitle || 'A glimpse of my recent work. Explore more projects in my portfolio.'}
        </p>

        {/* Exactly 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mt-12 mb-14 text-left">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => onSelectProject && onSelectProject(project)}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              {/* Top: Image Preview Container */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] bg-slate-100 overflow-hidden">
                <img
                  src={
                    project.image ||
                    (idx === 0
                      ? '/assets/projects/mmc_hospital.png'
                      : idx === 1
                      ? '/assets/projects/digital_medical.png'
                      : '/assets/projects/academy_attendance.png')
                  }
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Country / Region Badge (e.g. PK) */}
                {project.countryBadge && (
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                    {project.countryBadge}
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
                      } else if (onSelectProject) {
                        onSelectProject(project);
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

        {/* View Full Portfolio Button with Radiating Sparkles */}
        {onViewAll && (
          <div className="flex items-center justify-center gap-3">
            {/* Left Sparkle Lines */}
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-500 hidden sm:block">
              <line x1="18" y1="6" x2="14" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="20" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="18" y1="18" x2="14" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Right Sparkle Lines */}
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-500 hidden sm:block">
              <line x1="6" y1="6" x2="10" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="4" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="6" y1="18" x2="10" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
};
