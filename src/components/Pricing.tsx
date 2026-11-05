'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles, Shield, DollarSign } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { PricingPlanItem } from '../types/content';
import { executeAction } from '../utils/actionHandler';

interface PricingProps {
  onSelectPackage?: (packageName: string, priceRange: string) => void;
  onViewAll?: () => void;
  limitFeatures?: number;
  compact?: boolean;
}

export const Pricing: React.FC<PricingProps> = ({
  onSelectPackage,
  onViewAll,
  limitFeatures,
  compact,
}) => {
  const { content } = useAdmin();
  const pricingData = content?.pricing;

  const rawPlans = pricingData?.plans || [];
  const plans = rawPlans
    .filter((p: PricingPlanItem) => p.visible !== false)
    .sort((a: PricingPlanItem, b: PricingPlanItem) => (a.order ?? 0) - (b.order ?? 0));

  // Determine feature limit (default to 3 when rendered on home landing page or when compact=true)
  const isCompact = compact ?? !!onViewAll;
  const featureLimit = limitFeatures !== undefined ? limitFeatures : (isCompact ? 3 : undefined);

  const handleDiscuss = (planName: string, price: string) => {
    if (onSelectPackage) {
      onSelectPackage(planName, price);
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
    <section id="pricing" className="py-20 sm:py-24 lg:py-28 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Section Header - Centered */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-3.5">
            <DollarSign className="w-3.5 h-3.5 text-[#0d5363]" />
            <span>{pricingData?.sectionEyebrow || 'Transparent Investment'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance mb-4">
            {pricingData?.sectionTitle || 'Predictable packages, world-class execution.'}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
            {pricingData?.sectionDescription ||
              'Zero surprise hourly overages. Every package includes direct engineer communication, weekly demos, full IP assignment, and post-launch bug warranty.'}
          </p>
        </div>

        {/* Pricing Cards Grid - Compact & Sleek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, index) => {
            const displayedFeatures = featureLimit
              ? plan.features.slice(0, featureLimit)
              : plan.features;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-teal-50/60 via-white to-white border-2 border-[#004d6a] shadow-xl shadow-[#004d6a]/15 hover:-translate-y-1.5'
                    : 'bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0d5363]/40 hover:-translate-y-1.5'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#004d6a] text-white text-[10.5px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-[#004d6a]/30">
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    <span>{plan.badge || 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        plan.popular
                          ? 'bg-teal-100/70 text-[#004d6a] font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {plan.badge || 'Package'}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mb-1.5 line-clamp-1">
                    {plan.name}
                  </h3>

                  <div className="mb-4">
                    <div className="text-2xl sm:text-[26px] font-extrabold text-slate-950 font-mono tracking-tight leading-tight">
                      {plan.price}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {plan.billing}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full mb-4" />

                  <ul className="space-y-2 mb-5">
                    {displayedFeatures.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-start gap-2 text-xs text-slate-600 leading-snug"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            plan.popular ? 'text-teal-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="line-clamp-2">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {plan.turnaround && (
                    <div className="mb-3.5 py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10.5px] text-slate-600 flex items-center justify-between">
                      <span className="text-slate-500">Turnaround:</span>
                      <span className="font-semibold text-slate-900 font-mono">{plan.turnaround}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleDiscuss(plan.name, plan.price)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                      plan.popular
                        ? 'bg-[#004d6a] text-white hover:bg-[#093c47] shadow-lg shadow-[#004d6a]/20 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5'
                    }`}
                  >
                    <span>{plan.buttonText || 'Discuss Package'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All CTA Button - Below Cards */}
        {onViewAll && (
          <div className="flex justify-center mt-12 mb-6">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#004d6a]/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-400/20 group"
            >
              <span>Explore All Pricing Tiers</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Reassurance Banner */}
        {pricingData?.reassuranceBanner?.visible !== false && (
          <div className="mt-14 p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#004d6a] shrink-0" />
              <span className="leading-relaxed">
                {pricingData?.reassuranceBanner?.text ||
                  'All packages include a mutual non-disclosure agreement (NDA), clean source code repository handover, and post-launch bug warranty.'}
              </span>
            </div>
            <button
              onClick={() => {
                const action = pricingData?.reassuranceBanner?.ctaAction;
                if (action && action !== 'contact') {
                  executeAction(action);
                } else {
                  handleDiscuss('Custom Scope / Tailored Plan', 'Custom');
                }
              }}
              className="text-[#004d6a] hover:text-[#093c47] font-bold whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{pricingData?.reassuranceBanner?.ctaLabel || 'Need Custom Scope?'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
