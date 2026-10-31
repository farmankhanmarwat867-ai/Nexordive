'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { PricingPlanItem } from '../types/content';
import { executeAction } from '../utils/actionHandler';

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
              'Zero surprise hourly overages. Every package includes direct engineer communication, weekly demos, full IP assignment, and post-launch bug warranty.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-indigo-50/50 via-white to-white border-2 border-indigo-600 shadow-xl shadow-indigo-500/10 scale-100 lg:-translate-y-2'
                  : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-indigo-600/30">
                  <Sparkles className="w-3 h-3" />
                  <span>{plan.badge || 'Most Popular'}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      plan.popular
                        ? 'bg-indigo-100/70 text-indigo-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {plan.badge || 'Package'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <div className="text-3xl font-extrabold text-slate-950 font-display tracking-tight">
                    {plan.price}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    {plan.billing}
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full mb-6" />

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.popular ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {plan.turnaround && (
                  <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
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

        {/* Reassurance Banner */}
        {pricingData?.reassuranceBanner?.visible !== false && (
          <div className="mt-14 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>
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
              className="text-indigo-600 hover:text-indigo-700 font-semibold whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer"
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
