'use client';

import React, { useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Contact } from '../components/Contact';
import { useAdmin } from '../context/AdminStore';

interface ContactPageProps {
  onNavigateHome: () => void;
  onSuccessSubmit: (data: any) => void;
  scrollToForm?: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
  onSuccessSubmit,
  scrollToForm = false,
}) => {
  const { content } = useAdmin();
  const header = content?.pageHeaders?.contact;

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
    <div className="flex-1">
      {/* Page Header Banner */}
      <PageHeader
        badge={header?.badge || 'Get In Touch'}
        title={header?.title || "Let's Start Your Next Digital Project"}
        description={
          header?.description ||
          'Connect directly with our engineering and design leads. We offer 24-hour proposal turnarounds, strict mutual NDAs, and clear milestone blueprints.'
        }
        currentPage="Contact"
        onNavigateHome={onNavigateHome}
      />

      {/* Main Contact Section with WhatsApp, Email & Form */}
      <Contact onSuccessSubmit={onSuccessSubmit} />
    </div>
  );
};
