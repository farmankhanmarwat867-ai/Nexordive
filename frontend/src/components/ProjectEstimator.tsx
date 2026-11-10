'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Calculator, Check, Clock, DollarSign, Layers, Shield, Sparkles, Users } from 'lucide-react';
import { EstimatorOptions } from '../types/agency';
import { calculateProjectEstimate } from '../utils/estimator';
import { useAdmin } from '../context/AdminStore';

interface ProjectEstimatorProps {
  onApplyEstimate?: (summary: string) => void;
}

export const ProjectEstimator: React.FC<ProjectEstimatorProps> = ({ onApplyEstimate }) => {
  const { content } = useAdmin();
  const customRates = content?.pricing?.estimatorRates;

  const [projectType, setProjectType] = useState<EstimatorOptions['projectType']>('mvp');
  const [platforms, setPlatforms] = useState<string[]>(['web', 'backend']);
  const [fidelity, setFidelity] = useState<EstimatorOptions['fidelity']>('bespoke');
  const [timeline, setTimeline] = useState<EstimatorOptions['timeline']>('standard');

  const estimate = useMemo(() => {
    return calculateProjectEstimate(
      {
        projectType,
        platforms,
        fidelity,
        timeline,
      },
      customRates
    );
  }, [projectType, platforms, fidelity, timeline, customRates]);

  const togglePlatform = (platformId: string) => {
    if (platformId === 'web') return; // Web is minimum baseline
    setPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleApply = () => {
    const summary = `Estimated Scope: ${projectType.toUpperCase()} with [${platforms.join(', ')}] (Estimated Investment: $${estimate.minBudget.toLocaleString()} - $${estimate.maxBudget.toLocaleString()} across ${estimate.minWeeks}-${estimate.maxWeeks} weeks)`;
    if (onApplyEstimate) {
      onApplyEstimate(summary);
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contact';
      }
    }
  };

  return (
    <section id="estimator" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-4">
            <Calculator className="w-3.5 h-3.5 text-[#0d5363]" />
            <span>Interactive Project Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 font-serif tracking-tight text-balance">
            Transparent scope, timeline, and investment planning.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed font-normal">
            Configure your technical requirements to receive a realistic estimate modeled after our production engineering sprints. Zero surprises.
          </p>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Step 1: Project Type */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 block mb-4">
                1. Project Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'mvp', label: 'MVP Build', desc: 'Kickoff to Live' },
                  { id: 'saas', label: 'Enterprise SaaS', desc: 'High concurrency' },
                  { id: 'redesign', label: 'Web Overhaul', desc: 'Brand & UX refresh' },
                  { id: 'ai', label: 'AI Integration', desc: 'Agents & pipelines' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setProjectType(type.id as EstimatorOptions['projectType'])}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      projectType === type.id
                        ? 'bg-teal-50/80 border-[#004d6a] text-slate-950 shadow-sm ring-1 ring-[#004d6a]'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold font-serif">{type.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Platforms & System Modules */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 block mb-4">
                2. Target Platforms & Architectural Modules
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'web', label: 'Web Application', desc: 'React 19 / Next.js (Required)', locked: true },
                  { id: 'backend', label: 'Cloud Backend / API', desc: 'Microservices & Database' },
                  { id: 'mobile', label: 'Mobile App', desc: 'Flutter / Native Mobile' },
                  { id: 'ai-agent', label: 'Custom AI Agents', desc: 'LLM tools & orchestration' },
                  { id: 'design-system', label: 'Figma Design System', desc: 'Coded tokens & Storybook' },
                ].map((p) => {
                  const isSelected = platforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={p.locked}
                      onClick={() => togglePlatform(p.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        p.locked
                          ? 'bg-teal-50/40 border-teal-200 text-slate-700 cursor-default'
                          : isSelected
                          ? 'bg-teal-50/80 border-[#004d6a] text-slate-950 shadow-sm ring-1 ring-[#004d6a]'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-serif">{p.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">{p.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Design Fidelity */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 block mb-4">
                3. Design Fidelity & Motion Engineering
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'clean', label: 'Production Minimalist', desc: 'Fast, clean, ultra-legible typography' },
                  { id: 'bespoke', label: 'Bespoke Kinetics', desc: 'Micro-interactions & custom componentry' },
                  { id: 'award', label: 'Award-Winning Studio', desc: '3D spatial WebGL, bespoke kinetics' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFidelity(f.id as EstimatorOptions['fidelity'])}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      fidelity === f.id
                        ? 'bg-teal-50/80 border-[#004d6a] text-slate-950 shadow-sm ring-1 ring-[#004d6a]'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold font-serif">{f.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Velocity & Timeline */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 block mb-4">
                4. Execution Cadence
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'standard', label: 'Standard Velocity', desc: 'Bi-weekly sprint milestone demos' },
                  { id: 'fast', label: 'Fast-Track Dedicated Squad', desc: 'Compressed calendar timeline' },
                  { id: 'extended', label: 'Relaxed Pacing', desc: 'Phased discovery & build' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTimeline(t.id as EstimatorOptions['timeline'])}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      timeline === t.id
                        ? 'bg-teal-50/80 border-[#004d6a] text-slate-950 shadow-sm ring-1 ring-[#004d6a]'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold font-serif">{t.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Calculation Sticky Summary (5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200/90 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#004d6a] font-bold block">
                    Real-Time Model
                  </span>
                  <div className="text-xl font-bold text-slate-950 font-serif">
                    Scope Calculation
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#004d6a] text-xs font-bold flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                  <span>Sprint Rates</span>
                </div>
              </div>

              {/* Price Range Display */}
              <div className="mb-6">
                <span className="text-xs text-slate-500 block mb-1">Estimated Investment Range</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-mono tracking-tight tabular-nums">
                  ${estimate.minBudget.toLocaleString()} – ${estimate.maxBudget.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block leading-relaxed">
                  Milestone-based delivery sprints. Includes full IP transfer and post-launch bug warranty.
                </span>
              </div>

              {/* Delivery Cadence */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#004d6a]" />
                    <span>Estimated Timeline</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-950 font-mono">
                    {estimate.minWeeks} – {estimate.maxWeeks} Weeks
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Users className="w-3.5 h-3.5 text-[#004d6a]" />
                    <span>Squad Size</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-950 font-mono">
                    {estimate.recommendedTeam.length} Specialists
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2 mb-8 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400 block text-[11px] font-mono">
                  Sprint Deliverables & Guarantees:
                </span>
                <div className="space-y-2">
                  {estimate.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 text-xs">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#004d6a] hover:bg-[#093c47] active:scale-95 rounded-2xl shadow-xl shadow-[#004d6a]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#004d6a]"
              >
                <span>Lock In Scope & Discuss Project</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-300" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Non-binding estimate. Official proposal confirmed after discovery.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
