'use client';

import React, { useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Contact } from '../components/Contact';

interface ContactPageProps {
  onNavigateHome?: () => void;
  onSuccessSubmit: (data: any) => void;
  scrollToForm?: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
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
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="Contact Nexordive"
        title="Let’s Discuss Your Digital Project"
        description="Tell us what you want to create or improve. Whether you need a website, online store, brand identity, marketing support, business automation or custom software, a clear project brief helps us discuss the right next steps."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Contact' },
        ]}
      />

      {/* 2. Main Contact Section with WhatsApp, Email & Form */}
      <Contact onSuccessSubmit={onSuccessSubmit} hideHeader={true} className="pt-8 sm:pt-10 pb-24 border-t-0" />
    </div>
  );
};
