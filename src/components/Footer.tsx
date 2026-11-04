'use client';

import React from 'react';
import { ArrowUp, Sparkles, MessageCircle, Mail } from 'lucide-react';
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoPrefix = content?.global?.logoPrefix || 'NEXOR';
  const logoSuffix = content?.global?.logoSuffix || 'DIVE';
  const categoryTagline = content?.global?.categoryTagline || 'SOFTWARE • DIGITAL GROWTH • STREAMER ASSETS';
  const tagline = content?.global?.footerTagline || 'NexorDive helps startups, growing businesses, and creators design, build, automate, and market practical digital experiences worldwide.';
  const whatsapp = content?.global?.whatsappNumber || '+92 314 600 9810';
  const email = content?.global?.contactEmail || 'hello@nexordive.com';
  const copyright = content?.global?.copyrightText || '© 2026 NexorDive Digital Agency. All Rights Reserved.';

  const activeServices = (content?.services?.cards || []).filter((c) => c.visible);

  return (
    <footer className="bg-slate-100/90 pt-20 pb-0 text-slate-700 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand info (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Logo */}
            <div className="flex items-center tracking-widest text-[#004d6a] font-extrabold text-2xl font-mono select-none">
              <span className="text-cyan-600 font-light text-2xl mr-1">&lt;</span>
              <span className="tracking-[0.18em] font-black">{logoPrefix}</span>
              <span className="inline-block w-[1.5px] h-4.5 bg-slate-400 mx-2" />
              <span className="tracking-[0.18em] font-black">{logoSuffix}</span>
              <span className="text-cyan-600 font-light text-2xl ml-1">&gt;</span>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#004d6a] font-bold">
              {categoryTagline}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm font-normal">
              {tagline}
            </p>

            {/* Direct Contact Channels */}
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">WhatsApp:</span>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#004d6a] font-mono font-bold hover:underline"
                >
                  {whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">Email:</span>
                <a
                  href={`mailto:${email}`}
                  className="text-[#004d6a] font-mono font-bold hover:underline"
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
                    aria-label={`Follow NexorDive on ${s.label}`}
                    className="w-9 h-9 rounded-full bg-white hover:bg-[#004d6a] text-slate-700 hover:text-white border border-slate-200 flex items-center justify-center transition-all shadow-xs font-mono font-bold text-xs uppercase hover:scale-105 active:scale-95"
                  >
                    {s.label.slice(0, 2)}
                  </a>
                ))}
            </div>
          </div>

          {/* Useful Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-bold text-slate-900 font-serif text-base tracking-wide">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
              <button onClick={() => handleLink('home')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Home</button>
              <button onClick={() => handleLink('about')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">About</button>
              <button onClick={() => handleLink('services')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Services</button>
              <button onClick={() => handleLink('saas-development')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">SaaS Development</button>
              <button onClick={() => handleLink('shopify')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Shopify Store</button>
              <button onClick={() => handleLink('streamer-assets')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Streamer Assets</button>
              <button onClick={() => handleLink('pricing')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Pricing</button>
              <button onClick={() => handleLink('portfolio')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Portfolio</button>
              <button onClick={() => handleLink('blog')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Blog</button>
              <button onClick={() => handleLink('contact')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer">Contact</button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-left text-[#004d6a] font-bold hover:underline py-1.5 transition-colors cursor-pointer col-span-2 flex items-center gap-1.5 pt-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004d6a]" />
                  <span>Admin Console</span>
                </button>
              )}
            </div>
          </div>

          {/* Our Services (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-bold text-slate-900 font-serif text-base tracking-wide">
              Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-600">
              <button onClick={() => handleLink('web-development')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer truncate block">Web Development</button>
              <button onClick={() => handleLink('graphic-design')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer truncate block">Graphic Design</button>
              <button onClick={() => handleLink('digital-marketing')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer truncate block">Digital Marketing</button>
              <button onClick={() => handleLink('ai-automation')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer truncate block">AI Automation</button>
              <button onClick={() => handleLink('mobile-app-development')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer truncate block">Mobile App Dev</button>
              <button onClick={() => handleLink('saas-development')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer truncate block">SaaS Development</button>
              <button onClick={() => handleLink('shopify')} className="text-left hover:text-[#004d6a] py-1.5 transition-colors cursor-pointer truncate block">Shopify E-Commerce</button>
            </div>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#004d6a] border border-slate-200 text-xs font-medium transition-all shadow-xs active:scale-95 cursor-pointer"
                aria-label="Back to top of page"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Deep Teal Bottom Copyright Bar */}
      <div className="bg-[#004d6a] py-4 text-center text-xs text-white/90 font-medium tracking-wide">
        {copyright}
      </div>
    </footer>
  );
};
