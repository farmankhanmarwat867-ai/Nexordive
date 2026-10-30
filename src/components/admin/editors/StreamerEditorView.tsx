import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { IconPicker } from '../IconPicker';
import { DynamicIcon } from '../../common/DynamicIcon';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, Eye, EyeOff, Radio, Sparkles } from 'lucide-react';
import { StreamerContent, StreamerStartingCard, StreamerSuite } from '../../../types/content';

export const StreamerEditorView: React.FC = () => {
  const { content, updateContentSection } = useAdmin();
  const [draft, setDraft] = useState<StreamerContent>(content.streamer);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(content.streamer);
  }, [content.streamer]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(content.streamer);

  const handleSave = () => {
    const res = updateContentSection('streamer', draft);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Streamer Assets hub published successfully!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: 'Failed to publish: ' + res.error });
    }
  };

  const handleCancel = () => {
    setDraft(content.streamer);
    setEditingCardId(null);
    setFeedback(null);
  };

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
    if (window.confirm('Delete this streamer package?')) {
      const updated = draft.startingCards.filter((c) => c.id !== id);
      setDraft({ ...draft, startingCards: updated });
      if (editingCardId === id) setEditingCardId(null);
    }
  };

  const toggleCardVisibility = (id: string) => {
    setDraft({
      ...draft,
      startingCards: draft.startingCards.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
    });
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const list = [...draft.startingCards];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => { item.order = idx + 1; });
    setDraft({ ...draft, startingCards: list });
  };

  return (
    <div>
      <EditorActionBar
        title="Streamer Assets Hub"
        description="Manage the 4 creator platform price cards (Twitch, Kick, YouTube, VTuber) and turnkey broadcast production suites."
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        feedback={feedback}
      />

      {/* Section Header Copy */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          Section Header Copy
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Eyebrow</label>
            <input
              type="text"
              value={draft.sectionEyebrow}
              onChange={(e) => setDraft({ ...draft, sectionEyebrow: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Title</label>
            <input
              type="text"
              value={draft.sectionTitle}
              onChange={(e) => setDraft({ ...draft, sectionTitle: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] text-slate-500 mb-1">Description</label>
            <textarea
              rows={2}
              value={draft.sectionDescription}
              onChange={(e) => setDraft({ ...draft, sectionDescription: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Starting Price Cards */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Platform Starting Price Cards ({draft.startingCards.length})
          </h2>
          <button
            type="button"
            onClick={handleAddCard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
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
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${card.accentColor}18`, color: card.accentColor }}
                    >
                      <DynamicIcon name={card.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {card.platform}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          {card.startingPrice}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {card.badge}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 truncate block">
                        {card.features.length} features · {card.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleCardVisibility(card.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {card.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveCard(idx, 'up')}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === draft.startingCards.length - 1}
                        onClick={() => moveCard(idx, 'down')}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingCardId(isExpanded ? null : card.id)}
                      className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={card.platform}
                          onChange={(e) => {
                            const updated = draft.startingCards.map((c) => (c.id === card.id ? { ...c, platform: e.target.value } : c));
                            setDraft({ ...draft, startingCards: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Price Display
                        </label>
                        <input
                          type="text"
                          value={card.startingPrice}
                          onChange={(e) => {
                            const updated = draft.startingCards.map((c) => (c.id === card.id ? { ...c, startingPrice: e.target.value } : c));
                            setDraft({ ...draft, startingCards: updated });
                          }}
                          placeholder="From $29"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Badge
                        </label>
                        <input
                          type="text"
                          value={card.badge}
                          onChange={(e) => {
                            const updated = draft.startingCards.map((c) => (c.id === card.id ? { ...c, badge: e.target.value } : c));
                            setDraft({ ...draft, startingCards: updated });
                          }}
                          placeholder="Popular, Trending, etc."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <IconPicker
                          label="Platform Icon"
                          value={card.iconName}
                          onChange={(iconName) => {
                            const updated = draft.startingCards.map((c) => (c.id === card.id ? { ...c, iconName } : c));
                            setDraft({ ...draft, startingCards: updated });
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={card.description}
                        onChange={(e) => {
                          const updated = draft.startingCards.map((c) => (c.id === card.id ? { ...c, description: e.target.value } : c));
                          setDraft({ ...draft, startingCards: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={card.features.join('\n')}
                        onChange={(e) => {
                          const features = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          const updated = draft.startingCards.map((c) => (c.id === card.id ? { ...c, features } : c));
                          setDraft({ ...draft, startingCards: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Turnkey Production Suites */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Turnkey Broadcast Suites (2 Suites)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {draft.suites.map((suite, idx) => (
            <div key={suite.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={suite.name}
                  onChange={(e) => {
                    const updated = [...draft.suites];
                    updated[idx].name = e.target.value;
                    setDraft({ ...draft, suites: updated });
                  }}
                  className="font-bold text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md flex-1 mr-2"
                />
                <input
                  type="text"
                  value={suite.turnaround}
                  onChange={(e) => {
                    const updated = [...draft.suites];
                    updated[idx].turnaround = e.target.value;
                    setDraft({ ...draft, suites: updated });
                  }}
                  className="text-xs font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md"
                />
              </div>

              <textarea
                rows={2}
                value={suite.description}
                onChange={(e) => {
                  const updated = [...draft.suites];
                  updated[idx].description = e.target.value;
                  setDraft({ ...draft, suites: updated });
                }}
                className="w-full text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1.5 rounded-md"
              />

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Deliverables (one per line)</label>
                <textarea
                  rows={4}
                  value={suite.items.join('\n')}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                    const updated = [...draft.suites];
                    updated[idx].items = items;
                    setDraft({ ...draft, suites: updated });
                  }}
                  className="w-full text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-1.5 rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
