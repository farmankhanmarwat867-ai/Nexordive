'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { DynamicIcon } from '../../common/DynamicIcon';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Radio,
  ChevronDown,
  ChevronUp,
  Calculator,
} from 'lucide-react';
import {
  PricingContent,
  PricingPlanItem,
  StreamerContent,
} from '../../../types/content';

interface PricingEditorViewProps {
  onDirtyChange?: (dirty: boolean, saveFn: () => Promise<boolean>, discardFn: () => void) => void;
}

export const PricingEditorView: React.FC<PricingEditorViewProps> = ({ onDirtyChange }) => {
  const { content, updateContentSection } = useAdmin();

  // Active top tab: Website Packages vs Streamer Packages
  const [activeTab, setActiveTab] = useState<'website' | 'streamer'>('website');

  // Deep-cloned draft states
  const [pricingDraft, setPricingDraft] = useState<PricingContent>(() => structuredClone(content.pricing));
  const [streamerDraft, setStreamerDraft] = useState<StreamerContent>(() => structuredClone(content.streamer));

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Expanded items
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingStreamerId, setEditingStreamerId] = useState<string | null>(null);
  const [showAdvancedRates, setShowAdvancedRates] = useState(false);

  useEffect(() => {
    setPricingDraft(structuredClone(content.pricing));
    setStreamerDraft(structuredClone(content.streamer));
  }, [content.pricing, content.streamer]);

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(pricingDraft) !== JSON.stringify(content.pricing) ||
      JSON.stringify(streamerDraft) !== JSON.stringify(content.streamer)
    );
  }, [pricingDraft, streamerDraft, content.pricing, content.streamer]);

  // Native browser beforeunload warning when dirty
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res1 = updateContentSection('pricing', pricingDraft);
      const res2 = updateContentSection('streamer', streamerDraft);

      if (res1.success && res2.success) {
        setFeedback({ type: 'success', message: 'Pricing and packages saved! Website updated.' });
        setTimeout(() => setFeedback(null), 3500);
        return true;
      } else {
        setFeedback({ type: 'error', message: res1.error || res2.error || 'Could not save pricing.' });
        return false;
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Unexpected error saving pricing.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPricingDraft(structuredClone(content.pricing));
    setStreamerDraft(structuredClone(content.streamer));
    setEditingPlanId(null);
    setEditingStreamerId(null);
    setFeedback(null);
  };

  // Report dirty state to parent
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty, handleSave, handleCancel);
    }
  }, [isDirty, onDirtyChange]);

  return (
    <div className="space-y-6 pb-28 sm:pb-32">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h1 className="text-lg font-bold text-slate-900 font-display">
          Packages & Pricing
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your website service pricing tiers, streamer creator bundles, and estimator baseline rates.
        </p>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'website'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Website Packages ({pricingDraft.plans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('streamer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'streamer'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Streamer & Creator Packages ({streamerDraft.startingCards.length})</span>
        </button>
      </div>

      {/* 1. WEBSITE PACKAGES */}
      {activeTab === 'website' && (
        <div className="space-y-6">
          {/* Section Header Copy */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Pricing Section Header
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Tag
                </label>
                <input
                  type="text"
                  value={pricingDraft.sectionEyebrow}
                  onChange={(e) => setPricingDraft({ ...pricingDraft, sectionEyebrow: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={pricingDraft.sectionTitle}
                  onChange={(e) => setPricingDraft({ ...pricingDraft, sectionTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={pricingDraft.sectionDescription}
                onChange={(e) => setPricingDraft({ ...pricingDraft, sectionDescription: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Pricing Plans List */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Pricing Plans
                </h2>
                <p className="text-xs text-slate-500">
                  Cards displayed on the Pricing and Home pages.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `plan-${Date.now()}`;
                  const newPlan: PricingPlanItem = {
                    id: newId,
                    name: 'Custom Package',
                    price: '$450 – $900',
                    billing: 'One-time investment',
                    badge: 'Bespoke',
                    popular: false,
                    description: 'Engineered for brands and startups needing tailored digital deliverables.',
                    features: ['Responsive platform', 'Custom design tokens', 'Lead capture setup'],
                    turnaround: '5–10 Business Days',
                    accentColor: '#4F46E5',
                    buttonText: 'Discuss Package',
                    buttonAction: 'contact',
                    isCustomQuote: false,
                    visible: true,
                    order: pricingDraft.plans.length + 1,
                  };
                  setPricingDraft({ ...pricingDraft, plans: [...pricingDraft.plans, newPlan] });
                  setEditingPlanId(newId);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Package</span>
              </button>
            </div>

            <div className="space-y-3">
              {pricingDraft.plans.map((plan, idx) => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border transition-all ${
                    editingPlanId === plan.id
                      ? 'border-indigo-500 bg-indigo-50/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{plan.name}</span>
                        <span className="text-xs font-bold text-indigo-600 font-mono">({plan.price})</span>
                        {plan.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {plan.billing} · {plan.turnaround}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const list = [...pricingDraft.plans];
                          const temp = list[idx];
                          list[idx] = list[idx - 1];
                          list[idx - 1] = temp;
                          list.forEach((p, i) => { p.order = i + 1; });
                          setPricingDraft({ ...pricingDraft, plans: list });
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === pricingDraft.plans.length - 1}
                        onClick={() => {
                          const list = [...pricingDraft.plans];
                          const temp = list[idx];
                          list[idx] = list[idx + 1];
                          list[idx + 1] = temp;
                          list.forEach((p, i) => { p.order = i + 1; });
                          setPricingDraft({ ...pricingDraft, plans: list });
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingPlanId(editingPlanId === plan.id ? null : plan.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        {editingPlanId === plan.id ? 'Close' : 'Edit'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete package "${plan.name}"?`)) {
                            setPricingDraft({
                              ...pricingDraft,
                              plans: pricingDraft.plans.filter((p) => p.id !== plan.id),
                            });
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Editing Panel */}
                  {editingPlanId === plan.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Package Name
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const updated = pricingDraft.plans.map((p) =>
                                p.id === plan.id ? { ...p, name: e.target.value } : p
                              );
                              setPricingDraft({ ...pricingDraft, plans: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Price Display (e.g. $99 – $299)
                          </label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => {
                              const updated = pricingDraft.plans.map((p) =>
                                p.id === plan.id ? { ...p, price: e.target.value } : p
                              );
                              setPricingDraft({ ...pricingDraft, plans: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Billing Terms (e.g. One-time investment)
                          </label>
                          <input
                            type="text"
                            value={plan.billing}
                            onChange={(e) => {
                              const updated = pricingDraft.plans.map((p) =>
                                p.id === plan.id ? { ...p, billing: e.target.value } : p
                              );
                              setPricingDraft({ ...pricingDraft, plans: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Turnaround Time
                          </label>
                          <input
                            type="text"
                            value={plan.turnaround}
                            onChange={(e) => {
                              const updated = pricingDraft.plans.map((p) =>
                                p.id === plan.id ? { ...p, turnaround: e.target.value } : p
                              );
                              setPricingDraft({ ...pricingDraft, plans: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={plan.buttonText}
                            onChange={(e) => {
                              const updated = pricingDraft.plans.map((p) =>
                                p.id === plan.id ? { ...p, buttonText: e.target.value } : p
                              );
                              setPricingDraft({ ...pricingDraft, plans: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={plan.description}
                          onChange={(e) => {
                            const updated = pricingDraft.plans.map((p) =>
                              p.id === plan.id ? { ...p, description: e.target.value } : p
                            );
                            setPricingDraft({ ...pricingDraft, plans: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Features (one per line)
                        </label>
                        <textarea
                          rows={4}
                          value={plan.features.join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n');
                            const updated = pricingDraft.plans.map((p) =>
                              p.id === plan.id ? { ...p, features: lines } : p
                            );
                            setPricingDraft({ ...pricingDraft, plans: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.popular}
                            onChange={(e) => {
                              const updated = pricingDraft.plans.map((p) =>
                                p.id === plan.id ? { ...p, popular: e.target.checked } : p
                              );
                              setPricingDraft({ ...pricingDraft, plans: updated });
                            }}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span>Highlight as "Most Popular" Plan</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Advanced Rates & Estimator */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setShowAdvancedRates(!showAdvancedRates)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>Advanced: Project Estimator Calculation Rates</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the baseline costs and delivery timelines used by the website's interactive scope estimator.
                </p>
              </div>
              <div className="p-1 rounded-lg text-slate-400">
                {showAdvancedRates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showAdvancedRates && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(pricingDraft.estimatorRates.baseRates).map(([key, rate]) => (
                    <div key={key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold uppercase text-slate-800 block">
                        Category: {key.toUpperCase()}
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-0.5">Min Cost ($)</label>
                          <input
                            type="number"
                            value={rate.min}
                            onChange={(e) => {
                              const updated = {
                                ...pricingDraft.estimatorRates.baseRates,
                                [key]: {
                                  ...pricingDraft.estimatorRates.baseRates[key],
                                  min: Number(e.target.value),
                                },
                              };
                              setPricingDraft({
                                ...pricingDraft,
                                estimatorRates: { ...pricingDraft.estimatorRates, baseRates: updated },
                              });
                            }}
                            className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-0.5">Max Cost ($)</label>
                          <input
                            type="number"
                            value={rate.max}
                            onChange={(e) => {
                              const updated = {
                                ...pricingDraft.estimatorRates.baseRates,
                                [key]: {
                                  ...pricingDraft.estimatorRates.baseRates[key],
                                  max: Number(e.target.value),
                                },
                              };
                              setPricingDraft({
                                ...pricingDraft,
                                estimatorRates: { ...pricingDraft.estimatorRates, baseRates: updated },
                              });
                            }}
                            className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. STREAMER PACKAGES */}
      {activeTab === 'streamer' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Streamer Section Header
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Tag
                </label>
                <input
                  type="text"
                  value={streamerDraft.sectionEyebrow}
                  onChange={(e) => setStreamerDraft({ ...streamerDraft, sectionEyebrow: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={streamerDraft.sectionTitle}
                  onChange={(e) => setStreamerDraft({ ...streamerDraft, sectionTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={streamerDraft.sectionDescription}
                onChange={(e) => setStreamerDraft({ ...streamerDraft, sectionDescription: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Platform Starter Cards */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Platform Starter Cards ({streamerDraft.startingCards.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Twitch, Kick, YouTube, and VTuber creator cards.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {streamerDraft.startingCards.map((card) => (
                <div key={card.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: card.accentColor || '#9333EA' }}
                      >
                        <DynamicIcon name={card.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{card.platform}</span>
                        <span className="text-[11px] text-slate-500">{card.startingPrice}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingStreamerId(editingStreamerId === card.id ? null : card.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      {editingStreamerId === card.id ? 'Close' : 'Edit'}
                    </button>
                  </div>

                  {editingStreamerId === card.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Platform Name
                          </label>
                          <input
                            type="text"
                            value={card.platform}
                            onChange={(e) => {
                              const updated = streamerDraft.startingCards.map((c) =>
                                c.id === card.id ? { ...c, platform: e.target.value } : c
                              );
                              setStreamerDraft({ ...streamerDraft, startingCards: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Price Display (e.g. From $29)
                          </label>
                          <input
                            type="text"
                            value={card.startingPrice}
                            onChange={(e) => {
                              const updated = streamerDraft.startingCards.map((c) =>
                                c.id === card.id ? { ...c, startingPrice: e.target.value } : c
                              );
                              setStreamerDraft({ ...streamerDraft, startingCards: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) => {
                            const updated = streamerDraft.startingCards.map((c) =>
                              c.id === card.id ? { ...c, description: e.target.value } : c
                            );
                            setStreamerDraft({ ...streamerDraft, startingCards: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Features (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={card.features.join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n');
                            const updated = streamerDraft.startingCards.map((c) =>
                              c.id === card.id ? { ...c, features: lines } : c
                            );
                            setStreamerDraft({ ...streamerDraft, startingCards: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Action Bar */}
      <EditorActionBar
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        feedback={feedback}
        sectionName="Packages & Pricing"
      />
    </div>
  );
};
