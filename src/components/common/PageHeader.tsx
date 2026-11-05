'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ActionButton {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ActionButton[];
  searchSlot?: React.ReactNode;
  align?: 'left' | 'center';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  description,
  breadcrumbs,
  actions,
  searchSlot,
  align = 'center',
}) => {
  const isCentered = align === 'center';

  return (
    <header className="relative bg-[#004d6a] pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#093c47] rounded-full blur-2xl pointer-events-none" />

      {/* Subtle Dot matrix grid */}
      <div className="absolute bottom-4 left-6 sm:left-12 w-64 sm:w-80 h-28 sm:h-36 pattern-dots opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumbs" className={`flex items-center gap-2 mb-6 text-xs text-cyan-200/80 ${isCentered ? 'justify-center' : 'justify-start'}`}>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-cyan-400/60" />}
                  {isLast ? (
                    <span className="font-semibold text-white tracking-wide">{crumb.label}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className="hover:text-cyan-200 transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-300 rounded"
                    >
                      {crumb.label}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`flex flex-col ${isCentered ? 'items-center text-center mx-auto max-w-4xl' : 'items-start text-left max-w-3xl'} space-y-5`}
        >
          {/* Eyebrow Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-200 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{badge}</span>
            </div>
          )}

          {/* Page H1 Title (Exactly one per page) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12] text-balance">
            {title}
          </h1>

          {/* Subtitle Description */}
          {description && (
            <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 font-normal leading-relaxed max-w-2xl text-balance">
              {description}
            </p>
          )}

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className={`pt-2 flex flex-wrap items-center gap-4 ${isCentered ? 'justify-center' : 'justify-start'}`}>
              {actions.map((act, i) => {
                const isPrimary = act.variant !== 'secondary';
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={act.onClick}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-95 ${
                      isPrimary
                        ? 'bg-gradient-to-r from-[#4ee1d6] via-[#38bdf8] to-[#818cf8] text-slate-950 shadow-lg shadow-cyan-400/20 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-[#122b3e]/80 hover:bg-[#16354d] text-white border border-[#234b6b] hover:border-cyan-400/40'
                    }`}
                  >
                    <span>{act.label}</span>
                    {act.icon || (isPrimary ? <ArrowRight className="w-4 h-4 text-slate-950" /> : null)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Search or Filter Slot */}
          {searchSlot && (
            <div className="w-full pt-4 max-w-xl">
              {searchSlot}
            </div>
          )}
        </motion.div>
      </div>
    </header>
  );
};
