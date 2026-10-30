import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { IconPicker } from '../IconPicker';
import { DynamicIcon } from '../../common/DynamicIcon';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Check, Sparkles, Edit3, X } from 'lucide-react';
import { ServiceCardItem, ServicesContent } from '../../../types/content';

export const ServicesEditorView: React.FC = () => {
  const { content, updateContentSection } = useAdmin();
  const [draft, setDraft] = useState<ServicesContent>(content.services);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(content.services);
  }, [content.services]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(content.services);

  const handleSave = () => {
    const res = updateContentSection('services', draft);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Services published successfully to the website!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: 'Failed to publish services: ' + res.error });
    }
  };

  const handleCancel = () => {
    setDraft(content.services);
    setEditingCardId(null);
    setFeedback(null);
  };

  const handleAddCard = () => {
    const newId = `service-${Date.now()}`;
    const newCard: ServiceCardItem = {
      id: newId,
      title: 'New Digital Service',
      iconName: 'Cpu',
      isTealHighlight: false,
      description: 'Comprehensive digital engineering capability tailored to client requirements.',
      features: ['Feature 1: Bespoke design', 'Feature 2: High performance', 'Feature 3: Full documentation'],
      techStack: ['React', 'TypeScript', 'Tailwind'],
      visible: true,
      order: draft.cards.length + 1,
    };
    setDraft({ ...draft, cards: [...draft.cards, newCard] });
    setEditingCardId(newId);
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service card?')) {
      const updated = draft.cards.filter((c) => c.id !== id);
      setDraft({ ...draft, cards: updated });
      if (editingCardId === id) setEditingCardId(null);
    }
  };

  const toggleCardVisibility = (id: string) => {
    setDraft({
      ...draft,
      cards: draft.cards.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
    });
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const list = [...draft.cards];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => { item.order = idx + 1; });
    setDraft({ ...draft, cards: list });
  };

  return (
    <div>
      <EditorActionBar
        title="Services & Capabilities"
        description="Manage the 4 core service modules, icons, tech badges, and section headings rendered on Home and Services pages."
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        feedback={feedback}
      />

      {/* Top Section Copy Fields */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-8 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Section Header Copy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={draft.sectionEyebrow}
              onChange={(e) => setDraft({ ...draft, sectionEyebrow: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={draft.sectionTitle}
              onChange={(e) => setDraft({ ...draft, sectionTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description Paragraph
            </label>
            <textarea
              rows={2}
              value={draft.sectionDescription}
              onChange={(e) => setDraft({ ...draft, sectionDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Services List Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Service Cards ({draft.cards.length})
          </h2>
          <span className="text-xs text-slate-500">
            Card #2 is styled with the signature deep teal highlight in the public staggered grid.
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddCard}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {draft.cards.map((card, idx) => {
          const isExpanded = editingCardId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {/* Card Summary Bar */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      card.isTealHighlight
                        ? 'bg-[#0d5363] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-[#0d5363] dark:text-cyan-400'
                    }`}
                  >
                    <DynamicIcon name={card.iconName} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {card.title}
                      </span>
                      {card.isTealHighlight && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0d5363]/10 text-[#0d5363] dark:bg-cyan-950/80 dark:text-cyan-300 border border-[#0d5363]/20">
                          Teal Highlight
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block truncate">
                      {card.features.length} deliverables · Tech: {card.techStack.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleCardVisibility(card.id)}
                    className={`p-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      card.visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={card.visible ? 'Hide from site' : 'Show on site'}
                  >
                    {card.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
                      disabled={idx === draft.cards.length - 1}
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
                    title="Edit card details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                    title="Delete card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Detail Form (Accordion) */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = draft.cards.map((c) => (c.id === card.id ? { ...c, title: e.target.value } : c));
                          setDraft({ ...draft, cards: updated });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <IconPicker
                        label="Service Icon"
                        value={card.iconName}
                        onChange={(iconName) => {
                          const updated = draft.cards.map((c) => (c.id === card.id ? { ...c, iconName } : c));
                          setDraft({ ...draft, cards: updated });
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={card.isTealHighlight}
                        onChange={(e) => {
                          const updated = draft.cards.map((c) => (c.id === card.id ? { ...c, isTealHighlight: e.target.checked } : c));
                          setDraft({ ...draft, cards: updated });
                        }}
                        className="rounded text-[#0d5363]"
                      />
                      <span>Apply Deep Teal Accent Card Styling (Featured card style)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Features / Bullet Deliverables (one per line)
                    </label>
                    <textarea
                      rows={5}
                      value={card.features.join('\n')}
                      onChange={(e) => {
                        const features = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                        const updated = draft.cards.map((c) => (c.id === card.id ? { ...c, features } : c));
                        setDraft({ ...draft, cards: updated });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tech Stack Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={card.techStack.join(', ')}
                      onChange={(e) => {
                        const techStack = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        const updated = draft.cards.map((c) => (c.id === card.id ? { ...c, techStack } : c));
                        setDraft({ ...draft, cards: updated });
                      }}
                      placeholder="e.g. Next.js, React, TypeScript, Tailwind"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
