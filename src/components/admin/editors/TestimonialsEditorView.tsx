import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { ImageFieldEditor } from '../ImageFieldEditor';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, Eye, EyeOff, Star, MessageSquare } from 'lucide-react';
import { TestimonialsContent, TestimonialItem } from '../../../types/content';

export const TestimonialsEditorView: React.FC = () => {
  const { content, updateContentSection } = useAdmin();
  const [draft, setDraft] = useState<TestimonialsContent>(content.testimonials);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(content.testimonials);
  }, [content.testimonials]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(content.testimonials);

  const handleSave = () => {
    const res = updateContentSection('testimonials', draft);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Testimonials published successfully to the website!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: 'Failed to publish: ' + res.error });
    }
  };

  const handleCancel = () => {
    setDraft(content.testimonials);
    setEditingId(null);
    setFeedback(null);
  };

  const handleAddTestimonial = () => {
    const newId = `t-${Date.now()}`;
    const newT: TestimonialItem = {
      id: newId,
      author: 'Client Name',
      role: 'CEO & Founder',
      company: 'Tech Enterprise',
      quote: 'NexorDive delivered exceptional digital product engineering with unmatched speed and craft.',
      avatar: '/assets/khyber/avatar1.png',
      rating: 5,
      visible: true,
      order: draft.testimonials.length + 1,
    };
    setDraft({ ...draft, testimonials: [...draft.testimonials, newT] });
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      const updated = draft.testimonials.filter((t) => t.id !== id);
      setDraft({ ...draft, testimonials: updated });
      if (editingId === id) setEditingId(null);
    }
  };

  const toggleVisibility = (id: string) => {
    setDraft({
      ...draft,
      testimonials: draft.testimonials.map((t) => (t.id === id ? { ...t, visible: !t.visible } : t)),
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const list = [...draft.testimonials];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => { item.order = idx + 1; });
    setDraft({ ...draft, testimonials: list });
  };

  return (
    <div>
      <EditorActionBar
        title="Client Testimonials"
        description="Manage client quotes, author credentials, ratings, and avatar graphics displayed on Home and Portfolio pages."
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        feedback={feedback}
      />

      {/* Header Copy */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          Section Header Copy
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Headline</label>
            <input
              type="text"
              value={draft.sectionTitle}
              onChange={(e) => setDraft({ ...draft, sectionTitle: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Subtitle / Paragraph</label>
            <input
              type="text"
              value={draft.sectionDescription}
              onChange={(e) => setDraft({ ...draft, sectionDescription: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Client Quotes ({draft.testimonials.length})
        </h2>
        <button
          type="button"
          onClick={handleAddTestimonial}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* List of Testimonials */}
      <div className="space-y-4">
        {draft.testimonials.map((t, idx) => {
          const isExpanded = editingId === t.id;

          return (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {t.author}
                      </span>
                      <span className="text-xs text-slate-400">
                        {t.role}, {t.company}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                      "{t.quote}"
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(t.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {t.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === draft.testimonials.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingId(isExpanded ? null : t.id)}
                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={t.author}
                        onChange={(e) => {
                          const updated = draft.testimonials.map((x) => (x.id === t.id ? { ...x, author: e.target.value } : x));
                          setDraft({ ...draft, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => {
                          const updated = draft.testimonials.map((x) => (x.id === t.id ? { ...x, role: e.target.value } : x));
                          setDraft({ ...draft, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={t.company}
                        onChange={(e) => {
                          const updated = draft.testimonials.map((x) => (x.id === t.id ? { ...x, company: e.target.value } : x));
                          setDraft({ ...draft, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Client Quote
                    </label>
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const updated = draft.testimonials.map((x) => (x.id === t.id ? { ...x, quote: e.target.value } : x));
                        setDraft({ ...draft, testimonials: updated });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <ImageFieldEditor
                    label="Client Avatar Photo"
                    imageSrc={t.avatar}
                    onChange={(src) => {
                      const updated = draft.testimonials.map((x) => (x.id === t.id ? { ...x, avatar: src } : x));
                      setDraft({ ...draft, testimonials: updated });
                    }}
                    helperText="Protrudes circularly from the bottom of the testimonial card."
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
