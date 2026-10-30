'use client';

import React from 'react';
import { AlertCircle, Save, RotateCcw, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  sectionName?: string;
  isSaving?: boolean;
  onSaveAndContinue: () => void;
  onDiscardAndContinue: () => void;
  onKeepEditing: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  sectionName = 'this section',
  isSaving = false,
  onSaveAndContinue,
  onDiscardAndContinue,
  onKeepEditing,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close "X" button triggers Keep Editing */}
        <button
          type="button"
          onClick={onKeepEditing}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Unsaved Changes
            </h3>
            <span className="text-xs text-amber-700 font-medium">
              You have modified {sectionName}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          You have unsaved changes that will be lost if you leave without saving. What would you like to do?
        </p>

        {/* 3 Clear Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isSaving}
            onClick={onSaveAndContinue}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save and continue'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onDiscardAndContinue}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard and continue</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onKeepEditing}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer"
          >
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
};
