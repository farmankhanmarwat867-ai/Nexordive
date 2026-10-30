'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { GlobalContent, SeoSettings } from '../../../types/content';

interface SettingsEditorViewProps {
  onDirtyChange?: (dirty: boolean, saveFn: () => Promise<boolean>, discardFn: () => void) => void;
}

export const SettingsEditorView: React.FC<SettingsEditorViewProps> = ({ onDirtyChange }) => {
  const { content, updateContentSection } = useAdmin();

  // Active settings tab
  const [activeTab, setActiveTab] = useState<'general' | 'navigation' | 'social'>('general');
  const [showSearchAppearance, setShowSearchAppearance] = useState(false);

  // Deep-cloned drafts
  const [globalDraft, setGlobalDraft] = useState<GlobalContent>(() => structuredClone(content.global));
  const [seoDraft, setSeoDraft] = useState<SeoSettings>(() => structuredClone(content.seo));

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setGlobalDraft(structuredClone(content.global));
    setSeoDraft(structuredClone(content.seo));
  }, [content.global, content.seo]);

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(globalDraft) !== JSON.stringify(content.global) ||
      JSON.stringify(seoDraft) !== JSON.stringify(content.seo)
    );
  }, [globalDraft, seoDraft, content.global, content.seo]);

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
      const res1 = updateContentSection('global', globalDraft);
      const res2 = updateContentSection('seo', seoDraft);

      if (res1.success && res2.success) {
        setFeedback({ type: 'success', message: 'Website settings saved! Updated live.' });
        setTimeout(() => setFeedback(null), 3500);
        return true;
      } else {
        setFeedback({ type: 'error', message: res1.error || res2.error || 'Could not save settings.' });
        return false;
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Unexpected error saving settings.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setGlobalDraft(structuredClone(content.global));
    setSeoDraft(structuredClone(content.seo));
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
          Website Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your agency branding, contact details, social links, navigation menu, and search appearance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          General & Contact
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('navigation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'navigation'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Navigation Menu ({globalDraft.navLinks.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'social'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Social Media Links
        </button>
      </div>

      {/* 1. GENERAL & CONTACT */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Agency Branding
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={globalDraft.agencyName}
                  onChange={(e) => setGlobalDraft({ ...globalDraft, agencyName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logo Prefix
                </label>
                <input
                  type="text"
                  value={globalDraft.logoPrefix}
                  onChange={(e) => setGlobalDraft({ ...globalDraft, logoPrefix: e.target.value })}
                  placeholder="e.g. Nexor"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logo Suffix (Cyan Color)
                </label>
                <input
                  type="text"
                  value={globalDraft.logoSuffix}
                  onChange={(e) => setGlobalDraft({ ...globalDraft, logoSuffix: e.target.value })}
                  placeholder="e.g. Dive"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Direct Contact Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={globalDraft.whatsappNumber}
                  onChange={(e) => setGlobalDraft({ ...globalDraft, whatsappNumber: e.target.value })}
                  placeholder="+92 314 600 9810"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  value={globalDraft.contactEmail}
                  onChange={(e) => setGlobalDraft({ ...globalDraft, contactEmail: e.target.value })}
                  placeholder="hello@nexordive.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Default Message
              </label>
              <input
                type="text"
                value={globalDraft.whatsappMessage}
                onChange={(e) => setGlobalDraft({ ...globalDraft, whatsappMessage: e.target.value })}
                placeholder="Hello NexorDive, I would like to discuss a project."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Footer Text */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Footer Content
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Footer Tagline
              </label>
              <textarea
                rows={2}
                value={globalDraft.footerTagline}
                onChange={(e) => setGlobalDraft({ ...globalDraft, footerTagline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={globalDraft.copyrightText}
                onChange={(e) => setGlobalDraft({ ...globalDraft, copyrightText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Collapsible Search Appearance (SEO) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setShowSearchAppearance(!showSearchAppearance)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <span>Search Appearance (SEO)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the browser tab title and description.
                </p>
              </div>
              <div className="p-1 rounded-lg text-slate-400">
                {showSearchAppearance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showSearchAppearance && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website Title (Browser Tab)
                  </label>
                  <input
                    type="text"
                    value={seoDraft.metaTitle}
                    onChange={(e) => setSeoDraft({ ...seoDraft, metaTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDraft.metaDescription}
                    onChange={(e) => setSeoDraft({ ...seoDraft, metaDescription: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={seoDraft.keywords}
                    onChange={(e) => setSeoDraft({ ...seoDraft, keywords: e.target.value })}
                    placeholder="Web Development, Software Systems, Streamer Assets"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. NAVIGATION MENU */}
      {activeTab === 'navigation' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Header Navigation Links
            </h2>
            <p className="text-xs text-slate-500">
              Reorder or hide links shown in the top navigation bar.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {globalDraft.navLinks.map((link, idx) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = globalDraft.navLinks.map((l) =>
                          l.id === link.id ? { ...l, label: e.target.value } : l
                        );
                        setGlobalDraft({ ...globalDraft, navLinks: updated });
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg"
                    />
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Destination: #{link.destination}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      const list = [...globalDraft.navLinks];
                      const temp = list[idx];
                      list[idx] = list[idx - 1];
                      list[idx - 1] = temp;
                      list.forEach((l, i) => { l.order = i + 1; });
                      setGlobalDraft({ ...globalDraft, navLinks: list });
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === globalDraft.navLinks.length - 1}
                    onClick={() => {
                      const list = [...globalDraft.navLinks];
                      const temp = list[idx];
                      list[idx] = list[idx + 1];
                      list[idx + 1] = temp;
                      list.forEach((l, i) => { l.order = i + 1; });
                      setGlobalDraft({ ...globalDraft, navLinks: list });
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = globalDraft.navLinks.map((l) =>
                        l.id === link.id ? { ...l, visible: !l.visible } : l
                      );
                      setGlobalDraft({ ...globalDraft, navLinks: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      link.visible
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {link.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{link.visible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SOCIAL LINKS */}
      {activeTab === 'social' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Social Media Accounts
            </h2>
            <p className="text-xs text-slate-500">
              Profiles linked in the header and footer.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {globalDraft.socialLinks.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800 capitalize">{item.platform}</span>
                    <span className="text-[11px] text-slate-400">({item.label})</span>
                  </div>
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => {
                      const updated = globalDraft.socialLinks.map((s) =>
                        s.id === item.id ? { ...s, url: e.target.value } : s
                      );
                      setGlobalDraft({ ...globalDraft, socialLinks: updated });
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = globalDraft.socialLinks.map((s) =>
                      s.id === item.id ? { ...s, visible: !s.visible } : s
                    );
                    setGlobalDraft({ ...globalDraft, socialLinks: updated });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                    item.visible
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unobtrusive Single Notice */}
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500">
        Demo mode: changes are saved in this browser only.
      </div>

      {/* Floating Bottom Action Bar */}
      <EditorActionBar
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        feedback={feedback}
        sectionName="Website Settings"
      />
    </div>
  );
};
