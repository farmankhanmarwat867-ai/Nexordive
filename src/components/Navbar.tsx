'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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

  // Exact 6 navigation links matching user's reference image
  const defaultNavLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'services', label: 'SERVICES' },
    { id: 'blog', label: 'BLOG' },
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#004d6a] py-3.5 sm:py-4 shadow-md shadow-black/15 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. Left Logo - Stylized Geometric `<NEXOR | DIVE>` */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center select-none group cursor-pointer shrink-0"
            aria-label="NexorDive Home"
          >
            <div className="flex items-center text-white font-mono tracking-[0.18em] font-extrabold text-lg sm:text-2xl">
              <span className="text-white font-light text-2xl mr-1 select-none">&lt;</span>
              <span className="tracking-[0.18em] font-black">{logoPrefix}</span>
              <span className="inline-block w-[1.5px] h-4.5 bg-white/70 mx-2" />
              <span className="tracking-[0.18em] font-black">{logoSuffix}</span>
              <span className="text-white font-light text-2xl ml-1 select-none">&gt;</span>
            </div>
          </a>

          {/* 2. Center Nav Links - Exact Serif Uppercase Typography matching user reference */}
          <nav className="hidden lg:flex items-center gap-7 lg:gap-9 xl:gap-12">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id || (link.id === 'portfolio' && currentPage === 'portfolio');

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                  className={`font-serif uppercase text-[12.5px] xl:text-[13.5px] tracking-[0.16em] transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* 3. Right Action Icons (Facebook + LinkedIn white rounded square buttons) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Facebook White Button */}
            {showFacebook && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-[34px] h-[34px] rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-[#004d6a] transition-all hover:scale-105 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#004d6a]" viewBox="0 0 24 24">
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
                aria-label="LinkedIn"
                className="w-[34px] h-[34px] rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-[#004d6a] transition-all hover:scale-105 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#004d6a]" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
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
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-b border-white/10 bg-[#004d6a] px-6 py-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id || (link.id === 'portfolio' && currentPage === 'portfolio');
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.id);
                    }}
                    className={`font-serif uppercase text-sm tracking-[0.18em] py-2.5 border-b border-white/10 transition-colors ${
                      isActive ? 'text-cyan-200 font-bold' : 'text-white hover:text-cyan-200'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              {onOpenAdmin && (
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
                  >
                    <span>Admin Dashboard</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
