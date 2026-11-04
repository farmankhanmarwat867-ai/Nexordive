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
        badge="Direct Communication"
        title="Initiate an Architectural Discovery"
        description="Whether you need a full enterprise rebuild, a multi-tenant SaaS platform, a headless Shopify store, or a focused prototype sprint, our staff engineers are ready to scope your requirements."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Contact' },
        ]}
      />

      {/* 2. Main Contact Section with WhatsApp, Email & Form */}
      <Contact onSuccessSubmit={onSuccessSubmit} className="pt-12 sm:pt-16 pb-24 border-t-0" />
    </div>
  );
};
