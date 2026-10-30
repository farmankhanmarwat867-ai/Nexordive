'use client';

import React from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
  Mail,
  Clock,
  Sparkles,
  Layout,
  FileText,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';
import { AdminTab } from './DashboardLayout';

interface OverviewViewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onBackToSite?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab, onBackToSite }) => {
  const { leads, content } = useAdmin();

  // Derived counts from actual local content
  const totalMessages = leads.length;
  const newMessagesCount = leads.filter((l) => l.status === 'New').length;
  const totalProjects = content.portfolio.projects.length;
  const totalPackages = content.pricing.plans.length + content.streamer.startingCards.length;
  const activeSectionsCount = content.sectionsManager.landingPageSections.filter((s) => s.visible).length;

  const recentMessages = leads.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Website Manager Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Easily manage your website pages, projects, pricing, and client messages from one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onBackToSite && onBackToSite()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Website</span>
          </button>
        </div>
      </div>

      {/* 4 Real Local Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Customer Inquiries */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Messages</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {totalMessages}
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">
              {newMessagesCount > 0 ? `${newMessagesCount} new unread` : 'All caught up'}
            </div>
          </div>
        </div>

        {/* Card 2: Portfolio Projects */}
        <div
          onClick={() => onNavigateTab('portfolio')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Portfolio Projects</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {totalProjects}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Live case studies
            </div>
          </div>
        </div>

        {/* Card 3: Packages & Pricing */}
        <div
          onClick={() => onNavigateTab('pricing')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pricing Packages</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {totalPackages}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Web & streamer tiers
            </div>
          </div>
        </div>

        {/* Card 4: Home Sections */}
        <div
          onClick={() => onNavigateTab('pages')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Homepage Sections</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Layout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {activeSectionsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Active page sections
            </div>
          </div>
        </div>
      </div>

      {/* 5 Quick Shortcuts as Requested */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">
            Quick Actions
          </h2>
          <p className="text-xs text-slate-500">
            Frequently used tasks for managing your website.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <button
            onClick={() => onNavigateTab('pages')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <Layout className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
              Edit Home Page
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Hero text, images & sections
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('portfolio')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
              Manage Projects
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Add or edit showcase works
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('pricing')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
              Update Prices
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Website & streamer packages
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('messages')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
              View Messages
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {newMessagesCount} new inquiries
            </div>
          </button>

          <button
            onClick={() => onBackToSite && onBackToSite()}
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
              Open Website
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Preview public site
            </div>
          </button>
        </div>
      </div>

      {/* Recent Client Messages */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Recent Client Inquiries
            </h2>
            <p className="text-xs text-slate-500">
              Direct contact requests submitted from the website.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('messages')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            View All ({totalMessages}) →
          </button>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No client inquiries yet. Messages submitted through the contact form will show up here.
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentMessages.map((lead) => {
              const cleanPhone = lead.whatsapp.replace(/[^0-9]/g, '');
              const isNew = lead.status === 'New';

              return (
                <div
                  key={lead.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{lead.name}</span>
                      {isNew ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          New
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
                          {lead.status}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">· {lead.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Service: <strong>{lead.service}</strong> ({lead.budget})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20NexorDive.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <button
                      onClick={() => onNavigateTab('messages')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
