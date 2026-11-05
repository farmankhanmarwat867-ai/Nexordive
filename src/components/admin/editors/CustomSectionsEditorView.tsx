'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Zap,
  TrendingUp,
  FileText,
  Video,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CustomSectionBlock,
  CustomBlockType,
  FaqItem,
  FeatureBlockItem,
  StatBlockItem,
} from '../../../types/content';
import { IconPicker } from '../IconPicker';
import { DynamicIcon } from '../../common/DynamicIcon';
import { ActionSelector } from '../common/ActionSelector';

interface CustomSectionsEditorViewProps {
  customSections: CustomSectionBlock[];
  onChange: (updated: CustomSectionBlock[]) => void;
  onOpenCreateModal: () => void;
  activeBlockId: string | null;
  onSetActiveBlockId: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
}

const TYPE_METADATA: Record<
  CustomBlockType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  faq: { label: 'FAQ Accordion', icon: HelpCircle, color: '#0d5363' },
  features: { label: 'Feature Grid', icon: Sparkles, color: '#4f46e5' },
  banner: { label: 'Promo Banner', icon: Zap, color: '#0284c7' },
  stats: { label: 'Stats & Numbers', icon: TrendingUp, color: '#059669' },
  'rich-text': { label: 'Story Split', icon: FileText, color: '#d97706' },
  video: { label: 'Video Showcase', icon: Video, color: '#dc2626' },
};

