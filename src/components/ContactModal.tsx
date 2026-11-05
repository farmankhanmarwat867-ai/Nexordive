'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Contact, ContactFormData } from './Contact';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSummary?: string;
  onSuccessSubmit?: (data: ContactFormData) => Promise<{ success: boolean; id?: string; error?: string } | void> | { success: boolean; id?: string; error?: string } | void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialSummary = '',
  onSuccessSubmit,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Contact and Inquiry Modal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl bg-[#f8fafc] border border-slate-200/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer z-10 focus-visible:ring-2 focus-visible:ring-[#004d6a]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <Contact
              isModal={true}
              initialSummary={initialSummary}
              onSuccessSubmit={onSuccessSubmit}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
