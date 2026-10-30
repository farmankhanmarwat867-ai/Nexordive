import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { ImageFieldEditor } from '../ImageFieldEditor';
import { Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { PartnersContent, PartnerLogoItem } from '../../../types/content';

export const PartnersEditorView: React.FC = () => {
  const { content, updateContentSection } = useAdmin();
  const [draft, setDraft] = useState<PartnersContent>(content.partners);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setDraft(content.partners);
  }, [content.partners]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(content.partners);

  const handleSave = () => {
    const res = updateContentSection('partners', draft);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Partners marquee settings published successfully!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: 'Failed to publish: ' + res.error });
    }
  };

  const handleCancel = () => {
    setDraft(content.partners);
    setFeedback(null);
  };

  const handleAddPartner = () => {
    const newId = `partner-${Date.now()}`;
    const newP: PartnerLogoItem = {
      id: newId,
      name: 'New Partner',
      category: 'Cloud Infrastructure',
      visible: true,
      order: draft.partners.length + 1,
    };
    setDraft({ ...draft, partners: [...draft.partners, newP] });
  };

  const handleDeletePartner = (id: string) => {
    setDraft({
      ...draft,
      partners: draft.partners.filter((p) => p.id !== id),
    });
  };

  return (
    <div>
      <EditorActionBar
        title="Partners & Logo Marquee"
        description="Manage the partner logos and banner graphic rendered on the landing page and portfolio page."
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        feedback={feedback}
      />

      <div className="space-y-6">
        {/* Banner Graphic Editor */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Official Partner Marquee Banner
          </h2>
          <p className="text-xs text-slate-500">
            This banner image is rendered in high fidelity across Home and Portfolio pages with smooth rounded borders.
          </p>

          <ImageFieldEditor
            label="Marquee Banner Image"
            imageSrc={draft.bannerImage}
            imageAlt={draft.bannerAlt}
            onChange={(src, alt) => setDraft({ ...draft, bannerImage: src, bannerAlt: alt || draft.bannerAlt })}
            helperText="Recommended wide banner graphic containing partner brand emblems."
          />
        </div>

        {/* Individual Partner Badges */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Partner Entities List ({draft.partners.length})
              </h2>
              <span className="text-xs text-slate-500">
                Individual partners recognized in agency telemetry.
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddPartner}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {draft.partners.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const updated = [...draft.partners];
                      updated[idx].name = e.target.value;
                      setDraft({ ...draft, partners: updated });
                    }}
                    className="w-full text-xs font-bold bg-transparent border-0 p-0 text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={p.category}
                    onChange={(e) => {
                      const updated = [...draft.partners];
                      updated[idx].category = e.target.value;
                      setDraft({ ...draft, partners: updated });
                    }}
                    className="w-full text-[10px] text-slate-500 bg-transparent border-0 p-0 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePartner(p.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
