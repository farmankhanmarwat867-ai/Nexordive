'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  LayoutDashboard,
  Layout,
  Briefcase,
  DollarSign,
  MessageSquare,
  Settings,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';
import { OverviewView } from './OverviewView';
import { LeadsView } from './LeadsView';
import { PagesSectionsView } from './editors/PagesSectionsView';
import { PortfolioEditorView } from './editors/PortfolioEditorView';
import { PricingEditorView } from './editors/PricingEditorView';
import { SettingsEditorView } from './editors/SettingsEditorView';
import { UnsavedChangesModal } from './UnsavedChangesModal';

interface DashboardLayoutProps {
  onBackToSite: () => void;
}

export type AdminTab =
  | 'overview'
  | 'pages'
  | 'portfolio'
  | 'pricing'
  | 'messages'
  | 'settings';

type PendingNavAction =
  | { type: 'tab'; tab: AdminTab }
  | { type: 'backToSite' };

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { leads, content } = useAdmin();

  // Dirty state tracking across active editors
  const [isDirty, setIsDirty] = useState(false);
  const [isSavingPending, setIsSavingPending] = useState(false);
  const saveHandlerRef = useRef<(() => Promise<boolean>) | null>(null);
  const cancelHandlerRef = useRef<(() => void) | null>(null);

  // Navigation guard modal
  const [pendingNav, setPendingNav] = useState<PendingNavAction | null>(null);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);

  const handleDirtyChange = useCallback(
    (dirty: boolean, saveFn: () => Promise<boolean>, cancelFn: () => void) => {
      setIsDirty(dirty);
      saveHandlerRef.current = saveFn;
      cancelHandlerRef.current = cancelFn;
    },
    []
  );

  const handleNavigateTab = (targetTab: AdminTab) => {
    if (targetTab === activeTab) {
      setSidebarOpen(false);
      return;
    }
    if (isDirty) {
      setPendingNav({ type: 'tab', tab: targetTab });
      setIsUnsavedModalOpen(true);
      return;
    }
    setIsDirty(false);
    saveHandlerRef.current = null;
    cancelHandlerRef.current = null;
    setActiveTab(targetTab);
    setSidebarOpen(false);
  };

  const handleNavigateBack = () => {
    if (isDirty) {
      setPendingNav({ type: 'backToSite' });
      setIsUnsavedModalOpen(true);
      return;
    }
    onBackToSite();
  };

  const handleModalSaveAndContinue = async () => {
    setIsSavingPending(true);
    try {
      if (saveHandlerRef.current) {
        const success = await saveHandlerRef.current();
        if (!success) {
          setIsUnsavedModalOpen(false);
          setIsSavingPending(false);
          return;
        }
      }
      setIsDirty(false);
      setIsUnsavedModalOpen(false);

      if (pendingNav?.type === 'tab') {
        setActiveTab(pendingNav.tab);
      } else if (pendingNav?.type === 'backToSite') {
        onBackToSite();
      }
      setPendingNav(null);
      setSidebarOpen(false);
    } finally {
      setIsSavingPending(false);
    }
  };

  const handleModalDiscardAndContinue = () => {
    if (cancelHandlerRef.current) {
      cancelHandlerRef.current();
    }
    setIsDirty(false);
    setIsUnsavedModalOpen(false);

    if (pendingNav?.type === 'tab') {
      setActiveTab(pendingNav.tab);
    } else if (pendingNav?.type === 'backToSite') {
      onBackToSite();
    }
    setPendingNav(null);
    setSidebarOpen(false);
  };

  const handleModalKeepEditing = () => {
    setIsUnsavedModalOpen(false);
    setPendingNav(null);
  };

  const newMessagesCount = leads.filter((l) => l.status === 'New').length;

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pages', label: 'Website Pages', icon: Layout },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'pricing', label: 'Packages & Pricing', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: newMessagesCount },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  return (
    <div
      className="admin-root min-h-screen flex bg-slate-50 text-slate-900 font-sans"
      style={{
        '--admin-sidebar-width': isSidebarCollapsed ? '4.5rem' : '16rem',
      } as React.CSSProperties}
    >
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. Simplified Sidebar */}
      <aside
        style={{ width: 'var(--admin-sidebar-width, 16rem)' }}
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </span>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <span className="text-sm font-extrabold text-white font-display block leading-none truncate">
                    {content.global.agencyName}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider mt-1 block">
                    Website Manager
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Desktop collapse toggle */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>

              {/* Mobile drawer close */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Simple Navigation Menu */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigateTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                  } py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with single unobtrusive notice and return button */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          {!isSidebarCollapsed && (
            <div className="text-[11px] text-slate-400 text-center">
              Demo mode: changes are saved in this browser only.
            </div>
          )}

          <button
            onClick={handleNavigateBack}
            title={isSidebarCollapsed ? 'Return to Website' : undefined}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-2' : 'justify-center gap-2 py-2.5 px-4'
            } rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer`}
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {!isSidebarCollapsed && <span>Return to Website</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Wrapper */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ paddingLeft: 'var(--admin-sidebar-offset, 0px)' }}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              NexorDive Manager Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigateBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>View Website</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  A
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold block leading-none text-slate-900">
                    Website Manager
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl z-50 text-xs"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleNavigateTab('settings')}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Website Settings</span>
                  </button>

                  <button
                    onClick={handleNavigateBack}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Manager</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. Main Workspace */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-7xl w-full mx-auto relative min-h-screen">
          {activeTab === 'overview' && (
            <OverviewView
              onNavigateTab={(tab) => handleNavigateTab(tab)}
              onBackToSite={handleNavigateBack}
            />
          )}
          {activeTab === 'pages' && <PagesSectionsView onDirtyChange={handleDirtyChange} />}
          {activeTab === 'portfolio' && <PortfolioEditorView onDirtyChange={handleDirtyChange} />}
          {activeTab === 'pricing' && <PricingEditorView onDirtyChange={handleDirtyChange} />}
          {activeTab === 'messages' && <LeadsView />}
          {activeTab === 'settings' && <SettingsEditorView onDirtyChange={handleDirtyChange} />}
        </main>
      </div>

      {/* Accidental Loss Prevention Dialog */}
      <UnsavedChangesModal
        isOpen={isUnsavedModalOpen}
        onSaveAndContinue={handleModalSaveAndContinue}
        onDiscardAndContinue={handleModalDiscardAndContinue}
        onKeepEditing={handleModalKeepEditing}
        isSaving={isSavingPending}
      />
    </div>
  );
};
