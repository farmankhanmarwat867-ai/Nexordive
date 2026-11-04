'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, CheckCircle2, ChevronRight, Code2, Cpu, Layout, Sparkles, X, Layers, Server, ShoppingBag, Smartphone, TrendingUp, Database } from 'lucide-react';
import { SERVICES } from '../data/agencyData';
import { ServiceItem } from '../types/agency';

interface ServicesBentoProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onSelectService }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'web-development':
      case 'web-engineering':
        return <Code2 className="w-5 h-5 text-cyan-300" />;
      case 'saas-development':
      case 'saas-architecture':
        return <Server className="w-5 h-5 text-sky-300" />;
      case 'shopify-development':
      case 'shopify-ecommerce':
        return <ShoppingBag className="w-5 h-5 text-emerald-300" />;
      case 'mobile-apps':
      case 'mobile-engineering':
        return <Smartphone className="w-5 h-5 text-teal-300" />;
      case 'ai-automation':
      case 'applied-ai':
        return <Cpu className="w-5 h-5 text-purple-300" />;
      case 'digital-marketing':
        return <TrendingUp className="w-5 h-5 text-amber-300" />;
      case 'graphic-design':
      case 'product-design':
        return <Layout className="w-5 h-5 text-rose-300" />;
      case 'custom-software':
        return <Database className="w-5 h-5 text-cyan-300" />;
      default:
        return <Code2 className="w-5 h-5 text-cyan-300" />;
    }
  };

  return (
    <section className="py-24 md:py-32 relative bg-[#093c47] text-white overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#004d6a]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 mb-4">
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>Full-Stack Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight leading-tight text-balance">
              Engineered for velocity, scale, and category leadership.
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            We operate as an agile embedded product squad, combining senior software architecture, human-centric design, and applied AI systems.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => {
            const colSpan = (index % 4 === 0 || index % 4 === 3) ? 'md:col-span-7' : 'md:col-span-5';

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`${colSpan} group relative rounded-3xl p-7 sm:p-8 bg-[#0f2b35]/80 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-900/30 hover:-translate-y-1.5`}
              >
                {/* Background decorative ambient gradient */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/[0.04] rounded-full blur-3xl group-hover:bg-cyan-400/[0.08] transition-colors pointer-events-none" />

                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                        {getServiceIcon(service.id)}
                      </span>
                      <span className="text-sm font-mono font-bold text-cyan-300/80 tracking-wider">
                        {service.number}
                      </span>
                    </div>

                    {/* Metric Highlight */}
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
                        {service.metric.value}
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium">
                        {service.metric.label}
                      </div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-cyan-300 mb-4">
                    {service.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  {/* Deliverables snippet */}
                  <div className="space-y-2.5 mb-6">
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Footer: Stack Badges and Action Trigger */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  {/* Stack text tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {service.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 bg-white/5 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Triggers */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="text-xs font-semibold text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
                    >
                      Full Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-400/20 hover:bg-cyan-400 text-cyan-200 hover:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>Inquire</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-[#004d6a] text-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-cyan-400/30 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl bg-white/10 text-cyan-300">
                  {getServiceIcon(selectedService.id)}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Discipline {selectedService.number}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                {selectedService.title}
              </h3>
              <p className="text-sm text-cyan-300 font-medium mb-4">
                {selectedService.tagline}
              </p>
              <p className="text-sm text-slate-200 leading-relaxed mb-6">
                {selectedService.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Scope & Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-mono text-cyan-200 bg-white/10 border border-white/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/15">
                <div>
                  <div className="text-xs text-slate-400">Benchmark Impact</div>
                  <div className="text-lg font-mono font-bold text-cyan-300">
                    {selectedService.metric.value} — {selectedService.metric.label}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    onSelectService(title);
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  Start This Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
