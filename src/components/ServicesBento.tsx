import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronRight, Code2, Cpu, Layout, Sparkles } from 'lucide-react';
import { SERVICES } from '../data/agencyData';
import { ServiceItem } from '../types/agency';

interface ServicesBentoProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onSelectService }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'web-engineering':
        return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'product-design':
        return <Layout className="w-5 h-5 text-sky-400" />;
      case 'applied-ai':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'brand-motion':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      default:
        return <Code2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section id="services" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
              Capabilities & Offerings
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight text-balance">
              Engineered for velocity, scale, and category leadership.
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            We operate as a high-velocity embedded product squad, bringing senior architecture, design, and AI engineering under one disciplined roof.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {SERVICES.map((service, index) => {
            // Asymmetric layout: Card 0 and 3 take 7 columns, Card 1 and 2 take 5 columns
            const colSpan = index === 0 || index === 3 ? 'md:col-span-7' : 'md:col-span-5';

            return (
              <div
                key={service.id}
                className={`${colSpan} group relative rounded-2xl p-8 bg-[#0D111A]/90 border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-indigo-500/10`}
              >
                {/* Background decorative ambient gradient */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.03] rounded-full blur-3xl group-hover:bg-indigo-500/[0.08] transition-colors pointer-events-none" />

                <div>
                  {/* Top Bar inside Card: Natural Editorial Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10">
                        {getServiceIcon(service.id)}
                      </span>
                      <span className="text-sm font-bold text-slate-500 tracking-wider">
                        {service.number}.
                      </span>
                    </div>

                    {/* Metric Highlight */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-white font-display tabular-nums">
                        {service.metric.value}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {service.metric.label}
                      </div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-bold text-white font-display mb-2 group-hover:text-indigo-200 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm font-medium text-indigo-400 mb-4">
                    {service.tagline}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables snippet */}
                  <div className="space-y-2 mb-6">
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Footer: Stack Badges and Action Trigger */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
                  {/* Stack text tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-white/[0.03] border border-white/[0.05]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Expand Modal / Inquiry Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>View Scope</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectService(service.title)}
                      className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                      title={`Inquire about ${service.title}`}
                      aria-label={`Inquire about ${service.title}`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedService(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-2xl bg-[#0F1420] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  {getServiceIcon(selectedService.id)}
                </span>
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">
                    Capability {selectedService.number}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {selectedService.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedService.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Complete Scope & Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded bg-white/[0.02] border border-white/[0.05] text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded text-xs font-mono bg-white/[0.05] text-slate-200 border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <span className="text-xs text-slate-400 block">Verified Impact:</span>
                <span className="text-base font-bold text-emerald-400 tabular-nums">
                  {selectedService.metric.value} {selectedService.metric.label}
                </span>
              </div>
              <button
                onClick={() => {
                  const title = selectedService.title;
                  setSelectedService(null);
                  onSelectService(title);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Request Scope for this Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
