'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAdmin } from '../../../context/AdminStore';
import { EditorActionBar } from '../EditorActionBar';
import { UnsavedChangesModal } from '../UnsavedChangesModal';
import { ImageFieldEditor } from '../ImageFieldEditor';
import { IconPicker } from '../IconPicker';
import { DynamicIcon } from '../../common/DynamicIcon';
import { ActionSelector } from '../common/ActionSelector';
import {
  Layout,
  Sparkles,
  User,
  Users,
  Layers,
  FileText,
  Code2,
  Clock,
  Star,
  BookOpen,
  Award,
  Zap,
  Mail,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
} from 'lucide-react';
import {
  HeroContent,
  MissionContent,
  PageHeadersContent,
  SectionsManagerContent,
  ServicesContent,
  ServiceCardItem,
  ProcessContent,
  ProcessStepItem,
  TestimonialsContent,
  TestimonialItem,
  BlogContent,
  BlogCardItem,
  PartnersContent,
  ContactContent,
  CtaBannerContent,
  AboutPageContent,
  AboutTeamMember,
  AboutCorePillar,
  MarqueePlatformItem,
  MarqueePlatformKey,
} from '../../../types/content';
import { DEFAULT_ABOUT_PAGE_CONTENT } from '../../../data/defaultContent';

export type PageSectionId =
  | 'home-layout'
  | 'hero'
  | 'about'
  | 'about-page'
  | 'services'
  | 'process'
  | 'testimonials'
  | 'blog'
  | 'partners'
  | 'cta-banner'
  | 'contact'
  | 'page-headers';

interface PagesSectionsViewProps {
  initialSection?: PageSectionId;
  onDirtyChange?: (dirty: boolean, saveFn: () => Promise<boolean>, discardFn: () => void) => void;
}

