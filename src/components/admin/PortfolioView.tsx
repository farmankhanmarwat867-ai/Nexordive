'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, TrendingUp, Layers, ExternalLink, Check, Sparkles, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';
import { CaseStudy } from '../../types/agency';

export const PortfolioView: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState<CaseStudy['category']>('saas');
  const [year, setYear] = useState('2026');
  const [impactMetric, setImpactMetric] = useState('+38% Conversion');
  const [impactLabel, setImpactLabel] = useState('Production Conversion Lift');
  const [summary, setSummary] = useState('');
  const [techStackStr, setTechStackStr] = useState('Next.js 15, React 19, TypeScript, Tailwind');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [outcome, setOutcome] = useState('');
  const [accentColor, setAccentColor] = useState('#4F46E5');

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setClient('');
    setCategory('saas');
    setYear('2026');
    setImpactMetric('+45% Pipeline Velocity');
    setImpactLabel('Sprint Acceleration');
    setSummary('High-performance digital platform built for scale.');
    setTechStackStr('Next.js 15, React 19, TypeScript, Tailwind CSS');
    setChallenge('Legacy bottleneck in initial customer onboarding.');
    setSolution('Engineered bespoke edge-rendered architecture with micro-interactions.');
    setOutcome('Achieved 99/100 Lighthouse performance and zero missed delivery gates.');
    setAccentColor('#4F46E5');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: CaseStudy) => {
    setEditingId(project.id);
    setTitle(project.title);
    setClient(project.client);
    setCategory(project.category);
    setYear(project.year);
    setImpactMetric(project.impactMetric);
    setImpactLabel(project.impactLabel);
    setSummary(project.summary);
    setTechStackStr(project.techStack.join(', '));
    setChallenge(project.challenge);
    setSolution(project.solution);
    setOutcome(project.outcome);
    setAccentColor(project.accentColor);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client) return;

    const techStack = techStackStr.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingId) {
      updateProject(editingId, {
        title,
        client,
        category,
        year,
        impactMetric,
        impactLabel,
        summary,
        techStack,
        challenge,
        solution,
        outcome,
        accentColor,
      });
    } else {
      addProject({
        title,
        client,
        category,
        year,
        impactMetric,
        impactLabel,
        summary,
        deliverables: ['Custom Web Platform', 'Figma Design System', 'Edge API Integration'],
        techStack,
        challenge,
        solution,
        outcome,
        previewGradient: 'from-indigo-600/20 to-violet-600/20',
        accentColor,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Portfolio Manager (CRUD Operations)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, edit, and curate real showcase projects displayed on the live NexorDive site.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative group"
          >
            <div>
              {/* Category & Year */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span
                  className="px-2.5 py-0.5 rounded-full font-mono uppercase text-[10px] font-bold"
                  style={{
                    backgroundColor: `${proj.accentColor}15`,
                    color: proj.accentColor,
                  }}
                >
                  {proj.category}
                </span>
                <span className="font-mono text-slate-400">{proj.year}</span>
              </div>

              {/* Title & Client */}
              <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Client: <strong className="text-slate-800">{proj.client}</strong>
              </p>

              {/* Summary */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                {proj.summary}
              </p>

              {/* Verified Metric */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-4 text-xs">
                <span className="text-slate-500 text-[11px]">Outcome:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  {proj.impactMetric}
                </span>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1 mb-4">
                {proj.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live on Frontend
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {editingId ? 'Edit Portfolio Project' : 'Publish New Portfolio Project'}
                </h3>
                <p className="text-xs text-slate-500">
                  Update live deliverables, case studies, and impact metrics.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Apex Velocity Protocol"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Apex Global Labs"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="saas">Enterprise SaaS</option>
                    <option value="fintech">FinTech</option>
                    <option value="ai">AI Systems</option>
                    <option value="spatial">Spatial & 3D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Impact Metric</label>
                  <input
                    type="text"
                    value={impactMetric}
                    onChange={(e) => setImpactMetric(e.target.value)}
                    placeholder="+38% Conversion Lift"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={techStackStr}
                  onChange={(e) => setTechStackStr(e.target.value)}
                  placeholder="Next.js 15, React 19, TypeScript, PostgreSQL"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">The Challenge</label>
                  <textarea
                    rows={2}
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Architectural Solution</label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
