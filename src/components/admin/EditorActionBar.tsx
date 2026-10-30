'use client';

import React from 'react';
import { Save, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface EditorActionBarProps {
  isDirty: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  feedback?: { type: 'success' | 'error'; message: string } | null;
  sectionName?: string;
  hidden?: boolean;
  title?: string;
  description?: string;
}

export const EditorActionBar: React.FC<EditorActionBarProps> = ({
  isDirty,
  onSave,
  onCancel,
  isSaving = false,
  feedback,
  sectionName,
  hidden = false,
  title,
}) => {
  const effectiveSectionName = sectionName || title || 'this section';
  // If there are no changes, no feedback message, or explicitly hidden (e.g. inside modal), hide bar
  if (hidden || (!isDirty && !feedback)) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Save changes actions"
      style={{ left: 'var(--admin-sidebar-offset, 0px)' }}
      className="fixed bottom-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-4 py-3 sm:px-8 sm:py-3.5 transition-all duration-300 animate-slideUp max-w-full box-border"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Status Area */}
        <div className="flex items-center gap-3 min-w-0">
          {feedback ? (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="truncate">{feedback.message}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-xs font-bold text-slate-800">
                Unsaved changes
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-500">
                · Changes in {effectiveSectionName} will be live once saved
              </span>
            </div>
          )}
        </div>

        {/* Right Buttons Area */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
