'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exact navigation links matching user's image
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'streamer-assets', label: 'Streamer Assets' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact' },
  ];

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

  const handleStartProjectClick = () => {
    setMobileMenuOpen(false);
    if (onStartProject) {
      onStartProject();
    } else if (onNavigate) {
      onNavigate('contact');
    }
  };

  const handleCallUs = () => {
    handleStartProjectClick();
  };

  const isSolidNav = isScrolled || currentPage !== 'home';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolidNav
          ? 'py-3.5 bg-[#0d5363]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Logo on Left - Geometric Stylized `<NEXOR | DIVE>` */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="NexorDive Home"
          >
            <div className="flex items-center tracking-widest text-white font-extrabold text-lg sm:text-2xl font-mono select-none">
              <span className="text-cyan-300 font-bold">&lt;</span>
              <span className="tracking-widest">NEXOR</span>
              <span className="mx-1 text-cyan-400 font-normal">|</span>
              <span className="tracking-widest">DIVE</span>
              <span className="text-cyan-300 font-bold">&gt;</span>
            </div>
          </a>

          {/* Center Nav Links - Matching user's image */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] tracking-wider font-semibold">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                  className={`transition-all py-1.5 px-3 text-[13px] tracking-wider cursor-pointer ${
                    isActive
                      ? 'text-white font-bold border border-white/70 rounded shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons (Facebook + LinkedIn buttons matching video) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Facebook Icon Button */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-[#0d5363] font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
              </svg>
            </a>

            {/* LinkedIn Icon Button */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-[#0d5363] font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>

            {/* Login Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all cursor-pointer shadow-xs"
                title="Login"
              >
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-b border-white/10 bg-[#0d5363] px-6 py-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.id);
                    }}
                    className={`text-base font-semibold py-2 border-b border-white/10 transition-colors ${
                      isActive ? 'text-cyan-200' : 'text-white hover:text-cyan-200'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              {onOpenAdmin && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
                  >
                    <span>Login</span>
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
