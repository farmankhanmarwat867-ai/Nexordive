'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { PricingPlanItem } from '../types/content';

interface PricingProps {
  onSelectPackage?: (packageName: string, priceRange: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  const { content } = useAdmin();
  const pricingData = content?.pricing;

  const rawPlans = pricingData?.plans || [];
  const plans = rawPlans
    .filter((p: PricingPlanItem) => p.visible !== false)
    .sort((a: PricingPlanItem, b: PricingPlanItem) => (a.order ?? 0) - (b.order ?? 0));

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
    <section id="pricing" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span>{pricingData?.sectionEyebrow || 'Transparent Investment'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight text-balance">
              {pricingData?.sectionTitle || 'Predictable packages, world-class execution.'}
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            {pricingData?.sectionDescription ||
              'Transparent pricing without surprise hourly overages. Every package includes direct principal engineer access, strict milestones, and complete IP handover.'}
          </p>
        </div>

        {/* Dynamic Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan: PricingPlanItem, index: number) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                plan.popular
                  ? 'border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-indigo-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Highlight ribbon for popular card */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{plan.badge || 'Most Popular'}</span>
                  </div>
                </div>
              )}

              <div>
                {/* Badge if not popular */}
                {!plan.popular && plan.badge && (
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mb-3 border border-slate-200/60">
                    {plan.badge}
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-slate-950 font-display mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display tracking-tight">
                    {plan.price}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {plan.billing}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Features List */}
                {plan.features && plan.features.length > 0 && (
                  <div className="space-y-3 mb-6 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Scope Included
                    </span>
                    {plan.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: plan.accentColor || '#4F46E5' }}
                        />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Turnaround & Action CTA */}
              <div className="pt-6 border-t border-slate-100 mt-2 space-y-4">
                {plan.turnaround && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Turnaround:</span>
                    <span className="font-semibold text-slate-900">{plan.turnaround}</span>
                  </div>
                )}

                <button
                  onClick={() => handleDiscuss(plan.name, plan.price)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 hover:shadow-indigo-600/30'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{plan.buttonText || 'Discuss Package'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
