/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminProvider, useAdmin } from './context/AdminStore';
import { DashboardLayout } from './components/admin/DashboardLayout';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { StreamerAssetsPage } from './pages/StreamerAssetsPage';
import { PricingPage } from './pages/PricingPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';
import { ArrowUp } from 'lucide-react';

export type AppPage = 'home' | 'about' | 'services' | 'streamer-assets' | 'pricing' | 'portfolio' | 'contact';

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['about', 'services', 'streamer-assets', 'pricing', 'portfolio', 'contact'].includes(hash)) {
        return hash as AppPage;
      }
    }
    return 'home';
  });

  // Admin authentication state (persisted in sessionStorage)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('nexordive_admin_auth') === 'true';
    }
    return false;
  });

  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      const isHashAdmin = window.location.hash === '#admin' || window.location.pathname.startsWith('/admin');
      const isAuth = sessionStorage.getItem('nexordive_admin_auth') === 'true';
      return isHashAdmin && isAuth;
    }
    return false;
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [modalSummary, setModalSummary] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [shouldScrollToContactForm, setShouldScrollToContactForm] = useState(false);
  const { addLead } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state with browser back/forward and URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        const isAuth = sessionStorage.getItem('nexordive_admin_auth') === 'true';
        if (isAuth) {
          setIsAdminView(true);
        } else {
          setIsAdminView(false);
          setIsAdminLoginOpen(true);
        }
        return;
      }
      setIsAdminView(false);

      if (['about', 'services', 'streamer-assets', 'pricing', 'portfolio', 'contact'].includes(hash)) {
        setCurrentPage(hash as AppPage);
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check if initial hash is admin without auth
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      const isAuth = sessionStorage.getItem('nexordive_admin_auth') === 'true';
      if (!isAuth) {
        setIsAdminLoginOpen(true);
      }
    }
  }, []);

  const handleNavigate = (page: string) => {
    setIsAdminView(false);
    setShouldScrollToContactForm(false);
    const validPage = (['home', 'about', 'services', 'streamer-assets', 'pricing', 'portfolio', 'contact'].includes(page)
      ? page
      : 'home') as AppPage;

    setCurrentPage(validPage);
    window.location.hash = validPage === 'home' ? '' : `#${validPage}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleStartProject = () => {
    setIsAdminView(false);

    const scrollToForm = () => {
      const formEl = document.getElementById('contact-form') || document.querySelector('form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameInput = document.getElementById('name') as HTMLInputElement | null;
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
        }
        return true;
      }
      return false;
    };

    if (currentPage === 'contact') {
      scrollToForm();
    } else {
      setShouldScrollToContactForm(true);
      setCurrentPage('contact');
      window.location.hash = '#contact';
      // Smooth scroll attempts after component mounts & entrance animation completes
      setTimeout(scrollToForm, 150);
      setTimeout(scrollToForm, 350);
      setTimeout(scrollToForm, 600);
    }
  };

  const handleOpenContactWithSummary = (summary: string) => {
    setModalSummary(summary);
    setIsContactModalOpen(true);
  };

  const handleOpenGeneralContact = () => {
    setModalSummary('');
    setIsContactModalOpen(true);
  };

  // Lead capture handler for CRM
  const handleLeadFormSuccess = (formData: any) => {
    addLead({
      name: formData.name,
      whatsapp: formData.whatsapp,
      email: formData.email,
      service: formData.service,
      budget: formData.budget,
      status: 'New',
      notes: formData.message || 'Direct lead captured from website contact form.',
    });
  };

  // Admin authentication handlers
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminView(true);
      window.location.hash = '#admin';
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = (adminEmail: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nexordive_admin_auth', 'true');
      sessionStorage.setItem('nexordive_admin_email', adminEmail);
    }
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setIsAdminView(true);
    window.location.hash = '#admin';
  };

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('nexordive_admin_auth');
      sessionStorage.removeItem('nexordive_admin_email');
    }
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
    window.location.hash = '';
    setCurrentPage('home');
  };

  // Admin Portal View
  if (isAdminView && isAdminAuthenticated) {
    return (
      <DashboardLayout
        onBackToSite={handleAdminLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-[#0d5363]/20 selection:text-[#0d5363]">
      {/* Sticky Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenContact={handleOpenGeneralContact}
        onStartProject={handleStartProject}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Dynamic Dedicated Page View with Smooth Entrance Animation */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <AnimatePresence mode="wait" initial={true}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 flex flex-col w-full"
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onOpenContact={handleOpenGeneralContact}
                onOpenContactWithSummary={handleOpenContactWithSummary}
                onStartProject={handleStartProject}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigate={handleNavigate}
                onOpenContact={handleOpenGeneralContact}
                onOpenContactWithSummary={handleOpenContactWithSummary}
                onStartProject={handleStartProject}
              />
            )}

            {currentPage === 'services' && (
              <ServicesPage
                onNavigateHome={() => handleNavigate('home')}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'streamer-assets' && (
              <StreamerAssetsPage
                onNavigateHome={() => handleNavigate('home')}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'pricing' && (
              <PricingPage
                onNavigateHome={() => handleNavigate('home')}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'portfolio' && (
              <PortfolioPage
                onNavigateHome={() => handleNavigate('home')}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                onNavigateHome={() => handleNavigate('home')}
                onSuccessSubmit={handleLeadFormSuccess}
                scrollToForm={shouldScrollToContactForm}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer on every page */}
      <Footer
        onNavigate={handleNavigate}
        onStartProject={handleStartProject}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Sticky Back-to-Top circular button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-white border border-slate-300 text-slate-800 flex items-center justify-center shadow-xl hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5 text-slate-700" />
        </button>
      )}

      {/* Global Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialSummary={modalSummary}
      />

      {/* Admin Login Modal (Form with ONLY Email & Password) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => {
          setIsAdminLoginOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <MainAppContent />
    </AdminProvider>
  );
}
