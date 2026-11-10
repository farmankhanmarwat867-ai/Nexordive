'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { IconPicker } from '../IconPicker';
import { DynamicIcon } from '../../common/DynamicIcon';
import {
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Radio,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { StreamerContent, StreamerStartingCard, StreamerSuite } from '../../../types/content';

interface StreamerEditorViewProps {
  onDirtyChange?: (dirty: boolean, saveFn: () => Promise<boolean>, discardFn: () => void) => void;
}

export const StreamerEditorView: React.FC<StreamerEditorViewProps> = ({ onDirtyChange }) => {
  const { content, updateContentSection } = useAdmin();
  const [draft, setDraft] = useState<StreamerContent>(() => structuredClone(content.streamer));
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(structuredClone(content.streamer));
  }, [content.streamer]);

  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(content.streamer);
  }, [draft, content.streamer]);

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
      const res = updateContentSection('streamer', draft);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Streamer Assets hub published successfully! Website updated live.',
        });
        setTimeout(() => setFeedback(null), 3500);
        return true;
      } else {
        setFeedback({ type: 'error', message: 'Failed to publish: ' + (res.error || 'Unknown error') });
        return false;
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Error saving streamer assets.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(structuredClone(content.streamer));
    setEditingCardId(null);
    setFeedback(null);
  };

  // Report dirty state to parent
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty, handleSave, handleCancel);
    }
  }, [isDirty, onDirtyChange]);

  const handleAddCard = () => {
    const newId = `streamer-${Date.now()}`;
    const newCard: StreamerStartingCard = {
      id: newId,
      platform: 'New Platform Pack',
      startingPrice: 'From $49',
      priceNumeric: 49,
      iconName: 'Radio',
      accentColor: '#38BDF8',
      badge: 'New',
      description: 'Broadcast-grade overlays and alerts engineered for modern creators.',
      features: ['60fps Stinger Transition', 'Custom Chat Box CSS', 'Interactive Alert Box'],
      visible: true,
      order: draft.startingCards.length + 1,
    };
    setDraft({ ...draft, startingCards: [...draft.startingCards, newCard] });
    setEditingCardId(newId);
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this streamer package?')) {
      const updated = draft.startingCards.filter((c) => c.id !== id);
      setDraft({ ...draft, startingCards: updated });
      if (editingCardId === id) setEditingCardId(null);
    }
  };

  const toggleCardVisibility = (id: string) => {
    setDraft({
      ...draft,
      startingCards: draft.startingCards.map((c) =>
        c.id === id ? { ...c, visible: !c.visible } : c
      ),
    });
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const list = [...draft.startingCards];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setDraft({ ...draft, startingCards: list });
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-32">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 font-display">
              Streamer Assets & Broadcast Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage creator starting platform cards (Twitch, Kick, YouTube, VTuber) and turnkey broadcast production suites.
          </p>
        </div>
      </div>

      {/* 1. Section Header Copy */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-display">
          Section Header Copy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Section Eyebrow Tag
            </label>
            <input
              type="text"
              value={draft.sectionEyebrow}
              onChange={(e) => setDraft({ ...draft, sectionEyebrow: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Main Heading Title
            </label>
            <input
              type="text"
              value={draft.sectionTitle}
              onChange={(e) => setDraft({ ...draft, sectionTitle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Section Description
          </label>
          <textarea
            rows={2}
            value={draft.sectionDescription}
            onChange={(e) => setDraft({ ...draft, sectionDescription: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900"
          />
        </div>
      </div>

      {/* 2. Platform Starter Cards */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Platform Starting Price Cards ({draft.startingCards.length})
            </h2>
            <p className="text-xs text-slate-500">
              Cards displayed on both the Homepage Hub and the dedicated Streamer Assets page.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Platform</span>
          </button>
        </div>

        <div className="space-y-3">
          {draft.startingCards.map((card, idx) => {
            const isExpanded = editingCardId === card.id;

            return (
              <div
                key={card.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden transition-all"
              >
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: `${card.accentColor}20`, color: card.accentColor }}
                    >
                      <DynamicIcon name={card.iconName} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">
                          {card.platform}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {card.startingPrice}
                        </span>
                        {card.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200">
                            {card.badge}
                          </span>
                        )}
                        {!card.visible && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                            Hidden
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 truncate block mt-0.5">
                        {card.features.length} features · {card.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleCardVisibility(card.id)}
                      title={card.visible ? 'Hide from live site' : 'Show on live site'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
                    >
                      {card.visible ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveCard(idx, 'up')}
                        title="Move Up"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === draft.startingCards.length - 1}
                        onClick={() => moveCard(idx, 'down')}
                        title="Move Down"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingCardId(isExpanded ? null : card.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isExpanded
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {isExpanded ? 'Done' : 'Edit'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      title="Delete card"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 bg-white space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={card.platform}
                          onChange={(e) => {
                            const updated = draft.startingCards.map((c) =>
                              c.id === card.id ? { ...c, platform: e.target.value } : c
                            );
                            setDraft({ ...draft, startingCards: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Price Display
                        </label>
                        <input
                          type="text"
                          value={card.startingPrice}
                          onChange={(e) => {
                            const updated = draft.startingCards.map((c) =>
                              c.id === card.id ? { ...c, startingPrice: e.target.value } : c
                            );
                            setDraft({ ...draft, startingCards: updated });
                          }}
                          placeholder="From $29"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Badge (Optional)
                        </label>
                        <input
                          type="text"
                          value={card.badge}
                          onChange={(e) => {
                            const updated = draft.startingCards.map((c) =>
                              c.id === card.id ? { ...c, badge: e.target.value } : c
                            );
                            setDraft({ ...draft, startingCards: updated });
                          }}
                          placeholder="Popular, Trending, etc."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <IconPicker
                          label="Platform Icon"
                          value={card.iconName}
                          onChange={(iconName) => {
                            const updated = draft.startingCards.map((c) =>
                              c.id === card.id ? { ...c, iconName } : c
                            );
                            setDraft({ ...draft, startingCards: updated });
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={card.description}
                          onChange={(e) => {
                            const updated = draft.startingCards.map((c) =>
                              c.id === card.id ? { ...c, description: e.target.value } : c
                            );
                            setDraft({ ...draft, startingCards: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={card.accentColor || '#38BDF8'}
                            onChange={(e) => {
                              const updated = draft.startingCards.map((c) =>
                                c.id === card.id ? { ...c, accentColor: e.target.value } : c
                              );
                              setDraft({ ...draft, startingCards: updated });
                            }}
                            className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                          />
                          <input
                            type="text"
                            value={card.accentColor || '#38BDF8'}
                            onChange={(e) => {
                              const updated = draft.startingCards.map((c) =>
                                c.id === card.id ? { ...c, accentColor: e.target.value } : c
                              );
                              setDraft({ ...draft, startingCards: updated });
                            }}
                            className="w-full px-2 py-1.5 text-xs font-mono rounded-lg border border-slate-300 bg-white text-slate-900 uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={card.features.join('\n')}
                        onChange={(e) => {
                          const features = e.target.value
                            .split('\n')
                            .filter((l) => l.trim().length > 0);
                          const updated = draft.startingCards.map((c) =>
                            c.id === card.id ? { ...c, features } : c
                          );
                          setDraft({ ...draft, startingCards: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Turnkey Production Suites */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">
            Turnkey Broadcast Suites ({draft.suites.length} Suites)
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive production packages displayed on the Streamer Assets dedicated page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {draft.suites.map((suite, idx) => (
            <div
              key={suite.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={suite.name}
                  onChange={(e) => {
                    const updated = [...draft.suites];
                    updated[idx].name = e.target.value;
                    setDraft({ ...draft, suites: updated });
                  }}
                  className="font-bold text-sm text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex-1"
                />
                <input
                  type="text"
                  value={suite.turnaround}
                  onChange={(e) => {
                    const updated = [...draft.suites];
                    updated[idx].turnaround = e.target.value;
                    setDraft({ ...draft, suites: updated });
                  }}
                  className="text-xs font-mono text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Suite Overview
                </label>
                <textarea
                  rows={2}
                  value={suite.description}
                  onChange={(e) => {
                    const updated = [...draft.suites];
                    updated[idx].description = e.target.value;
                    setDraft({ ...draft, suites: updated });
                  }}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Deliverables (one item per line)
                </label>
                <textarea
                  rows={4}
                  value={suite.items.join('\n')}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                    const updated = [...draft.suites];
                    updated[idx].items = items;
                    setDraft({ ...draft, suites: updated });
                  }}
                  className="w-full text-xs font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Save / Cancel Action Bar */}
      <EditorActionBar
        title="Streamer Assets Hub"
        description="Save your changes to publish live to the website."
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        feedback={feedback}
      />
    </div>
  );
};
