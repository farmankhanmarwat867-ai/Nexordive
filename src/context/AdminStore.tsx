'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types/content';
import { getStoredContent, saveStoredContent, resetContentToDefaults } from '../services/contentRepository';
import { CaseStudy } from '../types/agency';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  service: string;
  budget: string;
  date: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  notes?: string;
}

export interface ServiceControl {
  id: string;
  title: string;
  category: string;
  enabled: boolean;
}

export interface PricingPlanControl {
  id: string;
  name: string;
  price: string;
  billing: string;
  badge: string;
  popular: boolean;
  features: string[];
  turnaround: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  contactEmail: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  agencyName: string;
}

export interface AdminContextType {
  // Published Site Content
  content: SiteContent;
  updateContent: (newContent: SiteContent) => { success: boolean; error?: string };
  updateContentSection: <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => { success: boolean; error?: string };
  resetAllContent: () => void;

  // Leads & CRM
  leads: Lead[];
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  clearAllLeads?: () => void;

  // Backward-compatible accessors
  projects: CaseStudy[];
  addProject: (project: Omit<CaseStudy, 'id'>) => void;
  updateProject: (id: string, project: Partial<CaseStudy>) => void;
  deleteProject: (id: string) => void;

  pricingPlans: PricingPlanControl[];
  updatePricingPlan: (id: string, data: Partial<PricingPlanControl>) => void;

