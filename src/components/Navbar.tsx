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

  // Social links & logo settings
  const facebookItem = content?.global?.socialLinks?.find((s) => s.platform === 'facebook');
  const linkedinItem = content?.global?.socialLinks?.find((s) => s.platform === 'linkedin');
  const facebookUrl = facebookItem !== undefined ? (facebookItem.url || '') : 'https://facebook.com';
  const linkedinUrl = linkedinItem !== undefined ? (linkedinItem.url || '') : 'https://linkedin.com';
  const showFacebook = facebookItem ? (facebookItem.visible !== false && facebookUrl.trim() !== '') : true;
  const showLinkedin = linkedinItem ? (linkedinItem.visible !== false && linkedinUrl.trim() !== '') : true;

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

  const handleCtaClick = () => {
    if (onStartProject) {
      onStartProject();
    } else if (onOpenContact) {
      onOpenContact();
    } else if (onNavigate) {
      onNavigate('contact');
    }
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
              className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-full bg-slate-50/90 border border-slate-200/80 shadow-xs shrink-0"
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
                      className={`relative font-sans text-[12.5px] xl:text-[13.5px] font-medium whitespace-nowrap py-1.5 xl:py-2 px-2.5 xl:px-3.5 rounded-full cursor-pointer flex items-center gap-1.5 z-10 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-sky-500 ${
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
                  className={`relative font-sans text-[12.5px] xl:text-[13.5px] font-medium whitespace-nowrap py-1.5 xl:py-2 px-2.5 xl:px-3.5 rounded-full cursor-pointer flex items-center gap-2 z-10 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-sky-500 ${
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

          {/* 3. Right Action Group (CTA button + Social Icons + Mobile Menu Toggle) */}
          <div className="flex-1 flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Start Project CTA (Desktop) */}
            <button
              onClick={handleCtaClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004d6a] hover:bg-[#073d52] text-white font-sans font-semibold text-xs tracking-wide shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Let's Talk</span>
            </button>

            {/* Facebook Button */}
            {showFacebook && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit NexorDive on Facebook"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#004d6a] border border-slate-200/80 transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <svg className="w-4 h-4 fill-[#004d6a]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
            )}

            {/* LinkedIn Button */}
            {showLinkedin && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit NexorDive on LinkedIn"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#004d6a] border border-slate-200/80 transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <svg className="w-4 h-4 fill-[#004d6a]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}

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
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleCtaClick();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#004d6a] hover:bg-[#073d52] text-white font-sans font-semibold text-xs tracking-wider shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Start a Project</span>
                </button>

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
