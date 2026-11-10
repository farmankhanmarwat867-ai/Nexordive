'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, GitCommit, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { PROCESS_PHASES } from '../data/agencyData';
import { ProcessStepItem } from '../types/content';

export const ProcessTimeline: React.FC = () => {
  const { content } = useAdmin();
  const processData = content?.process;

  const steps: ProcessStepItem[] = (processData?.steps && processData.steps.length > 0)
    ? [...processData.steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : PROCESS_PHASES.map((p, idx) => ({
        id: `phase-${p.number}`,
        number: p.number,
        title: p.title,
        duration: p.duration,
        description: p.description,
        deliverables: p.deliverables,
        keyOutcome: p.keyOutcome,
        order: idx,
      }));

  return (
    <section id="process" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-4">
            <GitCommit className="w-3.5 h-3.5 text-[#0d5363]" />
            <span>{processData?.sectionEyebrow || 'Our process'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 font-serif tracking-tight text-balance">
            {processData?.sectionTitle || 'Our process — from idea to launch'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
            {processData?.sectionDescription ||
              'We operate in tight fortnightly sprints with continuous staging access, rigorous automated testing, and clear delivery gates at every milestone.'}
          </p>
        </div>

        {/* Dynamic Phases Grid (6-Phase 3-Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((phase: ProcessStepItem, index: number) => (
            <motion.div
              key={phase.id || phase.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-[#0d5363]/40 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-[#0d5363]/10 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                {/* Phase Number & Duration */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <span className="text-3xl font-extrabold text-[#004d6a] font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
                    {phase.number}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#004d6a]" />
                    <span>{phase.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mb-3 group-hover:text-[#004d6a] transition-colors leading-snug">
                  {phase.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {phase.description}
                </p>

                {/* Deliverables */}
                {phase.deliverables && phase.deliverables.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      Core Deliverables
                    </span>
                    {phase.deliverables.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Milestone Outcome Callout */}
              {phase.keyOutcome && (
                <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="text-[#004d6a] font-bold font-mono uppercase tracking-wider block mb-0.5">Key Gate:</span>
                  <span className="text-slate-700 font-medium">{phase.keyOutcome}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
