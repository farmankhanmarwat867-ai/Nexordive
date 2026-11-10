'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { DynamicIcon } from '../../common/DynamicIcon';
import { ActionSelector } from '../common/ActionSelector';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  PricingContent,
  PricingPlanItem,
  StreamerContent,
  StreamerSuite,
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
  const [editingSuiteId, setEditingSuiteId] = useState<string | null>(null);

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
    setEditingSuiteId(null);
    setFeedback(null);
  };

  // Report dirty state to parent
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty, handleSave, handleCancel);
    }
  }, [isDirty, onDirtyChange]);

  // Plan ordering
  const movePlan = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pricingDraft.plans.length) return;
    const updated = [...pricingDraft.plans];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updated.forEach((p, i) => {
      p.order = i + 1;
    });
    setPricingDraft({ ...pricingDraft, plans: updated });
  };

  // Suite ordering
  const moveSuite = (index: number, direction: 'up' | 'down') => {
    const suites = streamerDraft.suites || [];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= suites.length) return;
    const updated = [...suites];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updated.forEach((s, i) => {
      s.order = i + 1;
    });
    setStreamerDraft({ ...streamerDraft, suites: updated });
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-32">
      {/* Top Header Information */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h1 className="text-lg font-bold text-slate-900 font-display">
          Packages & Pricing Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage public pricing plans, streamer starting kits, broadcast suites, and assurance guarantees.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('website')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'website'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Website Packages ({pricingDraft.plans.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('streamer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'streamer'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Streamer Packages & Suites ({streamerDraft.startingCards.length} + {(streamerDraft.suites || []).length})
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
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                            Popular
                          </span>
                        )}
                        {!plan.visible && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                            Hidden
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{plan.turnaround || 'Standard delivery'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => movePlan(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePlan(idx, 'down')}
                        disabled={idx === pricingDraft.plans.length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = pricingDraft.plans.map((p) =>
                            p.id === plan.id ? { ...p, visible: !p.visible } : p
                          );
                          setPricingDraft({ ...pricingDraft, plans: updated });
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 cursor-pointer"
                        title={plan.visible ? 'Hide from public site' : 'Show on public site'}
                      >
                        {plan.visible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
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
                          if (window.confirm(`Delete plan "${plan.name}"?`)) {
                            const updated = pricingDraft.plans.filter((p) => p.id !== plan.id);
                            setPricingDraft({ ...pricingDraft, plans: updated });
                            if (editingPlanId === plan.id) setEditingPlanId(null);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {editingPlanId === plan.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Plan Name
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
                            Badge Label (e.g. Most Popular, Launch Fast)
                          </label>
                          <input
                            type="text"
                            value={plan.badge}
                            onChange={(e) => {
                              const updated = pricingDraft.plans.map((p) =>
                                p.id === plan.id ? { ...p, badge: e.target.value } : p
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

                      <ActionSelector
                        label="Button Destination / Action"
                        value={plan.buttonAction || 'contact'}
                        onChange={(action) => {
                          const updated = pricingDraft.plans.map((p) =>
                            p.id === plan.id ? { ...p, buttonAction: action } : p
                          );
                          setPricingDraft({ ...pricingDraft, plans: updated });
                        }}
                      />

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

          {/* Reassurance Banner Editor */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Pricing Reassurance Banner</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The guarantee strip displayed directly below the pricing plans table.
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pricingDraft.reassuranceBanner?.visible !== false}
                  onChange={(e) =>
                    setPricingDraft((prev) => ({
                      ...prev,
                      reassuranceBanner: {
                        text: prev.reassuranceBanner?.text || 'All packages include a mutual non-disclosure agreement (NDA), clean source code repository handover, and post-launch bug warranty.',
                        ctaLabel: prev.reassuranceBanner?.ctaLabel || 'Need Custom Scope?',
                        ctaAction: prev.reassuranceBanner?.ctaAction || 'contact',
                        visible: e.target.checked,
                      },
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>Visible</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reassurance Statement Text
              </label>
              <textarea
                rows={2}
                value={pricingDraft.reassuranceBanner?.text ?? ''}
                onChange={(e) =>
                  setPricingDraft((prev) => ({
                    ...prev,
                    reassuranceBanner: {
                      text: e.target.value,
                      ctaLabel: prev.reassuranceBanner?.ctaLabel || 'Need Custom Scope?',
                      ctaAction: prev.reassuranceBanner?.ctaAction || 'contact',
                      visible: prev.reassuranceBanner?.visible !== false,
                    },
                  }))
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={pricingDraft.reassuranceBanner?.ctaLabel ?? ''}
                  onChange={(e) =>
                    setPricingDraft((prev) => ({
                      ...prev,
                      reassuranceBanner: {
                        text: prev.reassuranceBanner?.text || '',
                        ctaLabel: e.target.value,
                        ctaAction: prev.reassuranceBanner?.ctaAction || 'contact',
                        visible: prev.reassuranceBanner?.visible !== false,
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <ActionSelector
                label="CTA Button Action"
                value={pricingDraft.reassuranceBanner?.ctaAction || 'contact'}
                onChange={(action) =>
                  setPricingDraft((prev) => ({
                    ...prev,
                    reassuranceBanner: {
                      text: prev.reassuranceBanner?.text || '',
                      ctaLabel: prev.reassuranceBanner?.ctaLabel || 'Need Custom Scope?',
                      ctaAction: action,
                      visible: prev.reassuranceBanner?.visible !== false,
                    },
                  }))
                }
              />
            </div>
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

          {/* Broadcast Turnkey Suites Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Broadcast Turnkey Suites ({(streamerDraft.suites || []).length})
                </h2>
                <p className="text-xs text-slate-500">
                  All-inclusive production packages shown on the Streamer Assets page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSuiteId = `suite-${Date.now()}`;
                  const currentSuites = streamerDraft.suites || [];
                  const newSuite: StreamerSuite = {
                    id: newSuiteId,
                    name: 'New Turnkey Suite',
                    turnaround: '7–10 Business Days',
                    description: 'A complete broadcast overhaul engineered for competitive creators and esports organizations.',
                    items: [
                      'Custom 60fps WebM stinger transitions with audio',
                      'Starting Soon & Intermission animated loops',
                      'Modular webcam HUDs & sponsor badges',
                    ],
                    popular: false,
                    order: currentSuites.length + 1,
                    visible: true,
                    buttonLabel: 'Inquire Broadcast Suite',
                    buttonAction: 'contact',
                  };
                  setStreamerDraft({
                    ...streamerDraft,
                    suites: [...currentSuites, newSuite],
                  });
                  setEditingSuiteId(newSuiteId);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Suite</span>
              </button>
            </div>

            {/* Suites Section Eyebrow & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suites Section Eyebrow
                </label>
                <input
                  type="text"
                  value={streamerDraft.suitesSectionEyebrow ?? 'Full Production'}
                  onChange={(e) => setStreamerDraft({ ...streamerDraft, suitesSectionEyebrow: e.target.value })}
                  placeholder="Full Production"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suites Section Title
                </label>
                <input
                  type="text"
                  value={streamerDraft.suitesSectionTitle ?? 'All-Inclusive Broadcast Suites'}
                  onChange={(e) => setStreamerDraft({ ...streamerDraft, suitesSectionTitle: e.target.value })}
                  placeholder="All-Inclusive Broadcast Suites"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* Suites List */}
            <div className="space-y-3 pt-2">
              {(!streamerDraft.suites || streamerDraft.suites.length === 0) ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                  No broadcast suites defined. Click "Add Suite" to create one.
                </div>
              ) : (
                streamerDraft.suites.map((suite, idx) => (
                  <div
                    key={suite.id}
                    className={`p-4 rounded-xl border transition-all ${
                      editingSuiteId === suite.id
                        ? 'border-indigo-500 bg-indigo-50/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{suite.name}</span>
                          {suite.popular && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Staff Pick</span>
                            </span>
                          )}
                          {suite.visible === false && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                              Hidden
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">Turnaround: {suite.turnaround}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveSuite(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSuite(idx, 'down')}
                          disabled={idx === (streamerDraft.suites?.length || 0) - 1}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = (streamerDraft.suites || []).map((s) =>
                              s.id === suite.id ? { ...s, visible: s.visible === false ? true : false } : s
                            );
                            setStreamerDraft({ ...streamerDraft, suites: updated });
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 cursor-pointer"
                          title={suite.visible !== false ? 'Hide from public site' : 'Show on public site'}
                        >
                          {suite.visible !== false ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingSuiteId(editingSuiteId === suite.id ? null : suite.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          {editingSuiteId === suite.id ? 'Close' : 'Edit'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete broadcast suite "${suite.name}"?`)) {
                              setStreamerDraft((prev) => ({
                                ...prev,
                                suites: (prev.suites || []).filter((s) => s.id !== suite.id),
                              }));
                              if (editingSuiteId === suite.id) setEditingSuiteId(null);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Suite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingSuiteId === suite.id && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Suite Name
                            </label>
                            <input
                              type="text"
                              value={suite.name}
                              onChange={(e) => {
                                const updated = (streamerDraft.suites || []).map((s) =>
                                  s.id === suite.id ? { ...s, name: e.target.value } : s
                                );
                                setStreamerDraft({ ...streamerDraft, suites: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Turnaround (e.g. 7–10 Business Days)
                            </label>
                            <input
                              type="text"
                              value={suite.turnaround}
                              onChange={(e) => {
                                const updated = (streamerDraft.suites || []).map((s) =>
                                  s.id === suite.id ? { ...s, turnaround: e.target.value } : s
                                );
                                setStreamerDraft({ ...streamerDraft, suites: updated });
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
                            value={suite.description}
                            onChange={(e) => {
                              const updated = (streamerDraft.suites || []).map((s) =>
                                s.id === suite.id ? { ...s, description: e.target.value } : s
                              );
                              setStreamerDraft({ ...streamerDraft, suites: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Included Deliverables (one per line)
                          </label>
                          <textarea
                            rows={4}
                            value={(suite.items || []).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n');
                              const updated = (streamerDraft.suites || []).map((s) =>
                                s.id === suite.id ? { ...s, items: lines } : s
                              );
                              setStreamerDraft({ ...streamerDraft, suites: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={suite.buttonLabel || 'Inquire Broadcast Suite'}
                              onChange={(e) => {
                                const updated = (streamerDraft.suites || []).map((s) =>
                                  s.id === suite.id ? { ...s, buttonLabel: e.target.value } : s
                                );
                                setStreamerDraft({ ...streamerDraft, suites: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                            />
                          </div>

                          <ActionSelector
                            label="Button Destination / Action"
                            value={suite.buttonAction || 'contact'}
                            onChange={(action) => {
                              const updated = (streamerDraft.suites || []).map((s) =>
                                s.id === suite.id ? { ...s, buttonAction: action } : s
                              );
                              setStreamerDraft({ ...streamerDraft, suites: updated });
                            }}
                          />
                        </div>

                        <div className="pt-2">
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(suite.popular)}
                              onChange={(e) => {
                                const updated = (streamerDraft.suites || []).map((s) =>
                                  s.id === suite.id ? { ...s, popular: e.target.checked } : s
                                );
                                setStreamerDraft({ ...streamerDraft, suites: updated });
                              }}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span>Highlight as "Staff Pick"</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
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
