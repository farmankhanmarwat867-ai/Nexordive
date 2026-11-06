/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Globe,
  Smartphone,
  Layers,
  TrendingUp,
  Rocket,
  Gamepad2,
  Wrench,
  Home,
  Info,
  Coins,
  Briefcase,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminStore';
import { DynamicIcon } from './common/DynamicIcon';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onOpenContact?: () => void;
  onOpenAdmin?: () => void;
  onStartProject?: () => void;
}

// Icon mapping matching the capsule pill design from reference video
const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  about: Info,
  services: Layers,
  'streamer-assets': Gamepad2,
  pricing: Coins,
  portfolio: Briefcase,
  contact: Mail,
};

export interface NavServiceItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  destination: string;
  contactSummary?: string;
}

// 8 core capabilities mapped symmetrically across 2 columns (4 rows) matching user's visual design
const NAV_SERVICES: NavServiceItem[] = [
  // Row 1
  {
    id: 'web-development',
    label: 'Web Development',
    icon: Globe,
    destination: 'web-development',
  },
  {
    id: 'mobile-app-development',
    label: 'App Development',
    icon: Smartphone,
    destination: 'mobile-app-development',
  },
  // Row 2
  {
    id: 'saas-development',
    label: 'Software Development',
    icon: Layers,
    destination: 'saas-development',
  },
  {
    id: 'ai-automation',
    label: 'AI Development',
    icon: Sparkles,
    destination: 'ai-automation',
  },
  // Row 3
  {
    id: 'digital-marketing',
    label: 'Digital Marketing',
    icon: TrendingUp,
    destination: 'digital-marketing',
  },
  {
    id: 'mvp-development',
    label: 'MVP Development',
    icon: Rocket,
    destination: 'saas-development',
  },
  // Row 4
  {
    id: 'streamer-assets',
    label: 'Game Development',
    icon: Gamepad2,
    destination: 'streamer-assets',
  },
  {
    id: 'app-maintenance',
    label: 'App Maintenance & Support',
    icon: Wrench,
    destination: 'contact',
    contactSummary: 'Inquiry: App Maintenance & Support Services',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenContact,
  onOpenAdmin,
  onStartProject,
}) => {
  const { content } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Top-level navigation links (SaaS & Shopify housed under SERVICES dropdown)
  const defaultNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'streamer-assets', label: 'Streamer Assets' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'portfolio', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  // Dynamic CMS nav links if configured by admin, filtering out standalone SaaS/Shopify top-level items
  const rawLinks = content?.global?.navLinks;
  const navLinks = (() => {
    if (!Array.isArray(rawLinks) || rawLinks.length === 0) {
      return defaultNavLinks;
    }
    const filtered = [...rawLinks].filter((link) => {
      const dest = link.destination || link.id;
      return (
        link.visible !== false &&
        dest !== 'saas' &&
        dest !== 'shopify' &&
        dest !== 'saas-development' &&
        dest !== 'shopify-development'
      );
    });

    // Ensure 'about' link is present even if localhost localStorage has a stale legacy snapshot
    const hasAbout = filtered.some((l) => (l.destination || l.id) === 'about');
    if (!hasAbout) {
      filtered.push({ id: 'about', label: 'About', destination: 'about', visible: true, order: 2 });
    }

    // Explicitly guarantee user-requested order: HOME (1) -> ABOUT (2) -> SERVICES (3)
    const getSortOrder = (link: { id: string; destination?: string; order?: number }) => {
      const dest = link.destination || link.id;
      if (dest === 'home') return 1;
      if (dest === 'about') return 2;
      if (dest === 'services') return 3;
      const explicitOrder = link.order ?? 10;
      return explicitOrder < 4 ? explicitOrder + 3 : explicitOrder;
    };

    return filtered
      .sort((a, b) => getSortOrder(a) - getSortOrder(b))
      .map((link) => ({
        id: link.destination || link.id,
        label: link.label,
      }));
  })();
  // WhatsApp settings & direct link
  const whatsappNumber = content?.global?.whatsappNumber || '+92 314 600 9810';
  const whatsappMessage = content?.global?.whatsappMessage || 'Hello NexorDive, I would like to discuss a project.';
  const cleanDigits = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(whatsappMessage)}`;

  const isServicesActive =
    currentPage === 'services' ||
    currentPage === 'web-development' ||
    currentPage === 'graphic-design' ||
    currentPage === 'digital-marketing' ||
    currentPage === 'ai-automation' ||
    currentPage === 'mobile-app-development' ||
    currentPage === 'saas' ||
    currentPage === 'saas-development' ||
    currentPage === 'shopify' ||
    currentPage === 'shopify-development' ||
    currentPage === 'streamer-assets';

  const handleLinkClick = (pageId: string) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    if (pageId === 'admin' && onOpenAdmin) {
      onOpenAdmin();
      return;
    }
    if (onNavigate) {
      onNavigate(pageId);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleServiceItemClick = (item: NavServiceItem) => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    if (item.contactSummary) {
      if (onStartProject) {
        onStartProject();
      } else if (onOpenContact) {
        onOpenContact();
      } else {
        handleLinkClick('contact');
      }
      return;
    }
    handleLinkClick(item.destination);
  };

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 180);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md py-2.5 sm:py-3 shadow-xs border-b border-slate-200/80 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. Left Logo - Official Nexordive 3D Visual Identity */}
          <div className="flex-1 flex items-center justify-start">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('home');
              }}
              className="flex items-center select-none group cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-0.5"
              aria-label="Nexordive Home"
            >
              <img
                src="/assets/nexordive_logo_navbar.png"
                alt="Nexordive Logo"
                width={148}
                height={42}
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>
          </div>

          {/* 2. Center Nav Links - Capsule Pill Design Matching Reference Video */}
          <div className="flex-none">
            <nav
              className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 p-1.5 rounded-full bg-slate-50/90 border border-slate-200/80 shadow-xs shrink-0"
              onMouseLeave={() => setHoveredLink(null)}
              aria-label="Main Navigation"
            >
            {navLinks.map((link) => {
              const Icon = NAV_ICONS[link.id] || Sparkles;
              const isHovered = hoveredLink === link.id;
              const isLinkActive =
                link.id === 'services'
                  ? isServicesActive
                  : currentPage === link.id || (link.id === 'portfolio' && currentPage === 'portfolio');
              const isPillActive = isHovered || (!hoveredLink && isLinkActive);

              if (link.id === 'services') {
                return (
                  <div
                    key="services-dropdown"
                    className="relative"
                    onMouseEnter={() => {
                      setHoveredLink('services');
                      handleMouseEnterServices();
                    }}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    <a
                      href="#services"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick('services');
                      }}
                      className={`relative font-sans text-[13px] xl:text-[14px] font-medium whitespace-nowrap py-2 xl:py-2.5 px-3.5 xl:px-4.5 rounded-full cursor-pointer flex items-center gap-2 z-10 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        isPillActive
                          ? 'text-[#004d6a] font-semibold'
                          : 'text-slate-700 hover:text-slate-950'
                      }`}
                      aria-expanded={servicesDropdownOpen}
                      aria-haspopup="true"
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors duration-150 ${
                          isPillActive ? 'text-[#004d6a]' : 'text-slate-500'
                        }`}
                      />
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180' : ''
                        } ${isPillActive ? 'text-[#004d6a]' : 'text-slate-500'}`}
                      />
                      {isPillActive && (
                        <motion.div
                          layoutId="navPillHighlight"
                          className="absolute inset-0 bg-[#e3edf7] rounded-full -z-10 shadow-xs"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                    </a>

                    {/* Services Dropdown - Exact 2-Column Floating Card Matching User Design */}
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-[540px] sm:w-[580px]"
                        >
                          <div className="bg-white rounded-[26px] p-6 pb-4 sm:p-7 sm:pb-5 shadow-2xl shadow-indigo-950/15 border border-slate-100 ring-1 ring-black/5 text-left">
                            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-3.5">
                              {NAV_SERVICES.map((item) => {
                                const ServiceIcon = item.icon;
                                const isItemActive =
                                  currentPage === item.destination ||
                                  (item.destination === 'saas-development' &&
                                    (currentPage === 'saas' || currentPage === 'saas-development'));

                                return (
                                  <a
                                    key={item.id}
                                    href={`#${item.destination}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleServiceItemClick(item);
                                    }}
                                    className={`flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer ${
                                      isItemActive ? 'bg-slate-50' : ''
                                    }`}
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-[#f5f7ff] text-[#535bfe] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#eef2ff] transition-all">
                                      <ServiceIcon className="w-5 h-5 text-[#535bfe]" />
                                    </div>
                                    <span className="text-[14px] font-semibold text-[#111827] group-hover:text-[#535bfe] transition-colors leading-snug whitespace-nowrap">
                                      {item.label}
                                    </span>
                                  </a>
                                );
                              })}
                            </div>

                            {/* Bottom Divider & View All Services Link */}
                            <div className="border-t border-[#e3e5ff] mt-5 pt-3.5 flex items-center justify-center">
                              <button
                                onClick={() => {
                                  setServicesDropdownOpen(false);
                                  handleLinkClick('services');
                                }}
                                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#535bfe] hover:text-[#4338ca] transition-colors cursor-pointer group"
                              >
                                <span>View all 16 services</span>
                                <ArrowRight className="w-4 h-4 text-[#535bfe] transition-transform duration-200 group-hover:translate-x-1" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onMouseEnter={() => setHoveredLink(link.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                  className={`relative font-sans text-[13px] xl:text-[14px] font-medium whitespace-nowrap py-2 xl:py-2.5 px-3.5 xl:px-4.5 rounded-full cursor-pointer flex items-center gap-2 z-10 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isPillActive
                      ? 'text-[#004d6a] font-semibold'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                  aria-current={isLinkActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors duration-150 ${
                      isPillActive ? 'text-[#004d6a]' : 'text-slate-500'
                    }`}
                  />
                  <span>{link.label}</span>
                  {isPillActive && (
                    <motion.div
                      layoutId="navPillHighlight"
                      className="absolute inset-0 bg-[#e3edf7] rounded-full -z-10 shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
          </div>

          {/* 3. Right Space (Empty on Desktop for Clean Minimal Balance, Hamburger on Mobile) */}
          <div className="flex-1 flex items-center justify-end shrink-0">
            {/* Mobile Menu Hamburger Toggle */}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-6 py-6 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = NAV_ICONS[link.id] || Sparkles;
                if (link.id === 'services') {
                  return (
                    <div key="services-mobile" className="border-b border-slate-100 pb-2">
                      <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <button
                          onClick={() => {
                            handleLinkClick('services');
                          }}
                          className={`font-sans text-sm tracking-wide transition-all flex items-center gap-2.5 cursor-pointer ${
                            isServicesActive ? 'text-[#004d6a] font-semibold' : 'text-slate-700 hover:text-slate-950 font-medium'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isServicesActive ? 'text-[#004d6a]' : 'text-slate-500'}`} />
                          <span>{link.label}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          aria-label="Toggle services submenu"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileServicesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-3 pr-1 pb-3 space-y-1 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {NAV_SERVICES.map((item) => {
                                const ServiceIcon = item.icon;
                                const isSubActive = currentPage === item.destination;
                                return (
                                  <a
                                    key={item.id}
                                    href={`#${item.destination}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleServiceItemClick(item);
                                    }}
                                    className={`flex items-center gap-3 py-2 px-2.5 rounded-xl text-xs font-sans transition-all ${
                                      isSubActive
                                        ? 'bg-[#e3edf7] text-[#004d6a] font-semibold'
                                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-[#f5f7ff] text-[#535bfe] flex items-center justify-center shrink-0">
                                      <ServiceIcon className="w-4 h-4 text-[#535bfe]" />
                                    </div>
                                    <span className="truncate">{item.label}</span>
                                  </a>
                                );
                              })}
                            </div>
                            <button
                              onClick={() => {
                                setMobileMenuOpen(false);
                                handleLinkClick('services');
                              }}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-2 rounded-xl text-xs font-semibold text-[#535bfe] hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200"
                            >
                              <span>View all 16 services</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const isActive = currentPage === link.id || (link.id === 'portfolio' && currentPage === 'portfolio');
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.id);
                    }}
                    className={`font-sans text-sm tracking-wide whitespace-nowrap py-2.5 px-3 rounded-xl transition-all flex items-center justify-between ${
                      isActive ? 'bg-[#e3edf7] text-[#004d6a] font-semibold' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#004d6a]' : 'text-slate-500'}`} />
                      <span>{link.label}</span>
                    </div>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#004d6a]" />}
                  </a>
                );
              })}

              {/* Mobile CTA */}
              <div className="pt-4 flex flex-col gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-semibold text-xs tracking-wider shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 3.41c-.19 0-.41.07-.63.32-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.12 3.65.58.25 1.02.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.65.81-.8 1-.15.19-.3.21-.55.09-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>

                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
                  >
                    <span>Admin Access</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
