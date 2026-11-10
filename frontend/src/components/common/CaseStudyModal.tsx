'use client';

import React from 'react';
import { X, ArrowUpRight, Check, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';
import { PortfolioProjectItem } from '../../types/content';

interface CaseStudyModalProps {
  project: PortfolioProjectItem | null;
  onClose: () => void;
  onInquire?: (projectName: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onInquire,
}) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-8 text-slate-900 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span className="uppercase tracking-wider font-semibold text-slate-500">
            {project.category} &bull; {project.year || '2026'}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-[#2563eb] font-semibold mb-6">
          Client: {project.client}
        </p>

        {/* Impact Metric Hero Card */}
        {project.impactMetric && (
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                {project.impactMetric}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                {project.impactLabel || 'Verified Production Result'}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Summary */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
          {project.summary}
        </p>

        {/* Challenge & Solution Grid */}
        {(project.challenge || project.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {project.challenge && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
                  The Challenge
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            )}
            {project.solution && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                  The Solution
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Outcome */}
        {project.outcome && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Measurable Outcome</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {project.outcome}
            </p>
          </div>
        )}

        {/* Key Deliverables */}
        {project.deliverables && project.deliverables.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Key Deliverables & Engineering
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.deliverables.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs sm:text-sm text-slate-700"
                >
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Architecture & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dedicated Inquiry Callout Card at Bottom of Case Study */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-slate-50 to-cyan-50/60 border border-blue-200/90 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Interested in a solution like this?
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Submit a quick project request and our engineering team will connect with you within 24 hours.
            </p>
          </div>

          {onInquire && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire(project.title);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0d5363] hover:bg-[#093c47] shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire About This Solution</span>
            </button>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Back to Projects
          </button>

          {project.liveUrl && (
            <button
              type="button"
              onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Launch Live Website</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
