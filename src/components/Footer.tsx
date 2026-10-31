'use client';

import React from 'react';
import { useAdmin } from '../context/AdminStore';

interface FooterProps {
  onNavigate?: (page: string) => void;
  onStartProject?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onStartProject, onOpenAdmin }) => {
  const { content } = useAdmin();

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

  const logoPrefix = content?.global?.logoPrefix || 'NEXOR';
  const logoSuffix = content?.global?.logoSuffix || 'DIVE';
  const categoryTagline = content?.global?.categoryTagline || 'SOFTWARE • DIGITAL GROWTH • STREAMER ASSETS';
  const tagline = content?.global?.footerTagline || 'NexorDive builds websites, software systems, digital marketing assets, AI automation, and premium streamer graphics for brands and creators who want to grow online.';
  const whatsapp = content?.global?.whatsappNumber || '+92 314 600 9810';
  const email = content?.global?.contactEmail || 'hello@nexordive.com';
  const copyright = content?.global?.copyrightText || '© 2026. NexorDive All Rights Reserved.';

  const activeServices = (content?.services?.cards || []).filter((c) => c.visible);

  return (
    <footer className="bg-[#f1f5f9] pt-20 pb-0 text-slate-700 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand info (4 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Logo */}
            <div className="flex items-center tracking-widest text-[#0d5363] font-extrabold text-2xl font-mono select-none">
              <span className="text-[#0d5363] font-bold">&lt;</span>
              <span className="tracking-widest">{logoPrefix}</span>
              <span className="mx-1 text-slate-400 font-normal">|</span>
              <span className="tracking-widest">{logoSuffix}</span>
              <span className="text-[#0d5363] font-bold">&gt;</span>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-[#0d5363] font-bold">
              {categoryTagline}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              {tagline}
            </p>

            {/* Direct Contact Channels */}
            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <div>
                WhatsApp:{' '}
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0d5363] font-mono font-bold hover:underline"
                >
                  {whatsapp}
                </a>
              </div>
              <div>
                Email:{' '}
                <a
                  href={`mailto:${email}`}
                  className="text-[#0d5363] font-mono hover:underline"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Social Circle Icons */}
            <div className="flex items-center gap-3 pt-2">
              {(content?.global?.socialLinks || [])
                .filter((s) => s.visible)
                .map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-[#94a3b8]/40 hover:bg-[#0d5363] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm font-bold text-xs uppercase"
                  >
                    {s.label.slice(0, 2)}
                  </a>
                ))}
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
              {activeServices.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleLink('services')}
                  className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer truncate block"
                >
                  {card.title}
                </button>
              ))}
              <button onClick={() => handleLink('streamer-assets')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Streamer Graphics</button>
              <button onClick={() => handleLink('streamer-assets')} className="text-left hover:text-[#0d5363] py-1 transition-colors cursor-pointer">Overlays & Emotes</button>
            </div>
          </div>

        </div>
      </div>

      {/* Deep Teal Bottom Copyright Bar */}
      <div className="bg-[#0d5363] py-4 text-center text-xs text-white/90 font-medium tracking-wide">
        {copyright}
      </div>
    </footer>
  );
};
