import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { PROCESS_PHASES } from '../data/agencyData';

export const ProcessTimeline: React.FC = () => {
  return (
    <section id="process" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3">
            Execution Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight text-balance">
            A disciplined four-phase pipeline from blueprint to scale.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            We operate in tight fortnightly sprints with continuous staging access, rigorous automated testing, and clear delivery gates at every milestone.
          </p>
        </div>

        {/* 4-Phase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_PHASES.map((phase) => (
            <div
              key={phase.number}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 transition-all shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between group"
            >
              <div>
                {/* Phase Number & Duration */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <span className="text-2xl font-extrabold text-indigo-600 font-display">
                    {phase.number}.
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{phase.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-950 font-display mb-3 group-hover:text-indigo-600 transition-colors">
                  {phase.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {phase.description}
                </p>

                {/* Deliverables */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Core Deliverables
                  </span>
                  {phase.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Outcome Callout */}
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="text-indigo-600 font-semibold block mb-0.5">Key Gate:</span>
                <span>{phase.keyOutcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
