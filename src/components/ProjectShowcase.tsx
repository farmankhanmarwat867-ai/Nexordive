'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, ExternalLink, Sparkles, TrendingUp, X } from 'lucide-react';
import { CASE_STUDIES } from '../data/agencyData';
import { CaseStudy } from '../types/agency';

interface ProjectShowcaseProps {
  onInquireProject?: (projectName: string) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onInquireProject }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fintech' | 'ai' | 'saas' | 'spatial'>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

  const filteredProjects = CASE_STUDIES.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  return (
    <section id="work" className="py-24 md:py-32 relative bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3">
              Selected Works & Proof
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight text-balance">
              Transformative systems with measurable impact.
            </h2>
          </div>

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
              All Projects ({CASE_STUDIES.length})
            </button>
            <button
              onClick={() => setActiveFilter('fintech')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'fintech'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              FinTech
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'ai'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              AI Systems
            </button>
            <button
              onClick={() => setActiveFilter('saas')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'saas'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Enterprise SaaS
            </button>
            <button
              onClick={() => setActiveFilter('spatial')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'spatial'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Spatial & 3D
            </button>
          </div>
        </div>

        {/* Case Studies Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => setSelectedCaseStudy(project)}
              className="group relative rounded-2xl p-8 bg-white border border-slate-200 hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 cursor-pointer"
            >
              {/* Subtle ambient gradient on hover */}
              <div
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none blur-3xl"
                style={{ backgroundColor: project.accentColor }}
              />

              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs mb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.accentColor }}
                    />
                    <span className="font-mono text-indigo-600 uppercase tracking-wider font-semibold">
                      {project.category}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">{project.year}</span>
                </div>

                {/* Center visual representation */}
                <div className="relative z-10 flex items-center justify-center py-4">
                  <div className="w-full max-w-sm p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm group-hover:scale-102 transition-transform duration-300">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        <span className="text-xs font-mono text-slate-700">{project.title.split(' ')[0]}.interface</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 font-semibold">active</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Verified Impact:</span>
                        <span className="font-bold text-slate-900 tabular-nums flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          {project.impactMetric}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: '85%',
                            backgroundColor: project.accentColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title & Summary */}
                <h3 className="text-2xl font-bold text-slate-950 font-display mb-3 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {project.summary}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Client: <strong className="text-slate-900">{project.client}</strong></span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                  <span>View Case Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Deep-Dive Interactive Modal */}
      {selectedCaseStudy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedCaseStudy(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-100 mb-6">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-indigo-600 mb-2 font-semibold">
                  {selectedCaseStudy.category} · {selectedCaseStudy.year}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
                  {selectedCaseStudy.title}
                </h3>
                <div className="text-sm text-slate-500 mt-1">
                  Built for <strong className="text-slate-800">{selectedCaseStudy.client}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                aria-label="Close case study details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Impact Metric Hero */}
            <div className="p-4 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-mono tracking-wider">
                  Verified Production Outcome
                </span>
                <div className="text-2xl font-extrabold text-slate-950 font-display mt-0.5">
                  {selectedCaseStudy.impactMetric}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCaseStudy.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-white text-slate-700 border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem & Architectural Solution */}
            <div className="space-y-6 mb-8 text-sm text-slate-600 leading-relaxed">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  The Engineering Challenge
                </h4>
                <p>{selectedCaseStudy.challenge}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  The NexorDive Architectural Solution
                </h4>
                <p>{selectedCaseStudy.solution}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Business Outcome
                </h4>
                <p>{selectedCaseStudy.outcome}</p>
              </div>
            </div>

            {/* Modal Bottom CTAs */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Category: <strong className="text-slate-800 uppercase font-mono">{selectedCaseStudy.category}</strong>
              </span>
              <button
                onClick={() => {
                  const title = selectedCaseStudy.title;
                  setSelectedCaseStudy(null);
                  if (onInquireProject) {
                    onInquireProject(title);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <span>Request Architecture Like This</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