export const CustomSectionsEditorView: React.FC<CustomSectionsEditorViewProps> = ({
  customSections,
  onChange,
  onOpenCreateModal,
  activeBlockId,
  onSetActiveBlockId,
  onDeleteBlock,
}) => {
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(() => {
    return activeBlockId || (customSections.length > 0 ? customSections[0].id : null);
  });

  // Re-sync with activeBlockId prop when parent navigates
  React.useEffect(() => {
    if (activeBlockId) {
      setExpandedBlockId(activeBlockId);
    }
  }, [activeBlockId]);

  const updateBlock = (blockId: string, updater: (prev: CustomSectionBlock) => CustomSectionBlock) => {
    const updated = customSections.map((b) => (b.id === blockId ? updater(b) : b));
    onChange(updated);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const list = [...customSections];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => {
      item.order = idx + 1;
    });
    onChange(list);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 font-display">
              Custom Block Builder (No-Code)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create custom interactive blocks (FAQs, feature matrices, promo banners, stats grids, and video reels) and place them anywhere on your homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all cursor-pointer self-start sm:self-auto shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Block</span>
        </button>
      </div>

      {/* Empty State */}
      {customSections.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Custom Blocks Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Build your first custom section with one click! Choose from FAQs, feature grids, promo banners, stats milestones, and more.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Block</span>
          </button>
        </div>
      ) : (
        /* Blocks List */
        <div className="space-y-4">
          {customSections.map((block, idx) => {
            const isExpanded = expandedBlockId === block.id;
            const meta = TYPE_METADATA[block.type] || {
              label: 'Custom Block',
              icon: Sparkles,
              color: '#4f46e5',
            };
            const Icon = meta.icon;

            return (
              <div
                key={block.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
              >
                {/* Block Card Header Bar */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {block.title}
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        {!block.visible && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                            Hidden
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 truncate block mt-0.5">
                        Theme: <strong className="capitalize">{block.backgroundColor || 'white'}</strong>
                        {block.description ? ` · ${block.description}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() =>
                        updateBlock(block.id, (prev) => ({ ...prev, visible: !prev.visible }))
                      }
                      title={block.visible ? 'Hide from live page' : 'Show on live page'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
                    >
                      {block.visible ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Move Up/Down */}
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveBlock(idx, 'up')}
                        title="Move Up"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === customSections.length - 1}
                        onClick={() => moveBlock(idx, 'down')}
                        title="Move Down"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Expand/Collapse */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = isExpanded ? null : block.id;
                        setExpandedBlockId(next);
                        onSetActiveBlockId(next);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isExpanded
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span>{isExpanded ? 'Collapse' : 'Configure'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteBlock(block.id)}
                      title="Delete Block"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Block Editor Form */}
                {isExpanded && (
                  <div className="p-6 space-y-6 bg-white animate-in fade-in duration-150">
                    {/* General Settings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Eyebrow Tag
                        </label>
                        <input
                          type="text"
                          value={block.eyebrow || ''}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({ ...prev, eyebrow: e.target.value }))
                          }
                          placeholder="e.g. ANSWERS & CLARITY"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 uppercase tracking-wider font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({ ...prev, title: e.target.value }))
                          }
                          className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Section Description
                        </label>
                        <textarea
                          rows={2}
                          value={block.description || ''}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({ ...prev, description: e.target.value }))
                          }
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Background Color
                        </label>
                        <select
                          value={block.backgroundColor || 'white'}
                          onChange={(e) =>
                            updateBlock(block.id, (prev) => ({
                              ...prev,
                              backgroundColor: e.target.value as any,
                            }))
                          }
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="white">Clean White</option>
                          <option value="slate">Light Slate (#f8fafc)</option>
                          <option value="dark">Midnight Dark (Slate 950)</option>
                          <option value="teal">Deep Brand Teal (#0d5363)</option>
                        </select>
                      </div>
                    </div>

                    {/* TYPE SPECIFIC EDITORS */}

                    {/* 1. FAQ Editor */}
                    {block.type === 'faq' && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            FAQ Items ({(block.faqItems || []).length})
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newFaq: FaqItem = {
                                id: `faq-${Date.now()}`,
                                question: 'New Question?',
                                answer: 'Detailed response explaining your policy, service, or guarantee.',
                              };
                              updateBlock(block.id, (prev) => ({
                                ...prev,
                                faqItems: [...(prev.faqItems || []), newFaq],
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Question</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(block.faqItems || []).map((faq, fIdx) => (
                            <div
                              key={faq.id}
                              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <input
                                  type="text"
                                  value={faq.question}
                                  onChange={(e) => {
                                    const updated = (block.faqItems || []).map((f) =>
                                      f.id === faq.id ? { ...f, question: e.target.value } : f
                                    );
                                    updateBlock(block.id, (prev) => ({ ...prev, faqItems: updated }));
                                  }}
                                  placeholder="Question?"
                                  className="font-bold text-xs text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (block.faqItems || []).filter((f) => f.id !== faq.id);
                                    updateBlock(block.id, (prev) => ({ ...prev, faqItems: updated }));
                                  }}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                                  title="Delete question"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={faq.answer}
                                onChange={(e) => {
                                  const updated = (block.faqItems || []).map((f) =>
                                    f.id === faq.id ? { ...f, answer: e.target.value } : f
                                  );
                                  updateBlock(block.id, (prev) => ({ ...prev, faqItems: updated }));
                                }}
                                placeholder="Answer explanation..."
                                className="w-full text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Feature Grid Editor */}
                    {block.type === 'features' && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Feature Cards ({(block.featureItems || []).length})
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newFeat: FeatureBlockItem = {
                                id: `feat-${Date.now()}`,
                                title: 'New Feature Capability',
                                description: 'Clear technical or design advantage that accelerates client business value.',
                                iconName: 'Sparkles',
                                badge: 'New',
                              };
                              updateBlock(block.id, (prev) => ({
                                ...prev,
                                featureItems: [...(prev.featureItems || []), newFeat],
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Feature Card</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(block.featureItems || []).map((feat) => (
                            <div
                              key={feat.id}
                              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={feat.title}
                                  onChange={(e) => {
                                    const updated = (block.featureItems || []).map((f) =>
                                      f.id === feat.id ? { ...f, title: e.target.value } : f
                                    );
                                    updateBlock(block.id, (prev) => ({ ...prev, featureItems: updated }));
                                  }}
                                  placeholder="Feature Title"
                                  className="font-bold text-xs text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (block.featureItems || []).filter((f) => f.id !== feat.id);
                                    updateBlock(block.id, (prev) => ({ ...prev, featureItems: updated }));
                                  }}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                                  title="Delete feature"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={feat.badge || ''}
                                  onChange={(e) => {
                                    const updated = (block.featureItems || []).map((f) =>
                                      f.id === feat.id ? { ...f, badge: e.target.value } : f
                                    );
                                    updateBlock(block.id, (prev) => ({ ...prev, featureItems: updated }));
                                  }}
                                  placeholder="Badge (e.g. Core, New)"
                                  className="text-xs text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg"
                                />
                                <IconPicker
                                  label="Icon"
                                  value={feat.iconName || 'Sparkles'}
                                  onChange={(iconName) => {
                                    const updated = (block.featureItems || []).map((f) =>
                                      f.id === feat.id ? { ...f, iconName } : f
                                    );
                                    updateBlock(block.id, (prev) => ({ ...prev, featureItems: updated }));
                                  }}
                                />
                              </div>

                              <textarea
                                rows={2}
                                value={feat.description}
                                onChange={(e) => {
                                  const updated = (block.featureItems || []).map((f) =>
                                    f.id === feat.id ? { ...f, description: e.target.value } : f
                                  );
                                  updateBlock(block.id, (prev) => ({ ...prev, featureItems: updated }));
                                }}
                                placeholder="Feature description..."
                                className="w-full text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Promo Banner Editor */}
                    {block.type === 'banner' && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Banner Call to Action Buttons
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                            <span className="text-xs font-bold text-slate-900 block">Primary Button</span>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Button Label
                              </label>
                              <input
                                type="text"
                                value={block.bannerData?.buttonLabel || 'Start a Project'}
                                onChange={(e) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    bannerData: {
                                      ...(prev.bannerData || {}),
                                      buttonLabel: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                              />
                            </div>
                            <ActionSelector
                              label="Primary Action"
                              value={block.bannerData?.buttonAction || 'start-project'}
                              onChange={(action) =>
                                updateBlock(block.id, (prev) => ({
                                  ...prev,
                                  bannerData: {
                                    ...(prev.bannerData || {}),
                                    buttonAction: action,
                                  },
                                }))
                              }
                            />
                          </div>

                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                            <span className="text-xs font-bold text-slate-900 block">
                              Secondary Button (Optional)
                            </span>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Button Label
                              </label>
                              <input
                                type="text"
                                value={block.bannerData?.secondaryButtonLabel || ''}
                                onChange={(e) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    bannerData: {
                                      ...(prev.bannerData || {}),
                                      secondaryButtonLabel: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="e.g. Explore Services"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                              />
                            </div>
                            <ActionSelector
                              label="Secondary Action"
                              value={block.bannerData?.secondaryButtonAction || 'services'}
                              onChange={(action) =>
                                updateBlock(block.id, (prev) => ({
                                  ...prev,
                                  bannerData: {
                                    ...(prev.bannerData || {}),
                                    secondaryButtonAction: action,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Stats Numbers Editor */}
                    {block.type === 'stats' && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Key Stat Metrics ({(block.statItems || []).length})
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newStat: StatBlockItem = {
                                id: `stat-${Date.now()}`,
                                value: '100%',
                                label: 'Metric Name',
                                subtext: 'Context footnote',
                              };
                              updateBlock(block.id, (prev) => ({
                                ...prev,
                                statItems: [...(prev.statItems || []), newStat],
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Stat</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {(block.statItems || []).map((stat) => (
                            <div
                              key={stat.id}
                              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={stat.value}
                                  onChange={(e) => {
                                    const updated = (block.statItems || []).map((s) =>
                                      s.id === stat.id ? { ...s, value: e.target.value } : s
                                    );
                                    updateBlock(block.id, (prev) => ({ ...prev, statItems: updated }));
                                  }}
                                  placeholder="e.g. 99.9%"
                                  className="font-extrabold text-sm text-[#0d5363] bg-white border border-slate-200 px-2 py-1 rounded-lg w-28"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (block.statItems || []).filter((s) => s.id !== stat.id);
                                    updateBlock(block.id, (prev) => ({ ...prev, statItems: updated }));
                                  }}
                                  className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => {
                                  const updated = (block.statItems || []).map((s) =>
                                    s.id === stat.id ? { ...s, label: e.target.value } : s
                                  );
                                  updateBlock(block.id, (prev) => ({ ...prev, statItems: updated }));
                                }}
                                placeholder="Label (e.g. System Uptime)"
                                className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded-lg"
                              />

                              <input
                                type="text"
                                value={stat.subtext || ''}
                                onChange={(e) => {
                                  const updated = (block.statItems || []).map((s) =>
                                    s.id === stat.id ? { ...s, subtext: e.target.value } : s
                                  );
                                  updateBlock(block.id, (prev) => ({ ...prev, statItems: updated }));
                                }}
                                placeholder="Subtext footnote"
                                className="w-full text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. Rich Text Story Split Editor */}
                    {block.type === 'rich-text' && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Story Narrative & Image
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Paragraph 1
                              </label>
                              <textarea
                                rows={3}
                                value={block.richTextData?.paragraph1 || ''}
                                onChange={(e) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    richTextData: {
                                      ...(prev.richTextData || {}),
                                      paragraph1: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Paragraph 2 (Optional)
                              </label>
                              <textarea
                                rows={3}
                                value={block.richTextData?.paragraph2 || ''}
                                onChange={(e) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    richTextData: {
                                      ...(prev.richTextData || {}),
                                      paragraph2: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Featured Image URL
                              </label>
                              <input
                                type="text"
                                value={block.richTextData?.image || ''}
                                onChange={(e) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    richTextData: {
                                      ...(prev.richTextData || {}),
                                      image: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="/assets/about_nexordive_graphic.png"
                                className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Image Placement
                              </label>
                              <select
                                value={block.richTextData?.imagePosition || 'right'}
                                onChange={(e) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    richTextData: {
                                      ...(prev.richTextData || {}),
                                      imagePosition: e.target.value as any,
                                    },
                                  }))
                                }
                                className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-lg"
                              >
                                <option value="right">Image on Right (Text on Left)</option>
                                <option value="left">Image on Left (Text on Right)</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  CTA Label
                                </label>
                                <input
                                  type="text"
                                  value={block.richTextData?.ctaLabel || ''}
                                  onChange={(e) =>
                                    updateBlock(block.id, (prev) => ({
                                      ...prev,
                                      richTextData: {
                                        ...(prev.richTextData || {}),
                                        ctaLabel: e.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="e.g. Learn More"
                                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                                />
                              </div>
                              <ActionSelector
                                label="CTA Action"
                                value={block.richTextData?.ctaAction || 'contact'}
                                onChange={(action) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    richTextData: {
                                      ...(prev.richTextData || {}),
                                      ctaAction: action,
                                    },
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 6. Video Showcase Editor */}
                    {block.type === 'video' && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Video Media Settings
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Video URL (YouTube or MP4)
                            </label>
                            <input
                              type="text"
                              value={block.videoData?.videoUrl || ''}
                              onChange={(e) =>
                                updateBlock(block.id, (prev) => ({
                                  ...prev,
                                  videoData: {
                                    ...(prev.videoData || {}),
                                    videoUrl: e.target.value,
                                  },
                                }))
                              }
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Custom Thumbnail Image URL (Optional)
                            </label>
                            <input
                              type="text"
                              value={block.videoData?.thumbnailImage || ''}
                              onChange={(e) =>
                                updateBlock(block.id, (prev) => ({
                                  ...prev,
                                  videoData: {
                                    ...(prev.videoData || {}),
                                    thumbnailImage: e.target.value,
                                  },
                                }))
                              }
                              placeholder="/assets/about/laptop_consultation_bg.jpg"
                              className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Caption Text
                            </label>
                            <input
                              type="text"
                              value={block.videoData?.caption || ''}
                              onChange={(e) =>
                                updateBlock(block.id, (prev) => ({
                                  ...prev,
                                  videoData: {
                                    ...(prev.videoData || {}),
                                    caption: e.target.value,
                                  },
                                }))
                              }
                              placeholder="High-resolution preview of our architectural pipeline..."
                              className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
