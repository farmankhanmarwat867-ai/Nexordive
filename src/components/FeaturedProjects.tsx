'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
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
      <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-teal-50/50 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0d5363] shadow-xs mb-3">
          <Briefcase className="w-3.5 h-3.5 text-[#0d5363]" />
          <span>{portfolioData?.sectionEyebrow || 'Portfolio'}</span>
        </div>

        {/* Title with Teal Accent */}
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
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
          {portfolioData?.sectionSubtitle || 'Explore website layouts, interface concepts, branding directions and automation examples. Where work is a demonstration rather than commissioned client work, it is clearly labeled as a concept.'}
        </p>

        {/* Exactly 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mt-12 mb-14 text-left">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onSelectProject && onSelectProject(project)}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#0d5363]/40 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status Classification Badge (Concept vs Verified) */}
                {project.isConcept || (project.statusBadge && project.statusBadge.includes('Concept')) ? (
                  <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1.5 border border-amber-400/30 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Concept Prototype</span>
                  </div>
                ) : (
                  <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5 border border-emerald-400/30 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Verified Client</span>
                  </div>
                )}

                {/* Country / Region Badge (e.g. PK) */}
                {project.countryBadge && (
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-[#004d6a]/90 backdrop-blur-md text-white text-[11px] font-mono font-bold flex items-center justify-center shadow-md border border-white/20">
                    {project.countryBadge}
                  </div>
                )}
              </div>

              {/* Bottom: Project Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category */}
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#0d5363] font-bold mb-1.5">
                    {project.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 group-hover:text-[#0d5363] transition-colors line-clamp-1 mb-2">
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
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200/70"
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
                    className="font-semibold text-xs sm:text-sm text-[#0d5363] hover:text-[#093c47] inline-flex items-center gap-1.5 transition-colors cursor-pointer group/link focus-visible:ring-2 focus-visible:ring-[#0d5363] rounded"
                  >
                    <span>View Case Details</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>

                  {project.impactMetric && (
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {project.impactMetric}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
    </section>
  );
};
