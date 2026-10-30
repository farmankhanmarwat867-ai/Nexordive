'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { ImageFieldEditor } from '../ImageFieldEditor';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { PortfolioContent, PortfolioProjectItem } from '../../../types/content';

interface PortfolioEditorViewProps {
  onDirtyChange?: (dirty: boolean, saveFn: () => Promise<boolean>, discardFn: () => void) => void;
}

export const PortfolioEditorView: React.FC<PortfolioEditorViewProps> = ({ onDirtyChange }) => {
  const { content, updateContentSection } = useAdmin();
  const [draft, setDraft] = useState<PortfolioContent>(() => structuredClone(content.portfolio));
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showMoreModalOptions, setShowMoreModalOptions] = useState(false);

  // Modal Form fields
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('saas');
  const [year, setYear] = useState('2026');
  const [impactMetric, setImpactMetric] = useState('+45% Speed');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [accentColor, setAccentColor] = useState('#4F46E5');
  const [deliverablesStr, setDeliverablesStr] = useState('Web Architecture, Design System');
  const [techStackStr, setTechStackStr] = useState('React, Next.js, Tailwind');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');

  useEffect(() => {
    setDraft(structuredClone(content.portfolio));
  }, [content.portfolio]);

  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(content.portfolio);
  }, [draft, content.portfolio]);

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
      const res = updateContentSection('portfolio', draft);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Portfolio projects saved! Case studies updated.' });
        setTimeout(() => setFeedback(null), 3500);
        return true;
      } else {
        setFeedback({ type: 'error', message: res.error || 'Could not save portfolio.' });
        return false;
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Unexpected error saving portfolio.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(structuredClone(content.portfolio));
    setIsModalOpen(false);
    setFeedback(null);
  };

  // Report dirty state to parent
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty, handleSave, handleCancel);
    }
  }, [isDirty, onDirtyChange]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setClient('');
    setCategory('saas');
    setYear('2026');
    setImpactMetric('+40% Growth');
    setSummary('High-performance digital platform built for scale.');
    setImage('/assets/khyber/blog1.png');
    setAccentColor('#4F46E5');
    setDeliverablesStr('Web Platform, User Experience, API');
    setTechStackStr('React, TypeScript, Tailwind');
    setChallenge('');
    setSolution('');
    setShowMoreModalOptions(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: PortfolioProjectItem) => {
    setEditingId(project.id);
    setTitle(project.title);
    setClient(project.client);
    setCategory(project.category);
    setYear(project.year);
    setImpactMetric(project.impactMetric);
    setSummary(project.summary);
    setImage(project.image || '');
    setAccentColor(project.accentColor || '#4F46E5');
    setDeliverablesStr(project.deliverables?.join(', ') || '');
    setTechStackStr(project.techStack?.join(', ') || '');
    setChallenge(project.challenge || '');
    setSolution(project.solution || '');
    setShowMoreModalOptions(false);
    setIsModalOpen(true);
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) return;

    const deliverables = deliverablesStr.split(',').map((s) => s.trim()).filter(Boolean);
    const techStack = techStackStr.split(',').map((s) => s.trim()).filter(Boolean);

    let updatedProjects: PortfolioProjectItem[];
    if (editingId) {
      updatedProjects = draft.projects.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title,
              client,
              category,
              year,
              impactMetric,
              summary,
              image,
              accentColor,
              deliverables,
              techStack,
              challenge,
              solution,
            }
          : p
      );
    } else {
      const newProject: PortfolioProjectItem = {
        id: `project-${Date.now()}`,
        title,
        client,
        category,
        year,
        impactMetric,
        impactLabel: 'Impact',
        summary,
        image,
        accentColor,
        deliverables,
        techStack,
        challenge,
        solution,
        outcome: '',
        previewGradient: '',
        featured: false,
        visible: true,
        order: draft.projects.length + 1,
      };
      updatedProjects = [...draft.projects, newProject];
    }

    const updatedPortfolio = { ...draft, projects: updatedProjects };
    setDraft(updatedPortfolio);

    // Save directly to repository and shared store so modal action immediately persists
    const res = updateContentSection('portfolio', updatedPortfolio);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: editingId ? `Project "${title}" updated!` : `Project "${title}" added and published!`,
      });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save project.' });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-32">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-display">
            Portfolio & Case Studies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, and reorder client project showcases, performance metrics, and deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Projects List ({draft.projects.length})
            </h2>
            <p className="text-xs text-slate-500">
              Projects shown on the Works showcase and Portfolio page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="space-y-3">
          {draft.projects.map((project, idx) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-indigo-600 bg-indigo-50">
                      {project.title.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">{project.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 uppercase">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{project.client} ({project.year})</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">{project.impactMetric}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    const list = [...draft.projects];
                    const temp = list[idx];
                    list[idx] = list[idx - 1];
                    list[idx - 1] = temp;
                    list.forEach((p, i) => { p.order = i + 1; });
                    setDraft({ ...draft, projects: list });
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={idx === draft.projects.length - 1}
                  onClick={() => {
                    const list = [...draft.projects];
                    const temp = list[idx];
                    list[idx] = list[idx + 1];
                    list[idx + 1] = temp;
                    list.forEach((p, i) => { p.order = i + 1; });
                    setDraft({ ...draft, projects: list });
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(project)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete project "${project.title}"?`)) {
                      setDraft({
                        ...draft,
                        projects: draft.projects.filter((p) => p.id !== project.id),
                      });
                    }
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Action Bar (hidden when modal is open) */}
      <EditorActionBar
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        feedback={feedback}
        sectionName="Portfolio"
        hidden={isModalOpen}
      />

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Apex Global Banking"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Apex Capital"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  >
                    <option value="saas">SaaS</option>
                    <option value="ai">AI Systems</option>
                    <option value="fintech">FinTech</option>
                    <option value="spatial">Spatial & 3D</option>
                    <option value="web">Web Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Verified Result / Impact
                  </label>
                  <input
                    type="text"
                    value={impactMetric}
                    onChange={(e) => setImpactMetric(e.target.value)}
                    placeholder="e.g. +45% Speed"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Summary
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A short overview of what was built."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              {/* Project Image */}
              <ImageFieldEditor
                label="Project Screenshot / Preview Image"
                imageSrc={image}
                onChange={(src) => setImage(src)}
                helperText="Screenshot shown on the project card and detail modal."
              />

              {/* Collapsible More Details */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMoreModalOptions(!showMoreModalOptions)}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold cursor-pointer"
                >
                  {showMoreModalOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{showMoreModalOptions ? 'Hide additional details' : 'More options (technologies & scope)'}</span>
                </button>

                {showMoreModalOptions && (
                  <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Deliverables (comma separated)
                      </label>
                      <input
                        type="text"
                        value={deliverablesStr}
                        onChange={(e) => setDeliverablesStr(e.target.value)}
                        placeholder="e.g. Next.js 15, Supabase, Tailwind"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Technologies (comma separated)
                      </label>
                      <input
                        type="text"
                        value={techStackStr}
                        onChange={(e) => setTechStackStr(e.target.value)}
                        placeholder="e.g. React 19, TypeScript, Docker"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
