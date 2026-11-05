'use client';

import React from 'react';
import { useAdmin } from '../context/AdminStore';

interface FooterProps {
  onNavigate?: (page: string) => void;
  onStartProject?: () => void;
  onOpenAdmin?: () => void;
}

interface BrandStyle {
  label: string;
  buttonClasses: string;
  icon: (className?: string) => React.ReactNode;
}

const BRAND_CONFIG: Record<string, BrandStyle> = {
  facebook: {
    label: 'Facebook',
    buttonClasses:
      'bg-white text-[#1877F2] border border-slate-200/90 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] shadow-sm hover:shadow-md hover:shadow-blue-500/20',
    icon: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    buttonClasses:
      'bg-white text-[#0A66C2] border border-slate-200/90 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] shadow-sm hover:shadow-md hover:shadow-blue-600/20',
    icon: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8m1.37 9.74v-8.37H5.1v8.37h2.73z" />
      </svg>
    ),
  },
  twitter: {
    label: 'X',
    buttonClasses:
      'bg-white text-black border border-slate-200/90 hover:bg-black hover:text-white hover:border-black shadow-sm hover:shadow-md hover:shadow-black/20',
    icon: (cls = 'w-3.5 h-3.5 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  x: {
    label: 'X',
    buttonClasses:
      'bg-white text-black border border-slate-200/90 hover:bg-black hover:text-white hover:border-black shadow-sm hover:shadow-md hover:shadow-black/20',
    icon: (cls = 'w-3.5 h-3.5 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  github: {
    label: 'GitHub',
    buttonClasses:
      'bg-white text-[#8250df] border border-slate-200/90 hover:bg-[#8250df] hover:text-white hover:border-[#8250df] shadow-sm hover:shadow-md hover:shadow-purple-500/20',
    icon: (cls = 'w-4.5 h-4.5 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    buttonClasses:
      'bg-white text-[#E1306C] border border-slate-200/90 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] shadow-sm hover:shadow-md hover:shadow-pink-500/20',
    icon: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
};

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
          
          {/* Brand info (5 cols) */}
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

            {/* Social Circle Icons with Authentic Brand Colors */}
            <div className="flex items-center gap-3 pt-2">
              {(content?.global?.socialLinks || [])
                .filter((s) => s.visible)
                .map((s) => {
                  const key = (s.platform || s.label || '').toLowerCase();
                  const matchedKey =
                    key in BRAND_CONFIG
                      ? key
                      : key.includes('facebook')
                      ? 'facebook'
                      : key.includes('linkedin')
                      ? 'linkedin'
                      : key.includes('twitter') || key.includes('x')
                      ? 'x'
                      : key.includes('github')
                      ? 'github'
                      : key.includes('instagram')
                      ? 'instagram'
                      : null;

                  const brand = matchedKey ? BRAND_CONFIG[matchedKey] : null;
                  const displayLabel = brand ? brand.label : s.label;
                  const isTwitterOrX = matchedKey === 'x' || matchedKey === 'twitter';
                  const targetUrl =
                    isTwitterOrX && s.url === 'https://twitter.com'
                      ? 'https://x.com'
                      : s.url;

                  return (
                    <a
                      key={s.id}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={displayLabel}
                      title={displayLabel}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                        brand
                          ? brand.buttonClasses
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-[#0d5363] hover:text-white'
                      }`}
                    >
                      {brand ? (
                        brand.icon()
                      ) : (
                        <span className="font-bold text-xs uppercase">{s.label.slice(0, 2)}</span>
                      )}
                    </a>
                  );
                })}
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

      {/* Bottom Copyright bar */}
      <div className="bg-[#0d5363] py-4 text-center text-xs text-slate-300 font-medium">
        <div className="max-w-7xl mx-auto px-6">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};
