'use client';

import React, { useEffect } from 'react';
import { Contact } from '../components/Contact';

interface ContactPageProps {
  onNavigateHome?: () => void;
  onSuccessSubmit: (data: any) => void;
  scrollToForm?: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onSuccessSubmit,
  scrollToForm = false,
}) => {
  useEffect(() => {
    if (scrollToForm) {
      const scrollTimer = setTimeout(() => {
        const formEl = document.getElementById('contact-form');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const nameInput = document.getElementById('name') as HTMLInputElement | null;
          if (nameInput) {
            nameInput.focus({ preventScroll: true });
          }
        }
      }, 400);
      return () => clearTimeout(scrollTimer);
    }
  }, [scrollToForm]);

  return (
    <div className="flex-1 bg-[#f8fafc]">
      {/* Main Contact Section with WhatsApp, Email & Form */}
      <Contact onSuccessSubmit={onSuccessSubmit} className="pt-28 sm:pt-36 border-t-0" />
    </div>
  );
};
