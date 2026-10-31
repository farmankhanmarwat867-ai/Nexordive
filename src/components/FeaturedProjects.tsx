'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, ArrowRight, ArrowUpRight, Heart, GraduationCap, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { PortfolioProjectItem } from '../types/content';

interface FeaturedProjectsProps {
  onViewAll?: () => void;
  onSelectProject?: (project: PortfolioProjectItem) => void;
}

const TechBadgeIcon: React.FC<{ name: string }> = ({ name }) => {
  const lower = name.toLowerCase();
  if (lower.includes('next')) {
    return (
      <span className="w-3.5 h-3.5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
        N
      </span>
    );
  }
  if (lower.includes('typescript') || lower.includes('ts')) {
    return (
      <span className="w-3.5 h-3.5 rounded-xs bg-[#3178c6] text-white text-[8px] font-bold flex items-center justify-center shrink-0">
        TS
      </span>
    );
  }
  if (lower.includes('tailwind')) {
    return (
      <svg className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
      </svg>
    );
  }
  if (lower.includes('react')) {
    return (
      <svg className="w-3.5 h-3.5 text-[#00d8ff] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (lower.includes('node')) {
    return (
      <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] text-white text-[8px] font-bold flex items-center justify-center shrink-0">
        JS
      </span>
    );
  }
  if (lower.includes('mongo')) {
    return (
      <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
        M
      </span>
    );
  }
  return <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />;
};

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  onViewAll,
  onSelectProject,
}) => {
  const { content } = useAdmin();
  const portfolioData = content?.portfolio;

  const rawProjects: PortfolioProjectItem[] = portfolioData?.projects || [];
  const visibleProjects = rawProjects.filter((p) => p.visible !== false);

  // Pick top 2 featured projects (fallback to first 2 visible projects)
  const featured = visibleProjects.filter((p) => p.featured);
  const displayProjects = (featured.length >= 2 ? featured : visibleProjects).slice(0, 2);

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

        {/* 2 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12 mb-12 text-left">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => onSelectProject && onSelectProject(project)}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 p-5 sm:p-6 flex flex-col sm:flex-row items-stretch gap-5 group cursor-pointer"
            >
              {/* Left: Thumbnail Image */}
              <div className="w-full sm:w-44 md:w-48 h-40 sm:h-auto rounded-2xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-100">
                <img
                  src={
                    project.image ||
                    (idx === 0
                      ? '/assets/projects/digital_medical.png'
                      : '/assets/projects/academy_attendance.png')
                  }
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right: Project Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div>
                  {/* Top Category Badge & External Link */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100/80">
                      {project.category.toLowerCase().includes('health') ? (
                        <Heart className="w-3 h-3 text-blue-600 fill-blue-600 shrink-0" />
                      ) : project.category.toLowerCase().includes('edu') ? (
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
                      )}
                      <span>{project.category}</span>
                    </span>

                    <div
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-all shadow-xs"
                      title="View Details"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display mb-1.5">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {project.summary}
                  </p>
                </div>

                {/* Bottom Tech Stack Tags */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
                    {project.techStack.slice(0, 4).map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200/80"
                      >
                        <TechBadgeIcon name={tech} />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                )}
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
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
