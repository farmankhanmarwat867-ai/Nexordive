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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-5xl bg-[#f8fafc] border border-slate-200/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <Contact
          isModal={true}
          initialSummary={initialSummary}
          onSuccessSubmit={() => {
            // Leave submitted state visible inside modal
          }}
        />
      </div>
    </div>
  );
};