  services: ServiceControl[];
  toggleService: (id: string) => void;

  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'NXD-891024',
    name: 'Sarah Jenkins',
    whatsapp: '+1 415 890 2311',
    email: 'sarah.j@auraprime.io',
    service: 'Web Development',
    budget: '$300 – $699 (Pro Digital Kit)',
    date: '2026-10-27',
    status: 'New',
    notes: 'Interested in Next.js 15+ marketing site and custom Figma tokens.',
  },
  {
    id: 'NXD-748291',
    name: 'Hamza Malik',
    whatsapp: '+92 300 123 4567',
    email: 'hamza@hyperpulse.gg',
    service: 'Streamer Assets',
    budget: '$49 – $129 (Streamer Pack)',
    date: '2026-10-26',
    status: 'In Progress',
    notes: 'Needs 60fps WebM stinger transition and Kick custom chatbox CSS.',
  },
  {
    id: 'NXD-623819',
    name: 'David Chen',
    whatsapp: '+65 9123 4567',
    email: 'david@synthetix.ai',
    service: 'AI Automation',
    budget: '$5,000+ (Custom Enterprise)',
    date: '2026-10-25',
    status: 'Contacted',
    notes: 'Autonomous multi-agent customer routing pipeline for enterprise SaaS.',
  },
  {
    id: 'NXD-512093',
    name: 'Marcus Vance',
    whatsapp: '+44 7700 900123',
    email: 'm.vance@vancetech.co.uk',
    service: 'Software Development',
    budget: '$1,000 – $5,000 (Standard MVP)',
    date: '2026-10-24',
    status: 'Closed',
    notes: 'Completed sprint kickoff for Postgres backend and real-time WebSockets.',
  },
];

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master site content published state
  const [content, setContent] = useState<SiteContent>(() => getStoredContent());

  // Leads CRM state (persisted in localStorage)
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexor_admin_leads');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_) {}
      }
    }
    return DEFAULT_LEADS;
  });

  // Keep localStorage leads synced
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nexor_admin_leads', JSON.stringify(leads));
      } catch (_) {}
    }
  }, [leads]);

  // Sync client-side document metadata whenever SEO settings change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (content.seo?.metaTitle) {
        document.title = content.seo.metaTitle;
      }
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && content.seo?.metaDescription) {
        metaDesc.setAttribute('content', content.seo.metaDescription);
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && content.seo?.ogTitle) {
        ogTitle.setAttribute('content', content.seo.ogTitle);
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && content.seo?.metaDescription) {
        ogDesc.setAttribute('content', content.seo.metaDescription);
      }
    }
  }, [content.seo]);

  // Update entire content
  const updateContent = (newContent: SiteContent): { success: boolean; error?: string } => {
    const result = saveStoredContent(newContent);
    if (result.success) {
      setContent(newContent);
    }
    return result;
  };

  // Update a single section of site content
  const updateContentSection = <K extends keyof SiteContent>(
    section: K,
    sectionData: SiteContent[K]
  ): { success: boolean; error?: string } => {
    const updated: SiteContent = {
      ...content,
      [section]: sectionData,
      lastUpdated: new Date().toISOString(),
    };
    const result = saveStoredContent(updated);
    if (result.success) {
      setContent(updated);
    }
    return result;
  };

  // Reset content to defaults
  const resetAllContent = () => {
    const defaults = resetContentToDefaults();
    setContent(defaults);
  };

  // Leads handlers
  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const clearAllLeads = () => {
    setLeads([]);
  };

  const addLead = (lead: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...lead,
      id: `NXD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  // Backward-compatible portfolio helpers mapped to content.portfolio
  const projects = (content.portfolio?.projects || []) as CaseStudy[];

  const addProject = (projectData: Omit<CaseStudy, 'id'>) => {
    const newProj = {
      ...projectData,
      id: `project-${Date.now()}`,
      featured: true,
      visible: true,
      order: (content.portfolio?.projects?.length || 0) + 1,
    };
    updateContentSection('portfolio', {
      ...content.portfolio,
      projects: [newProj, ...(content.portfolio?.projects || [])],
    });
  };

  const updateProject = (id: string, updatedData: Partial<CaseStudy>) => {
    const updatedProjects = (content.portfolio?.projects || []).map((p) =>
      p.id === id ? { ...p, ...updatedData } : p
    );
    updateContentSection('portfolio', {
      ...content.portfolio,
      projects: updatedProjects,
    });
  };

  const deleteProject = (id: string) => {
    const updatedProjects = (content.portfolio?.projects || []).filter((p) => p.id !== id);
    updateContentSection('portfolio', {
      ...content.portfolio,
      projects: updatedProjects,
    });
  };

  // Backward-compatible pricing helpers mapped to content.pricing
  const pricingPlans: PricingPlanControl[] = (content.pricing?.plans || []).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    billing: p.billing,
    badge: p.badge,
    popular: p.popular,
    features: p.features,
    turnaround: p.turnaround,
  }));

  const updatePricingPlan = (id: string, data: Partial<PricingPlanControl>) => {
    const updatedPlans = (content.pricing?.plans || []).map((p) =>
      p.id === id ? { ...p, ...data } : p
    );
    updateContentSection('pricing', {
      ...content.pricing,
      plans: updatedPlans,
    });
  };

  // Backward-compatible services helpers mapped to content.services
  const services: ServiceControl[] = (content.services?.cards || []).map((c) => ({
    id: c.id,
    title: c.title,
    category: c.techStack.join(', '),
    enabled: c.visible,
  }));

  const toggleService = (id: string) => {
    const updatedCards = (content.services?.cards || []).map((c) =>
      c.id === id ? { ...c, visible: !c.visible } : c
    );
    updateContentSection('services', {
      ...content.services,
      cards: updatedCards,
    });
  };

  // Backward-compatible settings mapped to content.global and content.seo
  const settings: SiteSettings = {
    whatsappNumber: content.global?.whatsappNumber || '+92 314 600 9810',
    contactEmail: content.global?.contactEmail || 'hello@nexordive.com',
    metaTitle: content.seo?.metaTitle || 'NexorDive Digital Agency',
    metaDescription: content.seo?.metaDescription || 'NexorDive Digital Agency',
    ogImageUrl: content.seo?.ogImageUrl || '',
    agencyName: content.global?.agencyName || 'NexorDive',
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updatedGlobal = {
      ...content.global,
      ...(newSettings.agencyName ? { agencyName: newSettings.agencyName } : {}),
      ...(newSettings.whatsappNumber ? { whatsappNumber: newSettings.whatsappNumber } : {}),
      ...(newSettings.contactEmail ? { contactEmail: newSettings.contactEmail } : {}),
    };
    const updatedSeo = {
      ...content.seo,
      ...(newSettings.metaTitle ? { metaTitle: newSettings.metaTitle, ogTitle: newSettings.metaTitle } : {}),
      ...(newSettings.metaDescription ? { metaDescription: newSettings.metaDescription } : {}),
      ...(newSettings.ogImageUrl ? { ogImageUrl: newSettings.ogImageUrl } : {}),
    };
    const updatedContent: SiteContent = {
      ...content,
      global: updatedGlobal,
      seo: updatedSeo,
      lastUpdated: new Date().toISOString(),
    };
    saveStoredContent(updatedContent);
    setContent(updatedContent);
  };

  return (
    <AdminContext.Provider
      value={{
        content,
        updateContent,
        updateContentSection,
        resetAllContent,
        leads,
        updateLeadStatus,
        deleteLead,
        addLead,
        clearAllLeads,
        projects,
        addProject,
        updateProject,
        deleteProject,
        pricingPlans,
        updatePricingPlan,
        services,
        toggleService,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Convenient alias
export const useContent = () => {
  const { content, updateContent, updateContentSection, resetAllContent } = useAdmin();
  return { content, updateContent, updateContentSection, resetAllContent };
};
