/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminStore';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onOpenContact?: () => void;
  onOpenAdmin?: () => void;
  onStartProject?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenContact,
  onOpenAdmin,
  onStartProject,
}) => {
  const { content } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation links matching user's reference image & site IA
  const defaultNavLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'services', label: 'SERVICES' },
    { id: 'saas', label: 'SAAS' },
    { id: 'shopify', label: 'SHOPIFY' },
    { id: 'streamer-assets', label: 'STREAMER ASSETS' },
    { id: 'pricing', label: 'PRICING' },
    { id: 'portfolio', label: 'PROJECTS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  // Dynamic CMS nav links if configured by admin, defaulting to the reference image structure
  const rawLinks = content?.global?.navLinks;
  const navLinks = Array.isArray(rawLinks) && rawLinks.length > 0
    ? [...rawLinks]
        .filter((link) => link.visible !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((link) => ({
          id: link.destination || link.id,
          label: link.label.toUpperCase(),
        }))
    : defaultNavLinks;

  // Social links & logo settings
  const facebookItem = content?.global?.socialLinks?.find((s) => s.platform === 'facebook');
  const linkedinItem = content?.global?.socialLinks?.find((s) => s.platform === 'linkedin');
  const facebookUrl = facebookItem !== undefined ? (facebookItem.url || '') : 'https://facebook.com';
  const linkedinUrl = linkedinItem !== undefined ? (linkedinItem.url || '') : 'https://linkedin.com';
  const showFacebook = facebookItem ? (facebookItem.visible !== false && facebookUrl.trim() !== '') : true;
  const showLinkedin = linkedinItem ? (linkedinItem.visible !== false && linkedinUrl.trim() !== '') : true;
  const logoPrefix = content?.global?.logoPrefix || 'NEXOR';
  const logoSuffix = content?.global?.logoSuffix || 'DIVE';

  const handleLinkClick = (pageId: string) => {
    setMobileMenuOpen(false);
    if (pageId === 'admin' && onOpenAdmin) {
      onOpenAdmin();
      return;
    }
    if (onNavigate) {
      onNavigate(pageId);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCtaClick = () => {
    if (onStartProject) {
      onStartProject();
    } else if (onOpenContact) {
      onOpenContact();
    } else if (onNavigate) {
      onNavigate('contact');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#004d6a]/95 backdrop-blur-md py-3.5 sm:py-4 shadow-md shadow-black/15 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. Left Logo - Official Nexordive 3D Visual Identity */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center select-none group cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-300 rounded-lg p-0.5"
            aria-label="Nexordive Home"
          >
            <img
              src="/assets/nexordive_logo_navbar.png"
              alt="Nexordive Logo"
              width={148}
              height={42}
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* 2. Center Nav Links - High-legibility Serif Uppercase Typography matching reference */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-8 shrink-0" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id || (link.id === 'saas' && (currentPage === 'saas' || currentPage === 'saas-development')) || (link.id === 'shopify' && (currentPage === 'shopify' || currentPage === 'shopify-development')) || (link.id === 'services' && (currentPage === 'web-development' || currentPage === 'graphic-design' || currentPage === 'digital-marketing' || currentPage === 'ai-automation' || currentPage === 'mobile-app-development' || currentPage === 'saas' || currentPage === 'saas-development' || currentPage === 'shopify' || currentPage === 'shopify-development')) || (link.id === 'portfolio' && currentPage === 'portfolio');

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                  className={`relative font-serif uppercase text-[12px] xl:text-[13px] tracking-[0.16em] whitespace-nowrap shrink-0 transition-all duration-200 py-1.5 px-2 rounded-md cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-white/80 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-[#4ee1d6] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* 3. Right Action Group (CTA button + Social Icons + Mobile Menu Toggle) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Start Project CTA (Desktop) */}
            <button
              onClick={handleCtaClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-sans font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-cyan-400/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Let's Talk</span>
            </button>

            {/* Facebook White Button */}
            {showFacebook && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit NexorDive on Facebook"
                className="w-9 h-9 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-[#004d6a] transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <svg className="w-4 h-4 fill-[#004d6a]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
            )}

            {/* LinkedIn White Button */}
            {showLinkedin && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit NexorDive on LinkedIn"
                className="w-9 h-9 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-[#004d6a] transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <svg className="w-4 h-4 fill-[#004d6a]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg text-white hover:bg-white/10 active:scale-95 flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-300"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-b border-white/10 bg-[#004d6a]/98 backdrop-blur-xl px-6 py-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id || (link.id === 'saas' && (currentPage === 'saas' || currentPage === 'saas-development')) || (link.id === 'shopify' && (currentPage === 'shopify' || currentPage === 'shopify-development')) || (link.id === 'services' && (currentPage === 'web-development' || currentPage === 'graphic-design' || currentPage === 'digital-marketing' || currentPage === 'ai-automation' || currentPage === 'mobile-app-development' || currentPage === 'saas' || currentPage === 'saas-development' || currentPage === 'shopify' || currentPage === 'shopify-development')) || (link.id === 'portfolio' && currentPage === 'portfolio');
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.id);
                    }}
                    className={`font-serif uppercase text-sm tracking-[0.18em] whitespace-nowrap py-3 px-3 rounded-lg border-b border-white/5 transition-all flex items-center justify-between ${
                      isActive ? 'bg-white/10 text-cyan-200 font-bold' : 'text-white/90 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </a>
                );
              })}

              {/* Mobile CTA */}
              <div className="pt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleCtaClick();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4ee1d6] via-[#38bdf8] to-[#818cf8] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Start a Project</span>
                </button>

                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  >
                    <span>Admin Access</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
