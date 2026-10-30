'use client';

import React from 'react';

interface FooterProps {
  onNavigate?: (page: string) => void;
  onStartProject?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onStartProject, onOpenAdmin }) => {
  const handleLink = (page: string) => {
    if (page === 'contact' && onStartProject) {
      onStartProject();
      return;
    }
    if (onNavigate) {
      onNavigate(page);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return (
    <footer className="bg-[#f1f5f9] pt-20 pb-0 text-slate-700 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand info (4 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Logo */}
            <div className="flex items-center tracking-widest text-[#0d5363] font-extrabold text-2xl font-mono select-none">
              <span className="text-[#0d5363] font-bold">&lt;</span>
              <span className="tracking-widest">NEXOR</span>
              <span className="mx-1 text-slate-400 font-normal">|</span>
              <span className="tracking-widest">DIVE</span>
              <span className="text-[#0d5363] font-bold">&gt;</span>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-[#0d5363] font-bold">
              SOFTWARE • DIGITAL GROWTH • STREAMER ASSETS
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              NexorDive builds websites, software systems, digital marketing assets, AI automation, and premium streamer graphics for brands and creators who want to grow online.
            </p>

            {/* Direct Contact Channels */}
            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <div>WhatsApp: <a href="https://wa.me/923146009810" target="_blank" rel="noopener noreferrer" className="text-[#0d5363] font-mono font-bold hover:underline">+92 314 600 9810</a></div>
              <div>Email: <a href="mailto:hello@nexordive.com" className="text-[#0d5363] font-mono hover:underline">hello@nexordive.com</a></div>
            </div>

            {/* Social Circle Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#94a3b8]/40 hover:bg-[#0d5363] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-[#94a3b8]/40 hover:bg-[#0d5363] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#94a3b8]/40 hover:bg-[#0d5363] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#94a3b8]/40 hover:bg-[#0d5363] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Useful Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm tracking-wide">
              Useful Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
              <button onClick={() => handleLink('home')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Home</button>
              <button onClick={() => handleLink('about')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">About</button>
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Services</button>
              <button onClick={() => handleLink('streamer-assets')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Streamer Assets</button>
              <button onClick={() => handleLink('pricing')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Pricing</button>
              <button onClick={() => handleLink('portfolio')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Portfolio</button>
              <button onClick={() => handleLink('contact')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Contact</button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-left text-[#0d5363] font-bold hover:underline py-1 transition-colors cursor-pointer col-span-2 flex items-center gap-1.5 pt-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d5363]" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Our Services (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm tracking-wide">
              Our Services
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Web Development</button>
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Software Development</button>
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Mobile App Development</button>
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Digital Marketing</button>
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Branding & Design</button>
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">AI Automation</button>
              <button onClick={() => handleLink('streamer-assets')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Streamer Graphics</button>
              <button onClick={() => handleLink('streamer-assets')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Overlays & Emotes</button>
            </div>
          </div>

        </div>
      </div>

      {/* Deep Teal Bottom Copyright Bar matching video */}
      <div className="bg-[#0d5363] py-4 text-center text-xs text-white/90 font-medium tracking-wide">
        &copy;2026. NexorDive All Rights Reserved.
      </div>
    </footer>
  );
};
