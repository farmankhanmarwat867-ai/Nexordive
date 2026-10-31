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
} from '../../../types/content';

export type PageSectionId =
  | 'home-layout'
  | 'hero'
  | 'about'
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
  const [partnersDraft, setPartnersDraft] = useState<PartnersContent>(() => structuredClone(content.partners));
  const [contactDraft, setContactDraft] = useState<ContactContent>(() => structuredClone(content.contact));
  const [headersDraft, setHeadersDraft] = useState<PageHeadersContent>(() => structuredClone(content.pageHeaders));

  // Modal / focused edit item states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

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
    about: 'About & Mission',
    services: 'Services Grid',
    process: 'Process Methodology',
    testimonials: 'Client Testimonials',
    blog: 'Blog Cards',
    partners: 'Partners Banner',
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
    { id: 'services', label: 'Services', icon: Code2 },
    { id: 'process', label: 'Process Steps', icon: Clock },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'blog', label: 'Blog Cards', icon: BookOpen },
    { id: 'partners', label: 'Partners Banner', icon: Award },
    { id: 'cta-banner', label: 'Bottom CTA Banner', icon: Zap },
    { id: 'contact', label: 'Contact Text', icon: Mail },
    { id: 'page-headers', label: 'Page Banners', icon: FileText },
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
                value={missionDraft.readMoreAction || 'services'}
                onChange={(action) => setMissionDraft({ ...missionDraft, readMoreAction: action })}
              />
            </div>

            <div className="pt-2">
              <ImageFieldEditor
                label="About Graphic Illustration"
                imageSrc={missionDraft.missionImage}
                imageAlt={missionDraft.missionImageAlt}
                onChange={(src, alt) => setMissionDraft({ ...missionDraft, missionImage: src, missionImageAlt: alt || '' })}
                helperText="Visual image on the right side of the about section."
              />
            </div>
          </div>

          {/* CEO / Leadership Badge */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Founder & Executive Badge
            </h2>
            <p className="text-xs text-slate-500">
              Floating badge displayed over the bottom-right corner of the about graphic.
            </p>

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
              helperText="Small profile photo displayed inside the floating badge."
            />

            {/* Live Interactive Badge Preview */}
            <div className="pt-3 border-t border-slate-100">
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Live Badge Preview
              </span>
              <div className="inline-flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#004d6a] text-white shadow-xl border border-cyan-400/30">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 border-2 border-white shrink-0 shadow-md">
                  <img
                    src={missionDraft.ceoAvatar || '/assets/akleem_orakzai_avatar.png'}
                    alt={missionDraft.ceoBadgeName || 'Executive'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-serif font-bold text-white tracking-wide uppercase">
                    {missionDraft.ceoBadgeName || 'Akleem Orakzai'}
                  </div>
                  <div className="text-xs text-cyan-200 font-serif font-medium mt-0.5">
                    {missionDraft.ceoBadgeTitle || 'CEO'}
                  </div>
                </div>
              </div>
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

      {/* 8. PARTNERS BANNER */}
      {activeSection === 'partners' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Client Partners Banner
            </h2>
            <p className="text-xs text-slate-500">
              The partner corporate logos marquee banner displayed on the homepage and portfolio page.
            </p>
          </div>

          <ImageFieldEditor
            label="Partner Logos Graphic Banner"
            imageSrc={partnersDraft.bannerImage}
            imageAlt={partnersDraft.bannerAlt}
            onChange={(src, alt) => setPartnersDraft({ ...partnersDraft, bannerImage: src, bannerAlt: alt || '' })}
            helperText="The horizontal composite image containing client brand logos (SRSP, Said Enterprise, Four Brothers, PMC, MedCare)."
          />
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
                Main Heading *
              </label>
              <input
                type="text"
                value={contactDraft.sectionTitle}
                onChange={(e) => setContactDraft({ ...contactDraft, sectionTitle: e.target.value })}
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
