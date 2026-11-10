'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioProjectItem } from '../../types/content';

interface PortfolioCardProps {
  project: PortfolioProjectItem;
  index: number;
  onSelectCaseStudy: (project: PortfolioProjectItem) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  project,
  index,
  onSelectCaseStudy,
}) => {
  // Domain slug for the browser window header bar
  const domainSlug = project.liveUrl
    ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : `${(project.id || 'system').replace(/^project-/, '')}.nexordive.app`;

  // Fallback image based on project ID or index
  const fallbackImage =
    index % 3 === 0
      ? '/assets/projects/mmc_hospital.png'
      : index % 3 === 1
      ? '/assets/projects/digital_medical.png'
      : '/assets/projects/academy_attendance.png';

  const displayImage = project.image || fallbackImage;

  // Tech stack items (max 3 visible + count badge)
  const techStack = project.techStack || ['Next.js', 'TypeScript', 'Tailwind'];
  const visibleTech = techStack.slice(0, 3);
  const remainingCount = Math.max(0, techStack.length - 3);

  // Client avatar
  const clientAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    project.client || project.title || 'Client'
  )}&background=0d5363&color=fff&bold=true`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 group"
    >
      <div>
        {/* Top Browser Frame Mockup Header (Clean Light Theme) */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-3 select-none">
          {/* Left: macOS Window Traffic Light Dots + Live Subdomain */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block shadow-xs" />
            </div>

            <div className="flex items-center gap-1.5 min-w-0 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-[11px] font-mono text-slate-600 truncate max-w-[140px] sm:max-w-[180px]">
                {domainSlug}
              </span>
            </div>
          </div>

          {/* Right: Category / Industry Pill Badge */}
          <div className="flex-shrink-0">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 border border-blue-200/80 text-blue-700 whitespace-nowrap">
              {project.category || 'DIGITAL SYSTEM'}
            </span>
          </div>
        </div>

        {/* Project Preview Image */}
        <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />

          {/* Optional country badge on the image */}
          {project.countryBadge && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-md border border-slate-700/50 text-[10px] font-bold text-white shadow-md">
              {project.countryBadge}
            </div>
          )}
        </div>

        {/* Card Content Area (Original White / Light Background) */}
        <div className="p-5 sm:p-6 bg-white">
          {/* Project Title */}
          <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1 mb-2">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {project.summary}
          </p>

          {/* Tech Stack Badges Row + Client Avatar */}
          <div className="flex items-center justify-between gap-2 pt-1 mb-2">
            {/* Tech Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {visibleTech.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium text-slate-700 bg-slate-100 border border-slate-200"
                >
                  {tech}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200">
                  +{remainingCount}
                </span>
              )}
            </div>

            {/* Client Avatar */}
            <div
              className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 shadow-xs"
              title={project.client || 'Client'}
            >
              <img
                src={clientAvatar}
                alt={project.client || 'Client'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons: Case Study and Live Demo */}
      <div className="p-5 sm:p-6 pt-0 bg-white">
        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
          {/* Left: Case Study Button */}
          <button
            type="button"
            onClick={() => onSelectCaseStudy(project)}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 hover:border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn"
          >
            <span className="font-mono text-blue-600 font-bold">&gt;_</span>
            <span>Case Study</span>
          </button>

          {/* Right: Live Demo Button */}
          <button
            type="button"
            onClick={() => {
              if (project.liveUrl) {
                window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
              } else {
                onSelectCaseStudy(project);
              }
            }}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-sm hover:shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Live Demo</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
