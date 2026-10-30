'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  Settings,
  ArrowLeft,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';
import { OverviewView } from './OverviewView';
import { LeadsView } from './LeadsView';
import { PortfolioView } from './PortfolioView';
import { PricingView } from './PricingView';
import { SettingsView } from './SettingsView';

interface DashboardLayoutProps {
  onBackToSite: () => void;
}

export type AdminTab = 'overview' | 'leads' | 'portfolio' | 'pricing' | 'settings';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDark, setThemeDark] = useState(false);
  const { leads, settings } = useAdmin();

  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & CRM', icon: Users, badge: newLeadsCount },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'pricing', label: 'Services & Pricing', icon: DollarSign },
    { id: 'settings', label: 'Site Settings & SEO', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex ${themeDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans`}>
      {/* 1. Sidebar (Desktop & Mobile Drawer) */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="w-4 h-4 text-white" />
              </span>
              <div>
                <span className="text-base font-extrabold text-white font-display block leading-none">
                  Nexor<span className="text-indigo-400">Dive</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Back to Live Site */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white transition-all cursor-pointer border border-slate-700/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Site</span>
          </button>

          <div className="px-2 py-1 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Version 2.4</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Shell (Header + Content) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header */}
        <header
          className={`h-16 px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors ${
            themeDark
              ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md'
              : 'bg-white/90 border-slate-200 backdrop-blur-md'
          }`}
        >
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Admin Console</span>
              <span>/</span>
              <span className={`font-bold capitalize ${themeDark ? 'text-white' : 'text-slate-900'}`}>
                {activeTab}
              </span>
            </div>
          </div>

          {/* Right: Controls & User Profile */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Toggle */}
            <button
              onClick={() => setThemeDark(!themeDark)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                themeDark
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:text-amber-300'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={themeDark ? 'Switch to Light Console' : 'Switch to Dark Console'}
            >
              {themeDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Live Site Link */}
            <button
              onClick={onBackToSite}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  F
                </div>
                <div className="text-left hidden sm:block">
                  <span className={`text-xs font-bold block leading-none ${themeDark ? 'text-white' : 'text-slate-900'}`}>
                    Farmanullah
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Owner & Admin
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl z-50 text-xs"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-slate-100">
                    <span className="font-bold text-slate-900 block">Farmanullah</span>
                    <span className="text-[11px] text-slate-500 font-mono truncate block">
                      {settings.contactEmail}
                    </span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account & SEO Settings</span>
                    </button>
                    <button
                      onClick={onBackToSite}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span>View Public Website</span>
                    </button>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={onBackToSite}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'leads' && <LeadsView />}
          {activeTab === 'portfolio' && <PortfolioView />}
          {activeTab === 'pricing' && <PricingView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};
