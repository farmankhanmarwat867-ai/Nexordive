'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Contact } from './Contact';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSummary?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialSummary = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl bg-[#FAFBFD] border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="pt-2">
          <Contact
            initialSummary={initialSummary}
            onSuccessSubmit={() => {
              // Leave submitted state visible inside modal
            }}
          />
        </div>
      </div>
    </div>
  );
};
