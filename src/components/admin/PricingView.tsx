'use client';

import React, { useState } from 'react';
import { DollarSign, Check, ToggleLeft, ToggleRight, Sparkles, CheckCircle2, Save } from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';

export const PricingView: React.FC = () => {
  const { pricingPlans, updatePricingPlan, services, toggleService } = useAdmin();
  const [successToast, setSuccessToast] = useState('');

  const handlePriceChange = (id: string, newPrice: string) => {
    updatePricingPlan(id, { price: newPrice });
    setSuccessToast(`Updated price for ${id}`);
    setTimeout(() => setSuccessToast(''), 2500);
  };

  const handleTurnaroundChange = (id: string, newTurnaround: string) => {
    updatePricingPlan(id, { turnaround: newTurnaround });
    setSuccessToast(`Updated turnaround for ${id}`);
    setTimeout(() => setSuccessToast(''), 2500);
  };

  const handlePopularToggle = (id: string, currentPopular: boolean) => {
    updatePricingPlan(id, { popular: !currentPopular });
    setSuccessToast(`Toggled popular badge`);
    setTimeout(() => setSuccessToast(''), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Services & Pricing Controller
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update package prices, turnaround guarantees, and toggle frontend service visibility.
          </p>
        </div>

        {successToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Part 1: Service Visibility Switches */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 font-display mb-1">
          Frontend Service Visibility Switches
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Toggle any core service off if you are temporarily at capacity or restructuring your offerings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                service.enabled
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-100/60 border-slate-200/60 opacity-60'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-indigo-600 uppercase font-semibold block">
                  {service.category}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {service.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleService(service.id)}
                className="cursor-pointer focus:outline-none"
                title={service.enabled ? 'Disable service' : 'Enable service'}
              >
                {service.enabled ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Live
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300">
                    Hidden
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Pricing Updater Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Live Package Pricing & Turnaround Updater
          </h2>
          <p className="text-xs text-slate-500">
            Changes made here instantly reflect on the frontend Pricing section cards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl bg-white border flex flex-col justify-between shadow-xs ${
                plan.popular ? 'border-indigo-400 ring-2 ring-indigo-500/10' : 'border-slate-200/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {plan.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePopularToggle(plan.id, plan.popular)}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    {plan.popular ? 'Starred' : 'Set Popular'}
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display mb-3">
                  {plan.name}
                </h3>

                {/* Editable Price Field */}
                <div className="space-y-3 mb-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">
                      Display Price Tier:
                    </label>
                    <input
                      type="text"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">
                      Turnaround SLA:
                    </label>
                    <input
                      type="text"
                      value={plan.turnaround}
                      onChange={(e) => handleTurnaroundChange(plan.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Features preview */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-400 block mb-1">Included Features:</span>
                  {plan.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Auto-persisted to LocalStore</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
