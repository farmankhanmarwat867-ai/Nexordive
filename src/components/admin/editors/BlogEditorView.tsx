import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { ImageFieldEditor } from '../ImageFieldEditor';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, Eye, EyeOff, BookOpen } from 'lucide-react';
import { BlogContent, BlogCardItem } from '../../../types/content';

export const BlogEditorView: React.FC = () => {
  const { content, updateContentSection } = useAdmin();
  const [draft, setDraft] = useState<BlogContent>(content.blog);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(content.blog);
  }, [content.blog]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(content.blog);

  const handleSave = () => {
    const res = updateContentSection('blog', draft);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Blog cards published successfully!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: 'Failed to publish: ' + res.error });
    }
  };

  const handleCancel = () => {
    setDraft(content.blog);
    setEditingId(null);
    setFeedback(null);
  };

  const handleAddBlog = () => {
    const newId = `blog-${Date.now()}`;
    const newB: BlogCardItem = {
      id: newId,
      title: 'New Insights in Digital Engineering',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      image: '/assets/khyber/blog1.png',
      imageAlt: 'Blog post thumbnail',
      excerpt: 'Exploring cutting-edge approaches to modern web development and digital architecture.',
      link: '#',
      category: 'Engineering',
      visible: true,
      order: draft.blogs.length + 1,
    };
    setDraft({ ...draft, blogs: [...draft.blogs, newB] });
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this blog card?')) {
      const updated = draft.blogs.filter((b) => b.id !== id);
      setDraft({ ...draft, blogs: updated });
      if (editingId === id) setEditingId(null);
    }
  };

  const toggleVisibility = (id: string) => {
    setDraft({
      ...draft,
      blogs: draft.blogs.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)),
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const list = [...draft.blogs];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => { item.order = idx + 1; });
    setDraft({ ...draft, blogs: list });
  };

  return (
    <div>
      <EditorActionBar
        title="Blog Cards & Articles"
        description="Manage the 3 insight cards displayed on the landing page (images, publish dates, headlines, and destination links)."
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
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Blog Cards ({draft.blogs.length})
        </h2>
        <button
          type="button"
          onClick={handleAddBlog}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Card</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {draft.blogs.map((b, idx) => {
          const isExpanded = editingId === b.id;

          return (
            <div
              key={b.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                      {b.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      {b.date} · Link: {b.link}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(b.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {b.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
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
                      disabled={idx === draft.blogs.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingId(isExpanded ? null : b.id)}
                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Article Headline
                      </label>
                      <input
                        type="text"
                        value={b.title}
                        onChange={(e) => {
                          const updated = draft.blogs.map((x) => (x.id === b.id ? { ...x, title: e.target.value } : x));
                          setDraft({ ...draft, blogs: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Display Date
                      </label>
                      <input
                        type="text"
                        value={b.date}
                        onChange={(e) => {
                          const updated = draft.blogs.map((x) => (x.id === b.id ? { ...x, date: e.target.value } : x));
                          setDraft({ ...draft, blogs: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Link / Destination URL
                    </label>
                    <input
                      type="text"
                      value={b.link}
                      onChange={(e) => {
                        const updated = draft.blogs.map((x) => (x.id === b.id ? { ...x, link: e.target.value } : x));
                        setDraft({ ...draft, blogs: updated });
                      }}
                      placeholder="e.g. #contact or external URL"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <ImageFieldEditor
                    label="Article Thumbnail Image"
                    imageSrc={b.image}
                    imageAlt={b.imageAlt}
                    onChange={(src, alt) => {
                      const updated = draft.blogs.map((x) => (x.id === b.id ? { ...x, image: src, imageAlt: alt || b.imageAlt } : x));
                      setDraft({ ...draft, blogs: updated });
                    }}
                    helperText="Displayed in the top portion of the blog card."
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