export const PagesSectionsView: React.FC<PagesSectionsViewProps> = ({
  initialSection = 'home-layout',
  onDirtyChange,
}) => {
  const { content, updateContentSection } = useAdmin();

  const [activeSection, setActiveSection] = useState<PageSectionId>(initialSection);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Unsaved changes navigation modal
  const [pendingSectionSwitch, setPendingSectionSwitch] = useState<PageSectionId | null>(null);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);

  // Independent, deep-cloned draft states
  const [sectionsDraft, setSectionsDraft] = useState<SectionsManagerContent>(() => structuredClone(content.sectionsManager));
  const [heroDraft, setHeroDraft] = useState<HeroContent>(() => structuredClone(content.hero));
  const [ctaBannerDraft, setCtaBannerDraft] = useState<CtaBannerContent>(() => structuredClone(content.ctaBanner));
  const [missionDraft, setMissionDraft] = useState<MissionContent>(() => structuredClone(content.mission));
  const [servicesDraft, setServicesDraft] = useState<ServicesContent>(() => structuredClone(content.services));
  const [processDraft, setProcessDraft] = useState<ProcessContent>(() => structuredClone(content.process));
  const [testimonialsDraft, setTestimonialsDraft] = useState<TestimonialsContent>(() => structuredClone(content.testimonials));
  const [blogDraft, setBlogDraft] = useState<BlogContent>(() => structuredClone(content.blog));
  const [partnersDraft, setPartnersDraft] = useState<PartnersContent>(() => {
    const clone = structuredClone(content.partners);
    if (!Array.isArray(clone.platforms) || clone.platforms.length === 0) {
      clone.platforms = [
        { id: 'plat-linkedin', name: 'LinkedIn', platformKey: 'linkedin', url: 'https://linkedin.com', visible: true, order: 1 },
        { id: 'plat-facebook', name: 'Facebook', platformKey: 'facebook', url: 'https://facebook.com', visible: true, order: 2 },
        { id: 'plat-twitter', name: 'Twitter', platformKey: 'twitter', url: 'https://twitter.com', visible: true, order: 3 },
        { id: 'plat-x', name: 'X Platform', platformKey: 'x', url: 'https://x.com', visible: true, order: 4 },
        { id: 'plat-instagram', name: 'Instagram', platformKey: 'instagram', url: 'https://instagram.com', visible: true, order: 5 },
        { id: 'plat-youtube', name: 'YouTube', platformKey: 'youtube', url: 'https://youtube.com', visible: true, order: 6 },
        { id: 'plat-github', name: 'GitHub', platformKey: 'github', url: 'https://github.com', visible: true, order: 7 },
        { id: 'plat-discord', name: 'Discord', platformKey: 'discord', url: 'https://discord.com', visible: true, order: 8 },
      ];
    }
    return clone;
  });
  const [contactDraft, setContactDraft] = useState<ContactContent>(() => structuredClone(content.contact));
  const [headersDraft, setHeadersDraft] = useState<PageHeadersContent>(() => structuredClone(content.pageHeaders));
  const [aboutPageDraft, setAboutPageDraft] = useState<AboutPageContent>(() =>
    structuredClone(content.aboutPage || DEFAULT_ABOUT_PAGE_CONTENT)
  );

  // Modal / focused edit item states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<string | null>(null);
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null);
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);

  // Calculate dirty state for the active section
  const isDirty = useMemo(() => {
    switch (activeSection) {
      case 'home-layout':
        return JSON.stringify(sectionsDraft) !== JSON.stringify(content.sectionsManager);
      case 'hero':
        return JSON.stringify(heroDraft) !== JSON.stringify(content.hero);
      case 'cta-banner':
        return JSON.stringify(ctaBannerDraft) !== JSON.stringify(content.ctaBanner);
      case 'about':
        return JSON.stringify(missionDraft) !== JSON.stringify(content.mission);
      case 'about-page':
        return JSON.stringify(aboutPageDraft) !== JSON.stringify(content.aboutPage || DEFAULT_ABOUT_PAGE_CONTENT);
      case 'services':
        return JSON.stringify(servicesDraft) !== JSON.stringify(content.services);
      case 'process':
        return JSON.stringify(processDraft) !== JSON.stringify(content.process);
      case 'testimonials':
        return JSON.stringify(testimonialsDraft) !== JSON.stringify(content.testimonials);
      case 'blog':
        return JSON.stringify(blogDraft) !== JSON.stringify(content.blog);
      case 'partners':
        return JSON.stringify(partnersDraft) !== JSON.stringify(content.partners);
      case 'contact':
        return JSON.stringify(contactDraft) !== JSON.stringify(content.contact);
      case 'page-headers':
        return JSON.stringify(headersDraft) !== JSON.stringify(content.pageHeaders);
      default:
        return false;
    }
  }, [
    activeSection,
    sectionsDraft,
    heroDraft,
    missionDraft,
    aboutPageDraft,
    servicesDraft,
    processDraft,
    testimonialsDraft,
    blogDraft,
    partnersDraft,
    contactDraft,
    headersDraft,
    ctaBannerDraft,
    content,
  ]);

  // Native browser beforeunload warning when dirty
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Section names mapping
  const sectionLabels: Record<PageSectionId, string> = {
    'home-layout': 'Home Layout & Sections',
    'cta-banner': 'Bottom CTA Banner',
    hero: 'Hero Section',
    about: 'About & Mission (Home)',
    'about-page': 'Dedicated About Page',
    services: 'Services Grid',
    process: 'Process Methodology',
    testimonials: 'Client Testimonials',
    blog: 'Blog Cards',
    partners: 'Platforms Marquee',
    contact: 'Contact Section Copy',
    'page-headers': 'Page Banners',
  };

  // Perform validation on the active draft
  const validateActiveDraft = (): { valid: boolean; error?: string } => {
    if (activeSection === 'cta-banner') {
      if (!ctaBannerDraft.heading.trim()) {
        return { valid: false, error: 'Banner heading is required.' };
      }
    } else if (activeSection === 'hero') {
      if (!heroDraft.headingLine1.trim()) {
        return { valid: false, error: 'Headline Line 1 is required.' };
      }
    } else if (activeSection === 'about') {
      if (!missionDraft.heading.trim()) {
        return { valid: false, error: 'Mission statement heading is required.' };
      }
    } else if (activeSection === 'about-page') {
      if (!aboutPageDraft.intro.heading.trim()) {
        return { valid: false, error: 'About Intro heading is required.' };
      }
    } else if (activeSection === 'services') {
      for (const card of servicesDraft.cards) {
        if (!card.title.trim()) {
          return { valid: false, error: 'Every service card must have a title.' };
        }
      }
    } else if (activeSection === 'contact') {
      if (!contactDraft.sectionTitle.trim()) {
        return { valid: false, error: 'Contact heading is required.' };
      }
    }
    return { valid: true };
  };

  // Execute Save
  const handleSave = async (): Promise<boolean> => {
    const validation = validateActiveDraft();
    if (!validation.valid) {
      setFeedback({ type: 'error', message: validation.error || 'Please correct errors before saving.' });
      return false;
    }

    setIsSaving(true);
    let result: { success: boolean; error?: string } = { success: true };

    try {
      switch (activeSection) {
        case 'home-layout':
          result = updateContentSection('sectionsManager', sectionsDraft);
          break;
        case 'hero':
          result = updateContentSection('hero', heroDraft);
          break;
        case 'cta-banner':
          result = updateContentSection('ctaBanner', ctaBannerDraft);
          break;
        case 'about':
          result = updateContentSection('mission', missionDraft);
          break;
        case 'about-page':
          result = updateContentSection('aboutPage', aboutPageDraft);
          break;
        case 'services':
          result = updateContentSection('services', servicesDraft);
          break;
        case 'process':
          result = updateContentSection('process', processDraft);
          break;
        case 'testimonials':
          result = updateContentSection('testimonials', testimonialsDraft);
          break;
        case 'blog':
          result = updateContentSection('blog', blogDraft);
          break;
        case 'partners':
          result = updateContentSection('partners', partnersDraft);
          break;
        case 'contact':
          result = updateContentSection('contact', contactDraft);
          break;
        case 'page-headers':
          result = updateContentSection('pageHeaders', headersDraft);
          break;
      }

      if (result.success) {
        setFeedback({ type: 'success', message: `${sectionLabels[activeSection]} saved! Website updated.` });
        setTimeout(() => setFeedback(null), 3500);
        return true;
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to save changes. Your draft was kept.' });
        return false;
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'An unexpected error occurred while saving.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel & Discard
  const handleCancel = () => {
    switch (activeSection) {
      case 'home-layout':
        setSectionsDraft(structuredClone(content.sectionsManager));
        break;
      case 'hero':
        setHeroDraft(structuredClone(content.hero));
        break;
      case 'cta-banner':
        setCtaBannerDraft(structuredClone(content.ctaBanner));
        break;
      case 'about':
        setMissionDraft(structuredClone(content.mission));
        break;
      case 'about-page':
        setAboutPageDraft(structuredClone(content.aboutPage || DEFAULT_ABOUT_PAGE_CONTENT));
        setEditingTeamMemberId(null);
        setEditingPillarId(null);
        break;
      case 'services':
        setServicesDraft(structuredClone(content.services));
        setEditingServiceId(null);
        break;
      case 'process':
        setProcessDraft(structuredClone(content.process));
        break;
      case 'testimonials':
        setTestimonialsDraft(structuredClone(content.testimonials));
        setEditingTestimonialId(null);
        break;
      case 'blog':
        setBlogDraft(structuredClone(content.blog));
        setEditingBlogId(null);
        break;
      case 'partners':
        setPartnersDraft(structuredClone(content.partners));
        setEditingPlatformId(null);
        break;
      case 'contact':
        setContactDraft(structuredClone(content.contact));
        break;
      case 'page-headers':
        setHeadersDraft(structuredClone(content.pageHeaders));
        break;
    }
    setFeedback(null);
  };

  // Report dirty state and handlers to parent (DashboardLayout)
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty, handleSave, handleCancel);
    }
  }, [isDirty, onDirtyChange]);

  // Section switching with unsaved changes dialog
  const handleSectionClick = (newSection: PageSectionId) => {
    if (newSection === activeSection) return;

    if (isDirty) {
      setPendingSectionSwitch(newSection);
      setIsUnsavedModalOpen(true);
      return;
    }

    setActiveSection(newSection);
    setFeedback(null);
  };

  const handleModalSaveAndContinue = async () => {
    const success = await handleSave();
    if (success && pendingSectionSwitch) {
      setIsUnsavedModalOpen(false);
      setActiveSection(pendingSectionSwitch);
      setPendingSectionSwitch(null);
    }
  };

  const handleModalDiscardAndContinue = () => {
    handleCancel();
    setIsUnsavedModalOpen(false);
    if (pendingSectionSwitch) {
      setActiveSection(pendingSectionSwitch);
      setPendingSectionSwitch(null);
    }
  };

  const handleModalKeepEditing = () => {
    setIsUnsavedModalOpen(false);
    setPendingSectionSwitch(null);
  };

  // Section buttons list
  const sectionNavList: { id: PageSectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home-layout', label: 'Home Layout', icon: Layout },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'about', label: 'About & Mission', icon: User },
    { id: 'about-page', label: 'About Page', icon: Users },
    { id: 'services', label: 'Services', icon: Code2 },
    { id: 'process', label: 'Process Steps', icon: Clock },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'blog', label: 'Blog Cards', icon: BookOpen },
    { id: 'partners', label: 'Platforms Marquee', icon: Award },
    { id: 'cta-banner', label: 'Bottom CTA Banner', icon: Zap },
    { id: 'contact', label: 'Contact Text', icon: Mail },
  ];

  return (
    <div className="space-y-6 pb-28 sm:pb-32">
      {/* Top Header Information */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Website Pages & Sections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Editing: <strong className="text-indigo-600">{sectionLabels[activeSection]}</strong>. Edit values below and save when ready.
          </p>
        </div>
      </div>

      {/* Clean Horizontal Section Selector */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-xs">
        {sectionNavList.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSectionClick(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. HOME LAYOUT & ORDER */}
      {activeSection === 'home-layout' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Home Page Sections Order & Visibility
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Use Move Up and Move Down to change which section appears first on your homepage. You can also hide any optional section.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {sectionsDraft.landingPageSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {sec.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {sec.visible ? 'Visible on homepage' : 'Hidden from homepage'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      const list = [...sectionsDraft.landingPageSections];
                      const temp = list[idx];
                      list[idx] = list[idx - 1];
                      list[idx - 1] = temp;
                      list.forEach((item, i) => { item.order = i + 1; });
                      setSectionsDraft({ landingPageSections: list });
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === sectionsDraft.landingPageSections.length - 1}
                    onClick={() => {
                      const list = [...sectionsDraft.landingPageSections];
                      const temp = list[idx];
                      list[idx] = list[idx + 1];
                      list[idx + 1] = temp;
                      list.forEach((item, i) => { item.order = i + 1; });
                      setSectionsDraft({ landingPageSections: list });
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSectionsDraft({
                        landingPageSections: sectionsDraft.landingPageSections.map((s) =>
                          s.id === sec.id ? { ...s, visible: !s.visible } : s
                        ),
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      sec.visible
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM CTA BANNER */}
      {activeSection === 'cta-banner' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Homepage Bottom CTA Banner
            </h2>
            <p className="text-xs text-slate-500">
              The high-conversion banner displayed near the footer of the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={ctaBannerDraft.eyebrow}
                onChange={(e) => setCtaBannerDraft({ ...ctaBannerDraft, eyebrow: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Heading *
              </label>
              <input
                type="text"
                value={ctaBannerDraft.heading}
                onChange={(e) => setCtaBannerDraft({ ...ctaBannerDraft, heading: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description Paragraph
            </label>
            <textarea
              rows={3}
              value={ctaBannerDraft.description}
              onChange={(e) => setCtaBannerDraft({ ...ctaBannerDraft, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                value={ctaBannerDraft.primaryButtonLabel}
                onChange={(e) => setCtaBannerDraft({ ...ctaBannerDraft, primaryButtonLabel: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <ActionSelector
              label="Primary Button Action"
              value={ctaBannerDraft.primaryButtonAction || 'start-project'}
              onChange={(action) => setCtaBannerDraft({ ...ctaBannerDraft, primaryButtonAction: action })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={ctaBannerDraft.secondaryButtonLabel}
                onChange={(e) => setCtaBannerDraft({ ...ctaBannerDraft, secondaryButtonLabel: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <ActionSelector
              label="Secondary Button Action"
              value={ctaBannerDraft.secondaryButtonAction || 'services'}
              onChange={(action) => setCtaBannerDraft({ ...ctaBannerDraft, secondaryButtonAction: action })}
            />
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Hero Headline & Intro Text
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Line 1 *
                </label>
                <input
                  type="text"
                  value={heroDraft.headingLine1}
                  onChange={(e) => setHeroDraft({ ...heroDraft, headingLine1: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Line 2
                </label>
                <input
                  type="text"
                  value={heroDraft.headingLine2}
                  onChange={(e) => setHeroDraft({ ...heroDraft, headingLine2: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Line 3
                </label>
                <input
                  type="text"
                  value={heroDraft.headingLine3}
                  onChange={(e) => setHeroDraft({ ...heroDraft, headingLine3: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Line 4
                </label>
                <input
                  type="text"
                  value={heroDraft.headingLine4}
                  onChange={(e) => setHeroDraft({ ...heroDraft, headingLine4: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intro Paragraph
              </label>
              <textarea
                rows={3}
                value={heroDraft.description}
                onChange={(e) => setHeroDraft({ ...heroDraft, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={heroDraft.primaryButtonLabel}
                  onChange={(e) => setHeroDraft({ ...heroDraft, primaryButtonLabel: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={heroDraft.secondaryButtonLabel}
                  onChange={(e) => setHeroDraft({ ...heroDraft, secondaryButtonLabel: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Hero Graphic Image */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Hero Visual Graphic
            </h2>
            <ImageFieldEditor
              label="Main Hero Graphic"
              imageSrc={heroDraft.image}
              imageAlt={heroDraft.imageAlt}
              onChange={(src, alt) => setHeroDraft({ ...heroDraft, image: src, imageAlt: alt || '' })}
              helperText="The visual graphic shown on the right side of the hero section."
            />
          </div>

          {/* Stat Cards Under Hero */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Hero Highlight Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {heroDraft.statCards.map((stat, idx) => (
                <div key={stat.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Stat Value #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...heroDraft.statCards];
                        updated[idx].value = e.target.value;
                        setHeroDraft({ ...heroDraft, statCards: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...heroDraft.statCards];
                        updated[idx].label = e.target.value;
                        setHeroDraft({ ...heroDraft, statCards: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ABOUT & MISSION */}
      {activeSection === 'about' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              About Section Content
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Small Pre-heading Pill
              </label>
              <input
                type="text"
                value={missionDraft.preheading ?? 'About NexorDive'}
                onChange={(e) => setMissionDraft({ ...missionDraft, preheading: e.target.value })}
                placeholder="About NexorDive"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Headline *
              </label>
              <input
                type="text"
                value={missionDraft.heading}
                onChange={(e) => setMissionDraft({ ...missionDraft, heading: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description Paragraph
              </label>
              <textarea
                rows={4}
                value={missionDraft.description}
                onChange={(e) => setMissionDraft({ ...missionDraft, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Read More Button Label
                </label>
                <input
                  type="text"
                  value={missionDraft.readMoreLabel ?? 'Read More'}
                  onChange={(e) => setMissionDraft({ ...missionDraft, readMoreLabel: e.target.value })}
                  placeholder="Read More"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <ActionSelector
                label="Read More Button Action"
                value={missionDraft.readMoreAction || 'about'}
                onChange={(action) => setMissionDraft({ ...missionDraft, readMoreAction: action })}
              />
            </div>
          </div>

          {/* About Section Visuals & Media (All 3 Images) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <span>About Section Images & Visuals</span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-cyan-50 text-cyan-700 rounded-full border border-cyan-200">
                    3 Images Managed
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage each of the 3 visual image elements displayed in the About section on the home page.
                </p>
              </div>
            </div>

            {/* Image 1: Main Section Graphic */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  Main Graphic Illustration (Right Side)
                </span>
                <span className="text-[11px] text-slate-400">Large tech screen curved graphic</span>
              </div>
              <ImageFieldEditor
                label="Main Illustration Image"
                imageSrc={missionDraft.missionImage}
                imageAlt={missionDraft.missionImageAlt}
                onChange={(src, alt) => setMissionDraft({ ...missionDraft, missionImage: src, missionImageAlt: alt || '' })}
                helperText="Primary curved illustration displaying screens and digital tech on the right."
              />
            </div>

            {/* Image 2: Secondary Feature / Accent Graphic */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  Secondary Feature Card / Icon (Bottom-Left)
                </span>
                <span className="text-[11px] text-slate-400">Accent mobile / tech badge</span>
              </div>
              <ImageFieldEditor
                label="Secondary Accent Image"
                imageSrc={missionDraft.secondaryImage || ''}
                imageAlt={missionDraft.secondaryImageAlt || ''}
                onChange={(src, alt) => setMissionDraft({ ...missionDraft, secondaryImage: src, secondaryImageAlt: alt || '' })}
                helperText="Floating card or icon on the lower-left corner (e.g. mobile app preview or metrics badge)."
              />
              <div className="flex items-center gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMissionDraft({ ...missionDraft, secondaryImage: '/assets/about_feature_icon.png', secondaryImageAlt: 'Feature Accent Icon' })}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Apply Built-in Feature Icon
                </button>
                {missionDraft.secondaryImage && (
                  <button
                    type="button"
                    onClick={() => setMissionDraft({ ...missionDraft, secondaryImage: '', secondaryImageAlt: '' })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Clear Custom Image
                  </button>
                )}
              </div>
            </div>

            {/* Image 3: Founder & CEO Avatar Photo */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                  Executive Avatar Photo (CEO Badge)
                </span>
                <span className="text-[11px] text-slate-400">Floating badge profile picture</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Founder / Executive Name
                  </label>
                  <input
                    type="text"
                    value={missionDraft.ceoBadgeName}
                    onChange={(e) => setMissionDraft({ ...missionDraft, ceoBadgeName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    value={missionDraft.ceoBadgeTitle}
                    onChange={(e) => setMissionDraft({ ...missionDraft, ceoBadgeTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <ImageFieldEditor
                label="Executive Avatar Photo"
                imageSrc={missionDraft.ceoAvatar}
                onChange={(src) => setMissionDraft({ ...missionDraft, ceoAvatar: src })}
                helperText="Circular profile photo displayed inside the floating CEO leadership badge."
              />
            </div>

            {/* Live Interactive Composite Preview of all 3 Images */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Live Preview: All 3 Visual Elements in Context
                </span>
                <span className="text-[11px] text-slate-400">Real-time composite layout</span>
              </div>

              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/90 overflow-hidden flex items-center justify-center">
                <div className="relative w-full max-w-[460px]">
                  {/* Image 1 Preview */}
                  <img
                    src={missionDraft.missionImage || '/assets/about_nexordive_graphic.png'}
                    alt={missionDraft.missionImageAlt || 'About NexorDive'}
                    className="w-full h-auto object-contain select-none rounded-xl"
                  />

                  {/* Image 2 Preview (if provided) */}
                  {missionDraft.secondaryImage && (
                    <div className="absolute bottom-[10%] left-[1.5%] w-[25%] max-w-[110px] aspect-square rounded-2xl bg-[#004d6a] p-1.5 shadow-2xl border border-cyan-400/30 overflow-hidden z-20 flex items-center justify-center">
                      <img
                        src={missionDraft.secondaryImage}
                        alt={missionDraft.secondaryImageAlt || 'Feature'}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  )}

                  {/* Image 3 Preview: CEO Badge */}
                  <div className="absolute bottom-[5%] right-[2%] inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#004d6a] text-white shadow-xl border border-cyan-400/30 max-w-[85%] z-20">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 border-2 border-white shrink-0 shadow-md">
                      <img
                        src={missionDraft.ceoAvatar || '/assets/akleem_orakzai_avatar.png'}
                        alt={missionDraft.ceoBadgeName || 'Executive'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left pr-1 min-w-0">
                      <div className="text-xs font-serif font-bold text-white tracking-wide uppercase truncate">
                        {missionDraft.ceoBadgeName || 'Akleem Orakzai'}
                      </div>
                      <div className="text-[10px] text-cyan-200 font-serif font-medium mt-0.5 leading-snug">
                        {missionDraft.ceoBadgeTitle || 'CEO'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3B. DEDICATED ABOUT PAGE */}
      {activeSection === 'about-page' && (
        <div className="space-y-6">
          {/* Section Visibility */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                About Page Section Visibility
              </h2>
              <p className="text-xs text-slate-500">
                Choose which sections are displayed on the public About page (/about).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { key: 'intro', label: 'Intro Section' },
                { key: 'consultation', label: 'Consultation Banner' },
                { key: 'team', label: 'Team Members Grid' },
                { key: 'pillars', label: 'Core Pillars' },
              ].map((item) => {
                const isVis = aboutPageDraft.sectionsVisibility[item.key as keyof typeof aboutPageDraft.sectionsVisibility] !== false;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setAboutPageDraft({
                        ...aboutPageDraft,
                        sectionsVisibility: {
                          ...aboutPageDraft.sectionsVisibility,
                          [item.key]: !isVis,
                        },
                      });
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isVis
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isVis ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intro Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              1. Intro Section ("Choose NexorDive")
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pre-heading Badge / Eyebrow
                </label>
                <input
                  type="text"
                  value={aboutPageDraft.intro.eyebrow}
                  onChange={(e) =>
                    setAboutPageDraft({
                      ...aboutPageDraft,
                      intro: { ...aboutPageDraft.intro, eyebrow: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Heading *
                </label>
                <input
                  type="text"
                  value={aboutPageDraft.intro.heading}
                  onChange={(e) =>
                    setAboutPageDraft({
                      ...aboutPageDraft,
                      intro: { ...aboutPageDraft.intro, heading: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paragraph 1
              </label>
              <textarea
                rows={3}
                value={aboutPageDraft.intro.paragraph1}
                onChange={(e) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    intro: { ...aboutPageDraft.intro, paragraph1: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paragraph 2
              </label>
              <textarea
                rows={3}
                value={aboutPageDraft.intro.paragraph2}
                onChange={(e) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    intro: { ...aboutPageDraft.intro, paragraph2: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={aboutPageDraft.intro.buttonLabel}
                  onChange={(e) =>
                    setAboutPageDraft({
                      ...aboutPageDraft,
                      intro: { ...aboutPageDraft.intro, buttonLabel: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <ActionSelector
                label="Button Destination / Action"
                value={aboutPageDraft.intro.buttonAction || 'start-project'}
                onChange={(action) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    intro: { ...aboutPageDraft.intro, buttonAction: action },
                  })
                }
              />
            </div>

            <div className="pt-2">
              <ImageFieldEditor
                label="Technology Tree Diagram Card"
                imageSrc={aboutPageDraft.intro.techTreeImage}
                imageAlt={aboutPageDraft.intro.techTreeImageAlt}
                onChange={(src, alt) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    intro: {
                      ...aboutPageDraft.intro,
                      techTreeImage: src,
                      techTreeImageAlt: alt || '',
                    },
                  })
                }
                helperText="Circuit/tree technology architecture visual card shown on the right side."
              />
            </div>
          </div>

          {/* Consultation Banner Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              2. Consultation Banner ("Start Project With Us ?")
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner Heading
              </label>
              <input
                type="text"
                value={aboutPageDraft.consultation.heading}
                onChange={(e) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    consultation: { ...aboutPageDraft.consultation, heading: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner Description
              </label>
              <textarea
                rows={3}
                value={aboutPageDraft.consultation.description}
                onChange={(e) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    consultation: { ...aboutPageDraft.consultation, description: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={aboutPageDraft.consultation.buttonLabel}
                  onChange={(e) =>
                    setAboutPageDraft({
                      ...aboutPageDraft,
                      consultation: { ...aboutPageDraft.consultation, buttonLabel: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <ActionSelector
                label="CTA Button Action"
                value={aboutPageDraft.consultation.buttonAction || 'start-project'}
                onChange={(action) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    consultation: { ...aboutPageDraft.consultation, buttonAction: action },
                  })
                }
              />
            </div>

            <div className="pt-2">
              <ImageFieldEditor
                label="Full-Width Background Photo"
                imageSrc={aboutPageDraft.consultation.backgroundImage}
                imageAlt={aboutPageDraft.consultation.backgroundImageAlt}
                onChange={(src, alt) =>
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    consultation: {
                      ...aboutPageDraft.consultation,
                      backgroundImage: src,
                      backgroundImageAlt: alt || '',
                    },
                  })
                }
                helperText="Atmospheric background image behind the dark consultation card."
              />
            </div>
          </div>

          {/* Team Members Grid Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  3. Team Members ({aboutPageDraft.teamMembers.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Manage engineering leads, architects, and founders shown on the About page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newMember: AboutTeamMember = {
                    id: `member-${Date.now()}`,
                    name: 'New Engineer',
                    role: 'Full-Stack Engineer',
                    image: '/assets/about/team/member_1_architect.jpg',
                    bio: 'Skilled product engineer building high-performance modern web platforms.',
                    linkedin: 'https://linkedin.com',
                    visible: true,
                    order: aboutPageDraft.teamMembers.length + 1,
                  };
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    teamMembers: [...aboutPageDraft.teamMembers, newMember],
                  });
                  setEditingTeamMemberId(newMember.id);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {aboutPageDraft.teamMembers.map((member, idx) => {
                const isEditing = editingTeamMemberId === member.id;
                const isCeo = member.isLeader || member.id === 'ceo';
                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-300 shrink-0">
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{member.name}</span>
                            {isCeo && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                CEO / Founder
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{member.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const next = [...aboutPageDraft.teamMembers];
                            const [m] = next.splice(idx, 1);
                            next.splice(idx - 1, 0, m);
                            setAboutPageDraft({
                              ...aboutPageDraft,
                              teamMembers: next.map((item, i) => ({ ...item, order: i + 1 })),
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === aboutPageDraft.teamMembers.length - 1}
                          onClick={() => {
                            const next = [...aboutPageDraft.teamMembers];
                            const [m] = next.splice(idx, 1);
                            next.splice(idx + 1, 0, m);
                            setAboutPageDraft({
                              ...aboutPageDraft,
                              teamMembers: next.map((item, i) => ({ ...item, order: i + 1 })),
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = aboutPageDraft.teamMembers.map((m) =>
                              m.id === member.id ? { ...m, visible: !m.visible } : m
                            );
                            setAboutPageDraft({ ...aboutPageDraft, teamMembers: updated });
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            member.visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                          }`}
                          title={member.visible ? 'Visible' : 'Hidden'}
                        >
                          {member.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTeamMemberId(isEditing ? null : member.id)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {!isCeo && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = aboutPageDraft.teamMembers.filter((m) => m.id !== member.id);
                              setAboutPageDraft({ ...aboutPageDraft, teamMembers: updated });
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Form */}
                    {isEditing && (
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => {
                                const updated = aboutPageDraft.teamMembers.map((m) =>
                                  m.id === member.id ? { ...m, name: e.target.value } : m
                                );
                                setAboutPageDraft({ ...aboutPageDraft, teamMembers: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Role / Job Title</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => {
                                const updated = aboutPageDraft.teamMembers.map((m) =>
                                  m.id === member.id ? { ...m, role: e.target.value } : m
                                );
                                setAboutPageDraft({ ...aboutPageDraft, teamMembers: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Short Bio</label>
                          <textarea
                            rows={2}
                            value={member.bio}
                            onChange={(e) => {
                              const updated = aboutPageDraft.teamMembers.map((m) =>
                                m.id === member.id ? { ...m, bio: e.target.value } : m
                              );
                              setAboutPageDraft({ ...aboutPageDraft, teamMembers: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
                          <input
                            type="text"
                            value={member.linkedin || ''}
                            onChange={(e) => {
                              const updated = aboutPageDraft.teamMembers.map((m) =>
                                m.id === member.id ? { ...m, linkedin: e.target.value } : m
                              );
                              setAboutPageDraft({ ...aboutPageDraft, teamMembers: updated });
                            }}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>

                        <ImageFieldEditor
                          label="Member Portrait Photo"
                          imageSrc={member.image}
                          onChange={(src) => {
                            const updated = aboutPageDraft.teamMembers.map((m) =>
                              m.id === member.id ? { ...m, image: src } : m
                            );
                            setAboutPageDraft({ ...aboutPageDraft, teamMembers: updated });
                          }}
                          helperText={
                            isCeo
                              ? 'Saving will synchronize CEO details with Home Mission and Site Settings.'
                              : 'Recommended ratio 4:5 (e.g. 800x1000px).'
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Pillars Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  4. Core Pillars ({aboutPageDraft.corePillars.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Manage the 4 key engineering values & warranties displayed at the bottom of the About page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newPillar: AboutCorePillar = {
                    id: `pillar-${Date.now()}`,
                    title: 'New Pillar',
                    description: 'Enterprise guarantee and technical rigor description.',
                    iconName: 'ShieldCheck',
                    visible: true,
                    order: aboutPageDraft.corePillars.length + 1,
                  };
                  setAboutPageDraft({
                    ...aboutPageDraft,
                    corePillars: [...aboutPageDraft.corePillars, newPillar],
                  });
                  setEditingPillarId(newPillar.id);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {aboutPageDraft.corePillars.map((pillar, idx) => {
                const isEditing = editingPillarId === pillar.id;
                return (
                  <div
                    key={pillar.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 text-[#004d6a] flex items-center justify-center shrink-0">
                          <DynamicIcon name={pillar.iconName} className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{pillar.title}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{pillar.description}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const next = [...aboutPageDraft.corePillars];
                            const [p] = next.splice(idx, 1);
                            next.splice(idx - 1, 0, p);
                            setAboutPageDraft({
                              ...aboutPageDraft,
                              corePillars: next.map((item, i) => ({ ...item, order: i + 1 })),
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === aboutPageDraft.corePillars.length - 1}
                          onClick={() => {
                            const next = [...aboutPageDraft.corePillars];
                            const [p] = next.splice(idx, 1);
                            next.splice(idx + 1, 0, p);
                            setAboutPageDraft({
                              ...aboutPageDraft,
                              corePillars: next.map((item, i) => ({ ...item, order: i + 1 })),
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = aboutPageDraft.corePillars.map((p) =>
                              p.id === pillar.id ? { ...p, visible: !p.visible } : p
                            );
                            setAboutPageDraft({ ...aboutPageDraft, corePillars: updated });
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            pillar.visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                          }`}
                          title={pillar.visible ? 'Visible' : 'Hidden'}
                        >
                          {pillar.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPillarId(isEditing ? null : pillar.id)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = aboutPageDraft.corePillars.filter((p) => p.id !== pillar.id);
                            setAboutPageDraft({ ...aboutPageDraft, corePillars: updated });
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Delete Pillar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Form */}
                    {isEditing && (
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => {
                                const updated = aboutPageDraft.corePillars.map((p) =>
                                  p.id === pillar.id ? { ...p, title: e.target.value } : p
                                );
                                setAboutPageDraft({ ...aboutPageDraft, corePillars: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Icon Name</label>
                            <select
                              value={pillar.iconName}
                              onChange={(e) => {
                                const updated = aboutPageDraft.corePillars.map((p) =>
                                  p.id === pillar.id ? { ...p, iconName: e.target.value } : p
                                );
                                setAboutPageDraft({ ...aboutPageDraft, corePillars: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                            >
                              <option value="Code2">Code2 (Clean Code)</option>
                              <option value="Zap">Zap (Speed)</option>
                              <option value="Sparkles">Sparkles (AI Systems)</option>
                              <option value="ShieldCheck">ShieldCheck (Warranty)</option>
                              <option value="Cpu">Cpu (Computing)</option>
                              <option value="Rocket">Rocket (Launch)</option>
                              <option value="Diamond">Diamond (Quality)</option>
                              <option value="Award">Award (Excellence)</option>
                              <option value="Globe">Globe (Global Scale)</option>
                              <option value="Users">Users (Team)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={pillar.description}
                            onChange={(e) => {
                              const updated = aboutPageDraft.corePillars.map((p) =>
                                p.id === pillar.id ? { ...p, description: e.target.value } : p
                              );
                              setAboutPageDraft({ ...aboutPageDraft, corePillars: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. SERVICES */}
      {activeSection === 'services' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Services Section Header
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Badge / Tag
                </label>
                <input
                  type="text"
                  value={servicesDraft.sectionEyebrow}
                  onChange={(e) => setServicesDraft({ ...servicesDraft, sectionEyebrow: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={servicesDraft.ctaText}
                  onChange={(e) => setServicesDraft({ ...servicesDraft, ctaText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Heading
              </label>
              <input
                type="text"
                value={servicesDraft.sectionTitle}
                onChange={(e) => setServicesDraft({ ...servicesDraft, sectionTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={servicesDraft.sectionDescription}
                onChange={(e) => setServicesDraft({ ...servicesDraft, sectionDescription: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Service Cards List */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Service Cards ({servicesDraft.cards.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Click 'Edit' to change features, icons, or text.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newCard: ServiceCardItem = {
                    id: `service-${Date.now()}`,
                    title: 'New Service',
                    iconName: 'Code2',
                    isTealHighlight: false,
                    description: 'Custom digital engineering capability tailored to client requirements.',
                    features: ['Responsive UI', 'Sub-second speed', 'TypeScript testing'],
                    techStack: ['React', 'Next.js'],
                    visible: true,
                    order: servicesDraft.cards.length + 1,
                  };
                  setServicesDraft({ ...servicesDraft, cards: [...servicesDraft.cards, newCard] });
                  setEditingServiceId(newCard.id);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {servicesDraft.cards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 rounded-xl border transition-all ${
                    editingServiceId === card.id
                      ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                        <DynamicIcon name={card.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{card.title}</span>
                          {card.isTealHighlight && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0d5363] text-white">
                              Teal Card
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate max-w-sm">
                          {card.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingServiceId(editingServiceId === card.id ? null : card.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        {editingServiceId === card.id ? 'Close' : 'Edit'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${card.title}"?`)) {
                            setServicesDraft({
                              ...servicesDraft,
                              cards: servicesDraft.cards.filter((c) => c.id !== card.id),
                            });
                            if (editingServiceId === card.id) setEditingServiceId(null);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Focused In-Place Form for Editing Card */}
                  {editingServiceId === card.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Service Title
                          </label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const updated = servicesDraft.cards.map((c) =>
                                c.id === card.id ? { ...c, title: e.target.value } : c
                              );
                              setServicesDraft({ ...servicesDraft, cards: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Icon
                          </label>
                          <IconPicker
                            value={card.iconName}
                            onChange={(iconName) => {
                              const updated = servicesDraft.cards.map((c) =>
                                c.id === card.id ? { ...c, iconName } : c
                              );
                              setServicesDraft({ ...servicesDraft, cards: updated });
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) => {
                            const updated = servicesDraft.cards.map((c) =>
                              c.id === card.id ? { ...c, description: e.target.value } : c
                            );
                            setServicesDraft({ ...servicesDraft, cards: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Features & Deliverables (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={card.features.join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n');
                            const updated = servicesDraft.cards.map((c) =>
                              c.id === card.id ? { ...c, features: lines } : c
                            );
                            setServicesDraft({ ...servicesDraft, cards: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={card.isTealHighlight}
                            onChange={(e) => {
                              const updated = servicesDraft.cards.map((c) =>
                                c.id === card.id ? { ...c, isTealHighlight: e.target.checked } : c
                              );
                              setServicesDraft({ ...servicesDraft, cards: updated });
                            }}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span>Highlight as Deep Teal Card</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. PROCESS TIMELINE */}
      {activeSection === 'process' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Execution Methodology Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              The four delivery sprint phases shown on your Services and About pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Tag / Eyebrow
              </label>
              <input
                type="text"
                value={processDraft.sectionEyebrow ?? 'Execution Methodology'}
                onChange={(e) => setProcessDraft({ ...processDraft, sectionEyebrow: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Main Heading
              </label>
              <input
                type="text"
                value={processDraft.sectionTitle ?? 'A disciplined four-phase pipeline from blueprint to scale.'}
                onChange={(e) => setProcessDraft({ ...processDraft, sectionTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Section Description
            </label>
            <textarea
              rows={2}
              value={processDraft.sectionDescription ?? 'We operate in tight fortnightly sprints with continuous staging access, rigorous automated testing, and clear delivery gates at every milestone.'}
              onChange={(e) => setProcessDraft({ ...processDraft, sectionDescription: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-4 pt-3 border-t border-slate-100">
            {processDraft.steps.map((step, idx) => (
              <div key={step.id || step.number} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-1 flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Phase Title
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...processDraft.steps];
                        updated[idx].title = e.target.value;
                        setProcessDraft({ ...processDraft, steps: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={step.duration}
                      onChange={(e) => {
                        const updated = [...processDraft.steps];
                        updated[idx].duration = e.target.value;
                        setProcessDraft({ ...processDraft, steps: updated });
                      }}
                      placeholder="e.g. Sprints 1–2 (Wk 1–2)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phase Description
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const updated = [...processDraft.steps];
                      updated[idx].description = e.target.value;
                      setProcessDraft({ ...processDraft, steps: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Deliverables (comma separated)
                  </label>
                  <input
                    type="text"
                    value={step.deliverables.join(', ')}
                    onChange={(e) => {
                      const updated = [...processDraft.steps];
                      updated[idx].deliverables = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setProcessDraft({ ...processDraft, steps: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Key Gate / Milestone Outcome
                  </label>
                  <input
                    type="text"
                    value={step.keyOutcome || ''}
                    onChange={(e) => {
                      const updated = [...processDraft.steps];
                      updated[idx].keyOutcome = e.target.value;
                      setProcessDraft({ ...processDraft, steps: updated });
                    }}
                    placeholder="e.g. Approved clickable prototype and architecture spec sign-off."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TESTIMONIALS */}
      {activeSection === 'testimonials' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Client Testimonials & Endorsements
              </h2>
              <p className="text-xs text-slate-500">
                Quotes, client avatars, and company titles displayed on Home and Portfolio pages.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newT: TestimonialItem = {
                  id: `testimonial-${Date.now()}`,
                  quote: 'NexorDive delivered exceptional digital craft on our project.',
                  author: 'Client Name',
                  role: 'CEO & Founder',
                  company: 'Client Company',
                  avatar: '/assets/khyber/avatar1.png',
                  rating: 5,
                  visible: true,
                  order: testimonialsDraft.testimonials.length + 1,
                };
                setTestimonialsDraft({
                  ...testimonialsDraft,
                  testimonials: [...testimonialsDraft.testimonials, newT],
                });
                setEditingTestimonialId(newT.id);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Main Title
              </label>
              <input
                type="text"
                value={testimonialsDraft.sectionTitle ?? "What Our Client's Say About Us"}
                onChange={(e) => setTestimonialsDraft({ ...testimonialsDraft, sectionTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={testimonialsDraft.sectionDescription ?? 'Our clients are highly satisfied with NexorDive digital solutions.'}
                onChange={(e) => setTestimonialsDraft({ ...testimonialsDraft, sectionDescription: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {testimonialsDraft.testimonials.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar || '/assets/khyber/avatar1.png'}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-white"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{t.author}</span>
                      <span className="text-[11px] text-slate-500">{t.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingTestimonialId(editingTestimonialId === t.id ? null : t.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      {editingTestimonialId === t.id ? 'Close' : 'Edit'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete review from "${t.author}"?`)) {
                          setTestimonialsDraft({
                            ...testimonialsDraft,
                            testimonials: testimonialsDraft.testimonials.filter((item) => item.id !== t.id),
                          });
                        }
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingTestimonialId === t.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={t.author}
                          onChange={(e) => {
                            const updated = testimonialsDraft.testimonials.map((item) =>
                              item.id === t.id ? { ...item, author: e.target.value } : item
                            );
                            setTestimonialsDraft({ ...testimonialsDraft, testimonials: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Role & Company
                        </label>
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => {
                            const updated = testimonialsDraft.testimonials.map((item) =>
                              item.id === t.id ? { ...item, role: e.target.value } : item
                            );
                            setTestimonialsDraft({ ...testimonialsDraft, testimonials: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Quote Text
                      </label>
                      <textarea
                        rows={3}
                        value={t.quote}
                        onChange={(e) => {
                          const updated = testimonialsDraft.testimonials.map((item) =>
                            item.id === t.id ? { ...item, quote: e.target.value } : item
                          );
                          setTestimonialsDraft({ ...testimonialsDraft, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                    </div>

                    <ImageFieldEditor
                      label="Client Avatar Photo"
                      imageSrc={t.avatar}
                      onChange={(src) => {
                        const updated = testimonialsDraft.testimonials.map((item) =>
                          item.id === t.id ? { ...item, avatar: src } : item
                        );
                        setTestimonialsDraft({ ...testimonialsDraft, testimonials: updated });
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. BLOG CARDS */}
      {activeSection === 'blog' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Blog Cards on Homepage
              </h2>
              <p className="text-xs text-slate-500">
                Feature articles, published dates, and external article links.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newB: BlogCardItem = {
                  id: `blog-${Date.now()}`,
                  title: 'New Digital Marketing Insight',
                  date: 'October 31, 2024',
                  image: '/assets/khyber/blog1.png',
                  imageAlt: 'Blog thumbnail',
                  excerpt: 'Proven strategies for high-converting landing pages.',
                  link: '#',
                  category: 'SEO',
                  visible: true,
                  order: blogDraft.blogs.length + 1,
                };
                setBlogDraft({ ...blogDraft, blogs: [...blogDraft.blogs, newB] });
                setEditingBlogId(newB.id);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Blog Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={blogDraft.sectionEyebrow ?? 'OUR BLOG'}
                onChange={(e) => setBlogDraft({ ...blogDraft, sectionEyebrow: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Main Title
              </label>
              <input
                type="text"
                value={blogDraft.sectionTitle ?? 'Latest From Blog'}
                onChange={(e) => setBlogDraft({ ...blogDraft, sectionTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {blogDraft.blogs.map((blog) => (
              <div key={blog.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={blog.image || '/assets/khyber/blog1.png'}
                      alt={blog.title}
                      className="w-14 h-10 rounded-lg object-cover border border-slate-200 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{blog.title}</span>
                      <span className="text-[11px] text-slate-500">{blog.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingBlogId(editingBlogId === blog.id ? null : blog.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      {editingBlogId === blog.id ? 'Close' : 'Edit'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete blog "${blog.title}"?`)) {
                          setBlogDraft({
                            ...blogDraft,
                            blogs: blogDraft.blogs.filter((b) => b.id !== blog.id),
                          });
                        }
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingBlogId === blog.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Article Title
                        </label>
                        <input
                          type="text"
                          value={blog.title}
                          onChange={(e) => {
                            const updated = blogDraft.blogs.map((b) =>
                              b.id === blog.id ? { ...b, title: e.target.value } : b
                            );
                            setBlogDraft({ ...blogDraft, blogs: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Publish Date
                        </label>
                        <input
                          type="text"
                          value={blog.date}
                          onChange={(e) => {
                            const updated = blogDraft.blogs.map((b) =>
                              b.id === blog.id ? { ...b, date: e.target.value } : b
                            );
                            setBlogDraft({ ...blogDraft, blogs: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Link URL (e.g. # or full https:// link)
                      </label>
                      <input
                        type="text"
                        value={blog.link}
                        onChange={(e) => {
                          const updated = blogDraft.blogs.map((b) =>
                            b.id === blog.id ? { ...b, link: e.target.value } : b
                          );
                          setBlogDraft({ ...blogDraft, blogs: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                    </div>

                    <ImageFieldEditor
                      label="Thumbnail Image"
                      imageSrc={blog.image}
                      onChange={(src) => {
                        const updated = blogDraft.blogs.map((b) =>
                          b.id === blog.id ? { ...b, image: src } : b
                        );
                        setBlogDraft({ ...blogDraft, blogs: updated });
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. PARTNERS MARQUEE PLATFORMS */}
      {activeSection === 'partners' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Platforms Marquee Track ({(partnersDraft.platforms || []).length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage the platform badges and destinations displayed in the infinite animated marquee banner.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const currentPlatforms = partnersDraft.platforms || [];
                const newPlatform: MarqueePlatformItem = {
                  id: `plat-${Date.now()}`,
                  name: 'LinkedIn',
                  platformKey: 'linkedin',
                  url: 'https://linkedin.com',
                  visible: true,
                  order: currentPlatforms.length + 1,
                };
                setPartnersDraft({
                  ...partnersDraft,
                  platforms: [...currentPlatforms, newPlatform],
                });
                setEditingPlatformId(newPlatform.id);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Platform</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {(partnersDraft.platforms || []).map((platform, idx) => {
              const isEditing = editingPlatformId === platform.id;
              return (
                <div
                  key={platform.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{platform.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-[#004d6a] text-[10px] font-bold uppercase">
                            {platform.platformKey}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono line-clamp-1">{platform.url || 'No link'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const next = [...(partnersDraft.platforms || [])];
                          const [p] = next.splice(idx, 1);
                          next.splice(idx - 1, 0, p);
                          setPartnersDraft({
                            ...partnersDraft,
                            platforms: next.map((item, i) => ({ ...item, order: i + 1 })),
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (partnersDraft.platforms || []).length - 1}
                        onClick={() => {
                          const next = [...(partnersDraft.platforms || [])];
                          const [p] = next.splice(idx, 1);
                          next.splice(idx + 1, 0, p);
                          setPartnersDraft({
                            ...partnersDraft,
                            platforms: next.map((item, i) => ({ ...item, order: i + 1 })),
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (partnersDraft.platforms || []).map((p) =>
                            p.id === platform.id ? { ...p, visible: !p.visible } : p
                          );
                          setPartnersDraft({ ...partnersDraft, platforms: updated });
                        }}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          platform.visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                        }`}
                        title={platform.visible ? 'Visible in marquee' : 'Hidden from marquee'}
                      >
                        {platform.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPlatformId(isEditing ? null : platform.id)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (partnersDraft.platforms || []).filter((p) => p.id !== platform.id);
                          setPartnersDraft({ ...partnersDraft, platforms: updated });
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Delete Platform"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-3 border-t border-slate-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Platform Brand / Icon
                          </label>
                          <select
                            value={platform.platformKey}
                            onChange={(e) => {
                              const key = e.target.value as MarqueePlatformKey;
                              const updated = (partnersDraft.platforms || []).map((p) =>
                                p.id === platform.id ? { ...p, platformKey: key } : p
                              );
                              setPartnersDraft({ ...partnersDraft, platforms: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          >
                            <option value="linkedin">LinkedIn</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="x">X Platform</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="github">GitHub</option>
                            <option value="discord">Discord</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Display Label
                          </label>
                          <input
                            type="text"
                            value={platform.name}
                            onChange={(e) => {
                              const updated = (partnersDraft.platforms || []).map((p) =>
                                p.id === platform.id ? { ...p, name: e.target.value } : p
                              );
                              setPartnersDraft({ ...partnersDraft, platforms: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Platform URL / Profile Destination
                        </label>
                        <input
                          type="text"
                          value={platform.url || ''}
                          onChange={(e) => {
                            const updated = (partnersDraft.platforms || []).map((p) =>
                              p.id === platform.id ? { ...p, url: e.target.value } : p
                            );
                            setPartnersDraft({ ...partnersDraft, platforms: updated });
                          }}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. CONTACT SECTION */}
      {activeSection === 'contact' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Contact Section Copy & Guarantees
            </h2>
            <p className="text-xs text-slate-500">
              Manage the introductory headline and trust guarantees shown alongside the contact form.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={contactDraft.sectionEyebrow}
                onChange={(e) => setContactDraft({ ...contactDraft, sectionEyebrow: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Modal Eyebrow (Quick Scoping)
              </label>
              <input
                type="text"
                value={contactDraft.modalEyebrow || ''}
                onChange={(e) => setContactDraft({ ...contactDraft, modalEyebrow: e.target.value })}
                placeholder="Quick Scoping & Inquiry"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Heading *
              </label>
              <input
                type="text"
                value={contactDraft.sectionTitle}
                onChange={(e) => setContactDraft({ ...contactDraft, sectionTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Channels Heading
              </label>
              <input
                type="text"
                value={contactDraft.directHeading || ''}
                onChange={(e) => setContactDraft({ ...contactDraft, directHeading: e.target.value })}
                placeholder="Direct Communication"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Intro Paragraph
            </label>
            <textarea
              rows={2}
              value={contactDraft.sectionDescription}
              onChange={(e) => setContactDraft({ ...contactDraft, sectionDescription: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Direct Channels Description
            </label>
            <textarea
              rows={2}
              value={contactDraft.directDescription || ''}
              onChange={(e) => setContactDraft({ ...contactDraft, directDescription: e.target.value })}
              placeholder="Prefer an immediate conversation? Reach out directly via WhatsApp for quick scoping, or email us your comprehensive RFP."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Response Guarantee
              </label>
              <input
                type="text"
                value={contactDraft.responseGuarantee}
                onChange={(e) => setContactDraft({ ...contactDraft, responseGuarantee: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NDA Security Guarantee
              </label>
              <input
                type="text"
                value={contactDraft.ndaGuarantee}
                onChange={(e) => setContactDraft({ ...contactDraft, ndaGuarantee: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Submission Success Message
            </label>
            <textarea
              rows={2}
              value={contactDraft.successMessage}
              onChange={(e) => setContactDraft({ ...contactDraft, successMessage: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>
        </div>
      )}

      {/* 10. SUB-PAGE BANNERS */}
      {activeSection === 'page-headers' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Sub-Page Header Banners
            </h2>
            <p className="text-xs text-slate-500">
              Customize the top banner title, badge, and description for each dedicated page on your website.
            </p>
          </div>

          {(
            [
              { key: 'services', label: 'Services Page Header' },
              { key: 'portfolio', label: 'Portfolio Page Header' },
              { key: 'pricing', label: 'Pricing Page Header' },
              { key: 'streamerAssets', label: 'Streamer Assets Page Header' },
              { key: 'contact', label: 'Contact Page Header' },
            ] as const
          ).map((page) => {
            const h = headersDraft[page.key];
            return (
              <div key={page.key} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">{page.label}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={h.badge}
                      onChange={(e) => {
                        setHeadersDraft({
                          ...headersDraft,
                          [page.key]: { ...h, badge: e.target.value },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={h.title}
                      onChange={(e) => {
                        setHeadersDraft({
                          ...headersDraft,
                          [page.key]: { ...h, title: e.target.value },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={h.description}
                    onChange={(e) => {
                      setHeadersDraft({
                        ...headersDraft,
                        [page.key]: { ...h, description: e.target.value },
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Action Bar - ALWAYS visible when dirty while scrolling! */}
      <EditorActionBar
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        feedback={feedback}
        sectionName={sectionLabels[activeSection]}
      />

      {/* Accidental Loss Prevention Modal when switching sub-sections */}
      <UnsavedChangesModal
        isOpen={isUnsavedModalOpen}
        sectionName={sectionLabels[activeSection]}
        isSaving={isSaving}
        onSaveAndContinue={handleModalSaveAndContinue}
        onDiscardAndContinue={handleModalDiscardAndContinue}
        onKeepEditing={handleModalKeepEditing}
      />
    </div>
  );
};
