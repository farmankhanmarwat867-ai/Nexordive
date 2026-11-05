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
import { WebDevelopmentPage } from './pages/WebDevelopmentPage';
import { GraphicDesignPage } from './pages/GraphicDesignPage';
import { DigitalMarketingPage } from './pages/DigitalMarketingPage';
import { AIAutomationPage } from './pages/AIAutomationPage';
import { MobileAppDevelopmentPage } from './pages/MobileAppDevelopmentPage';
import { StreamerAssetsPage } from './pages/StreamerAssetsPage';
import { PricingPage } from './pages/PricingPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { SaaSPage } from './pages/SaaSPage';
import { ShopifyPage } from './pages/ShopifyPage';
import { ArrowUp } from 'lucide-react';

export type AppPage =
  | 'home'
  | 'about'
  | 'services'
  | 'web-development'
  | 'graphic-design'
  | 'digital-marketing'
  | 'ai-automation'
  | 'mobile-app-development'
  | 'saas'
  | 'saas-development'
  | 'shopify'
  | 'shopify-development'
  | 'blog'
  | 'streamer-assets'
  | 'pricing'
  | 'portfolio'
  | 'contact';

function parsePageFromLocation(): AppPage {
  if (typeof window === 'undefined') return 'home';

  const hash = window.location.hash.replace('#', '').toLowerCase().replace(/^\/+|\/+$/g, '');
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');

  const resolveSlug = (raw: string): AppPage | null => {
    if (!raw) return null;
    const s = raw.toLowerCase().replace(/^\/+|\/+$/g, '');

    if (s === 'web-development' || s === 'services/web-development') return 'web-development';
    if (s === 'graphic-design' || s === 'services/graphic-design') return 'graphic-design';
    if (s === 'digital-marketing' || s === 'services/digital-marketing') return 'digital-marketing';
    if (s === 'ai-automation' || s === 'services/ai-automation') return 'ai-automation';
    if (s === 'mobile-app-development' || s === 'services/mobile-app-development') return 'mobile-app-development';
    if (s === 'saas' || s === 'saas-development' || s === 'services/saas' || s === 'services/saas-development') return 'saas-development';
    if (s === 'shopify' || s === 'shopify-development' || s === 'services/shopify' || s === 'services/shopify-development') return 'shopify-development';
    if (s === 'about') return 'about';
    if (s === 'services') return 'services';
    if (s === 'portfolio' || s === 'work') return 'portfolio';
    if (s === 'pricing') return 'pricing';
    if (s === 'contact') return 'contact';
    if (s === 'blog') return 'blog';
    if (s === 'streamer-assets' || s === 'streamer') return 'streamer-assets';
    return null;
  };

  return resolveSlug(hash) || resolveSlug(path) || 'home';
}

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => parsePageFromLocation());

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state with browser back/forward and URL hash/path
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin' || window.location.pathname.startsWith('/admin')) {
        const isAuth = sessionStorage.getItem('nexordive_admin_auth') === 'true';
        if (isAuth) {
          setIsAdminAuthenticated(true);
          setIsAdminView(true);
        } else {
          setIsAdminView(false);
          setIsAdminLoginOpen(true);
        }
        return;
      }
      setIsAdminView(false);

      const resolved = parsePageFromLocation();
      setCurrentPage(resolved);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Dynamic SEO meta tags per page
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let title = 'Nexordive | Web Development, AI Automation & Digital Marketing';
    let description =
      'Nexordive provides web development, graphic design, digital marketing, AI automation, mobile apps, SaaS and Shopify services for growing businesses.';
    let canonical = 'https://www.nexordive.com/';

    if (currentPage === 'web-development') {
      title = 'Web Development Services for Businesses | Nexordive';
      description =
        'Responsive websites, landing pages and custom web solutions by Nexordive. Explore professional web development for startups and growing businesses.';
      canonical = 'https://www.nexordive.com/services/web-development';
    } else if (currentPage === 'graphic-design') {
      title = 'Graphic Design & Brand Identity Services | Nexordive';
      description =
        'Explore logo design, visual identity, social media graphics and marketing creatives. Nexordive helps businesses create consistent, professional branding.';
      canonical = 'https://www.nexordive.com/services/graphic-design';
    } else if (currentPage === 'digital-marketing') {
      title = 'Digital Marketing, SEO & Social Media Services | Nexordive';
      description =
        'Nexordive offers digital marketing strategy, SEO foundations, social media content, campaign creatives and lead generation planning for businesses.';
      canonical = 'https://www.nexordive.com/services/digital-marketing';
    } else if (currentPage === 'ai-automation') {
      title = 'AI Automation & Workflow Solutions | Nexordive';
      description =
        'Discover AI chatbots, lead handling automation, workflow integrations and internal business automation solutions with Nexordive.';
      canonical = 'https://www.nexordive.com/services/ai-automation';
    } else if (currentPage === 'mobile-app-development') {
      title = 'Mobile App Development for Android & iOS | Nexordive';
      description =
        'Plan and build intuitive mobile app experiences with Nexordive. Explore Android and iOS application design, MVP development and app interface solutions.';
      canonical = 'https://www.nexordive.com/services/mobile-app-development';
    } else if (currentPage === 'saas' || currentPage === 'saas-development') {
      title = 'SaaS Development & MVP Solutions | Nexordive';
      description =
        'Turn software ideas into structured SaaS products. Nexordive supports SaaS MVP planning, dashboards, user workflows and custom software development.';
      canonical = 'https://www.nexordive.com/services/saas-development';
    } else if (currentPage === 'shopify' || currentPage === 'shopify-development') {
      title = 'Shopify Store Design & Development | Nexordive';
      description =
        'Launch or improve your online store with Shopify setup, theme customization, product pages and mobile-friendly storefront development by Nexordive.';
      canonical = 'https://www.nexordive.com/services/shopify-development';
    } else if (currentPage === 'services') {
      title = 'Services | Nexordive Digital Solutions';
      description =
        'Web development, graphic design, digital marketing, AI automation, mobile apps, SaaS and Shopify services by Nexordive.';
      canonical = 'https://www.nexordive.com/services';
    } else if (currentPage === 'about') {
      title = 'About Nexordive | Digital Solutions & Technology Services';
      description =
        'Learn about Nexordive, a digital services brand focused on web development, design, marketing, automation, mobile apps, SaaS and Shopify solutions.';
      canonical = 'https://www.nexordive.com/about';
    } else if (currentPage === 'portfolio') {
      title = 'Selected Work & Concepts | Nexordive';
      description =
        'Explore website layouts, interface concepts, branding directions and automation examples by Nexordive.';
      canonical = 'https://www.nexordive.com/portfolio';
    } else if (currentPage === 'pricing') {
      title = 'Transparent Pricing Packages | Nexordive';
      description =
        'Predictable, transparent investment packages for web development, MVP engineering, and streamer design suites.';
      canonical = 'https://www.nexordive.com/pricing';
    } else if (currentPage === 'contact') {
      title = 'Contact Nexordive | Discuss Your Digital Project';
      description =
        'Contact Nexordive about web development, branding, marketing, AI automation, mobile apps, SaaS or Shopify. Share your project requirements today.';
      canonical = 'https://www.nexordive.com/contact';
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonical);
    }

    const linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonical);
    }
  }, [currentPage]);

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
    const targetPage = page === 'saas' ? 'saas-development' : page === 'shopify' ? 'shopify-development' : page;
    const validPage = (
      [
        'home',
        'about',
        'services',
        'web-development',
        'graphic-design',
        'digital-marketing',
        'ai-automation',
        'mobile-app-development',
        'saas',
        'saas-development',
        'shopify',
        'shopify-development',
        'blog',
        'streamer-assets',
        'pricing',
        'portfolio',
        'contact',
      ].includes(targetPage)
        ? targetPage
        : 'home'
    ) as AppPage;

    setCurrentPage(validPage);
    const targetPath = validPage === 'home' ? '/' : `/${validPage}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ page: validPage }, '', targetPath);
      if (window.location.hash) {
        window.history.replaceState({ page: validPage }, '', targetPath);
      }
    }
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
    return addLead({
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-[#004d6a]/20 selection:text-[#004d6a]">
      {/* Accessible Skip to Content Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Sticky Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenContact={handleOpenGeneralContact}
        onStartProject={handleStartProject}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Dynamic Dedicated Page View with Smooth Entrance Animation */}
      <main id="main-content" className="flex-1 flex flex-col overflow-x-hidden">
        <AnimatePresence mode="wait" initial={true}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
              duration: 0.45,
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
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigateWebDevelopment={() => handleNavigate('web-development')}
                onNavigateGraphicDesign={() => handleNavigate('graphic-design')}
                onNavigateDigitalMarketing={() => handleNavigate('digital-marketing')}
                onNavigateAIAutomation={() => handleNavigate('ai-automation')}
                onNavigateMobileAppDevelopment={() => handleNavigate('mobile-app-development')}
                onNavigateSaaS={() => handleNavigate('saas-development')}
                onNavigateShopify={() => handleNavigate('shopify-development')}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'web-development' && (
              <WebDevelopmentPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateServices={() => handleNavigate('services')}
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigate={handleNavigate}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'graphic-design' && (
              <GraphicDesignPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateServices={() => handleNavigate('services')}
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigate={handleNavigate}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'digital-marketing' && (
              <DigitalMarketingPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateServices={() => handleNavigate('services')}
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigate={handleNavigate}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'ai-automation' && (
              <AIAutomationPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateServices={() => handleNavigate('services')}
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigate={handleNavigate}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'mobile-app-development' && (
              <MobileAppDevelopmentPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateServices={() => handleNavigate('services')}
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigate={handleNavigate}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {(currentPage === 'saas' || currentPage === 'saas-development') && (
              <SaaSPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateServices={() => handleNavigate('services')}
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigate={handleNavigate}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {(currentPage === 'shopify' || currentPage === 'shopify-development') && (
              <ShopifyPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateServices={() => handleNavigate('services')}
                onNavigatePricing={() => handleNavigate('pricing')}
                onNavigate={handleNavigate}
                onOpenContactWithSummary={handleOpenContactWithSummary}
              />
            )}

            {currentPage === 'blog' && (
              <BlogPage />
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
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white flex items-center justify-center shadow-2xl hover:scale-108 active:scale-95 transition-all cursor-pointer border border-cyan-400/30 backdrop-blur-md"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5 text-cyan-200" />
        </button>
      )}

      {/* Global Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialSummary={modalSummary}
        onSuccessSubmit={handleLeadFormSuccess}
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
