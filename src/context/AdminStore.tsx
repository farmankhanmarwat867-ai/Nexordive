'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CASE_STUDIES } from '../data/agencyData';
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
  leaderName: string;
  leaderRole: string;
  leaderImage: string;
}

interface AdminContextType {
  leads: Lead[];
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  
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

const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: '+92 314 600 9810',
  contactEmail: 'farmanullahk111@gmail.com',
  metaTitle: 'NexorDive — Deep Digital Solutions for Modern Businesses',
  metaDescription:
    'NexorDive is an elite digital product agency engineering high-performance web applications, scalable software architectures, and streamer assets.',
  ogImageUrl: 'https://nexordive.com/og-image.png',
  agencyName: 'NexorDive',
  leaderName: 'Akleem Orakzai',
  leaderRole: 'CEO',
  leaderImage: '/assets/akleem_orakzai_avatar.png',
};

const DEFAULT_PRICING: PricingPlanControl[] = [
  {
    id: 'starter-website',
    name: 'Starter Website',
    price: '$99 – $299',
    billing: 'One-time investment',
    badge: 'Launch Fast',
    popular: false,
    features: [
      'Responsive 1–3 Page Next.js Website',
      'Sub-second Core Web Vitals guarantee',
      'Mobile-first UX with contact form',
      'Domain setup, SSL & Cloudflare DNS',
      'Basic On-Page SEO meta tags',
    ],
    turnaround: '3–5 Business Days',
  },
  {
    id: 'pro-digital-kit',
    name: 'Pro Digital Kit',
    price: '$300 – $699',
    billing: 'One-time investment',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Full Multi-Page Web Platform (Up to 8 Pages)',
      'Bespoke Figma UI/UX Design System',
      'Inbound Lead Capture & CRM Email Automation',
      'Technical SEO & Google Analytics 4',
      'High-converting landing page setup',
    ],
    turnaround: '7–12 Business Days',
  },
  {
    id: 'streamer-starter-pack',
    name: 'Streamer Starter Pack',
    price: '$49 – $129',
    billing: 'One-time investment',
    badge: 'Creators & Esports',
    popular: false,
    features: [
      'Animated Stream Overlay Suite (Starting, BRB, End)',
      'Modular Webcam Border & Audio Level HUD',
      'Custom 60fps Stinger Transition with Sound FX',
      'Twitch & Kick Chatbox CSS for OBS Studio',
      'Sub Loyalty Badges (3 Tiers) & 5 Emotes',
    ],
    turnaround: '3–6 Business Days',
  },
  {
    id: 'custom-software-mvp',
    name: 'Custom Software MVP',
    price: 'Custom Pricing',
    billing: 'Milestone-based sprints',
    badge: 'Enterprise & AI',
    popular: false,
    features: [
      'Custom Web & Mobile App (Next.js, React Native)',
      'Autonomous AI Agent & LLM Integration',
      'Scalable Postgres Database Architecture',
      'Stripe Billing & Role-Based Access Control',
      '100% IP Assignment & Bi-Weekly Sprints',
    ],
    turnaround: '4–10 Calendar Weeks',
  },
];

const DEFAULT_SERVICES: ServiceControl[] = [
  { id: 'web-development', title: 'Web Development', category: 'Architecture & Engineering', enabled: true },
  { id: 'software-development', title: 'Software Development', category: 'Cloud & Infrastructure', enabled: true },
  { id: 'mobile-app-development', title: 'Mobile App Development', category: 'iOS & Android Native', enabled: true },
  { id: 'digital-marketing', title: 'Digital Marketing', category: 'Growth & Acquisition', enabled: true },
  { id: 'branding', title: 'Branding', category: 'Identity & Spatial Design', enabled: true },
  { id: 'ai-automation', title: 'AI Automation', category: 'Intelligent Systems', enabled: true },
];

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexor_admin_leads');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return DEFAULT_LEADS;
  });

  const [projects, setProjects] = useState<CaseStudy[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexor_admin_projects');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return CASE_STUDIES;
  });

  const [pricingPlans, setPricingPlans] = useState<PricingPlanControl[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexor_admin_pricing');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return DEFAULT_PRICING;
  });

  const [services, setServices] = useState<ServiceControl[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexor_admin_services');
      if (saved) {
        try { return JSON.parse(saved); } catch (_) {}
      }
    }
    return DEFAULT_SERVICES;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexor_admin_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_SETTINGS, ...parsed };
        } catch (_) {}
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexor_admin_leads', JSON.stringify(leads));
    }
  }, [leads]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexor_admin_projects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexor_admin_pricing', JSON.stringify(pricingPlans));
    }
  }, [pricingPlans]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexor_admin_services', JSON.stringify(services));
    }
  }, [services]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexor_admin_settings', JSON.stringify(settings));
    }
  }, [settings]);

  // Lead handlers
  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
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

  // Project handlers
  const addProject = (projectData: Omit<CaseStudy, 'id'>) => {
    const newProj: CaseStudy = {
      ...projectData,
      id: `project-${Date.now()}`,
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updatedData: Partial<CaseStudy>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Pricing handlers
  const updatePricingPlan = (id: string, data: Partial<PricingPlanControl>) => {
    setPricingPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, ...data } : plan))
    );
  };

  // Service toggling
  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AdminContext.Provider
      value={{
        leads,
        updateLeadStatus,
        deleteLead,
        addLead,
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
