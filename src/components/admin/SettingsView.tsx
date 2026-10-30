'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, Globe, MessageCircle, Mail, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useAdmin();

  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [metaTitle, setMetaTitle] = useState(settings.metaTitle);
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription);
  const [ogImageUrl, setOgImageUrl] = useState(settings.ogImageUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsappNumber,
      contactEmail,
      agencyName,
      metaTitle,
      metaDescription,
      ogImageUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Site Settings & Global SEO
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure primary communication channels, Google indexing meta tags, and Open Graph previews.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Contact Information */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Direct Contact Channels
              </h2>
              <p className="text-xs text-slate-500">
                These numbers and emails appear in the Header, Footer, and Contact Form links.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Primary WhatsApp Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+92 314 600 9810"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Format with country code. Used for instant 1-click WhatsApp redirects.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Primary Contact Email *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="farmanullahk111@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Receives copy of lead notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Global SEO & Search Console */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Search Engine Optimization & Social Cards
              </h2>
              <p className="text-xs text-slate-500">
                Powers your Google Search ranking, OpenGraph preview cards, and Twitter Cards.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Default Meta Title *
              </label>
              <input
                type="text"
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Recommended 50–60 characters. Appears as the clickable headline in Google search results.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Default Meta Description *
              </label>
              <textarea
                rows={3}
                required
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Recommended 140–160 characters. Summarizes the agency value proposition for search engines.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                OpenGraph Share Image URL
              </label>
              <input
                type="text"
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                placeholder="https://nexordive.com/og-image.png"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                High-resolution 1200x630 banner shown when sharing links on LinkedIn, WhatsApp, Facebook, or Discord.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Google Crawling Direct Endpoints */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <span className="font-bold text-slate-800 block">
            Generated Crawling Directives
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">app/robots.ts:</span>
              <span className="text-indigo-600 font-bold">/robots.txt (Live)</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">app/sitemap.ts:</span>
              <span className="text-indigo-600 font-bold">/sitemap.xml (Live)</span>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings & SEO</span>
          </button>
        </div>
      </form>
    </div>
  );
};
