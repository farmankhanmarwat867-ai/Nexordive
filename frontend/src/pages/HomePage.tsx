'use client';

import React from 'react';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { Services } from '../components/Services';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { Testimonials } from '../components/Testimonials';
import { HomeFAQ } from '../components/HomeFAQ';
import { PartnersMarquee } from '../components/PartnersMarquee';
import { StreamerAssets } from '../components/StreamerAssets';
import { Pricing } from '../components/Pricing';
import { DynamicCustomBlock } from '../components/common/DynamicCustomBlock';
import { ArrowRight, Sparkles, MessageCircle, Mail } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { executeAction } from '../utils/actionHandler';
import {
  getHeadlineSizeClass,
  getHeadlineStyle,
  getParagraphSizeClass,
  getParagraphStyle,
} from '../utils/typography';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenContact: () => void;
  onOpenContactWithSummary: (summary: string) => void;
  onStartProject?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenContact,
  onOpenContactWithSummary,
  onStartProject,
}) => {
  const { content } = useAdmin();
  const defaultSections = [
    { id: 'hero', label: 'Hero Section', visible: true, order: 1 },
    { id: 'services', label: 'Services Grid', visible: true, order: 2 },
    { id: 'about', label: 'Why NexorDive & Who We Support', visible: true, order: 3 },
    { id: 'process', label: 'Our Process (Idea to Launch)', visible: true, order: 4 },
    { id: 'portfolio', label: 'Selected Work & Concepts', visible: true, order: 5 },
    { id: 'testimonials', label: 'Client Testimonials', visible: true, order: 6 },
    { id: 'faq', label: 'Home FAQ', visible: true, order: 7 },
    { id: 'streamer-assets', label: 'Streamer Assets Hub', visible: false, order: 8 },
    { id: 'pricing', label: 'Pricing Packages', visible: false, order: 9 },
    { id: 'partners', label: 'Partners Marquee', visible: true, order: 10 },
    { id: 'ctaBanner', label: 'Bottom Conversion Banner', visible: true, order: 11 },
  ];

  const rawSections = content?.sectionsManager?.landingPageSections || defaultSections;

  // Ensure all key sections are present even if older localStorage data lacked them
  let workingSections = [...rawSections];
  if (!workingSections.some((s) => s.id === 'process')) {
    workingSections.push({ id: 'process', label: 'Our Process', visible: true, order: 4 });
  }
  if (!workingSections.some((s) => s.id === 'portfolio' || s.id === 'work')) {
    workingSections.push({ id: 'portfolio', label: 'Selected Work & Concepts', visible: true, order: 5 });
  }
  if (!workingSections.some((s) => s.id === 'faq')) {
    workingSections.push({ id: 'faq', label: 'Home FAQ', visible: true, order: 7 });
  }
  if (!workingSections.some((s) => s.id === 'streamer-assets' || s.id === 'streamer')) {
    workingSections.push({ id: 'streamer-assets', label: 'Streamer Assets Hub', visible: false, order: 8 });
  }
  if (!workingSections.some((s) => s.id === 'pricing')) {
    workingSections.push({ id: 'pricing', label: 'Pricing Packages', visible: false, order: 9 });
  }

  // Ensure all custom sections are registered in working sections
  if (Array.isArray(content?.customSections)) {
    for (const c of content.customSections) {
      if (!workingSections.some((s) => s.id === c.id)) {
        workingSections.push({
          id: c.id,
          label: c.title,
          visible: c.visible,
          order: c.order ?? workingSections.length + 1,
          isCustom: true,
          customType: c.type,
        });
      }
    }
  }

  const sections = workingSections
    .filter((s) => s.id !== 'blog' && s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="flex flex-col w-full flex-1">
      {sections.map((section) => {
        switch (section.id) {
          case 'hero':
            return (
              <Hero
                key="hero"
                onOpenContact={onOpenContact}
                onStartProject={onStartProject}
                onExploreStreamerAssets={() => onNavigate('streamer-assets')}
                onExploreWork={() => onNavigate('portfolio')}
              />
            );
          case 'about':
          case 'mission':
            return (
              <AboutSection
                key="about"
                onNavigate={onNavigate}
                onReadMore={() => onNavigate('about')}
                onStartProject={onStartProject}
                onOpenContact={onOpenContact}
                onOpenContactWithSummary={onOpenContactWithSummary}
              />
            );
          case 'services':
            return (
              <Services
                key="services"
                limit={4}
                onViewAllServices={() => onNavigate('services')}
                onSelectService={(serviceTitle) => {
                  const title = serviceTitle.toLowerCase();
                  if (title.includes('all') || title.includes('explore') || title.includes('read more')) {
                    onNavigate('services');
                    return;
                  }
                  if (title.includes('web')) {
                    onNavigate('web-development');
                  } else if (title.includes('graphic') || title.includes('design') || title.includes('brand')) {
                    onNavigate('graphic-design');
                  } else if (title.includes('market') || title.includes('seo') || title.includes('social')) {
                    onNavigate('digital-marketing');
                  } else if (title.includes('ai') || title.includes('auto') || title.includes('bot')) {
                    onNavigate('ai-automation');
                  } else if (title.includes('mobile') || title.includes('app') || title.includes('ios') || title.includes('android')) {
                    onNavigate('mobile-app-development');
                  } else if (title.includes('saas')) {
                    onNavigate('saas-development');
                  } else if (title.includes('shopify') || title.includes('commerce')) {
                    onNavigate('shopify-development');
                  } else if (title.includes('streamer')) {
                    onNavigate('streamer-assets');
                  } else {
                    onNavigate('services');
                  }
                }}
              />
            );
          case 'process':
            return <ProcessTimeline key="process" />;
          case 'portfolio':
          case 'work':
            return (
              <FeaturedProjects
                key="featured-projects"
                onViewAll={() => onNavigate('portfolio')}
                onInquireProject={(projectName) =>
                  onOpenContactWithSummary(`Project Inquiry: ${projectName}`)
                }
              />
            );
          case 'faq':
            return <HomeFAQ key="faq" onOpenContact={onOpenContact} />;
          case 'streamer-assets':
          case 'streamer':
            return (
              <StreamerAssets
                key="streamer-assets"
                showSuites={false}
                onViewAll={() => onNavigate('streamer-assets')}
                onInquirePackage={(packageName) =>
                  onOpenContactWithSummary(`Streamer Pack Inquiry: ${packageName}`)
                }
              />
            );
          case 'pricing':
            return (
              <Pricing
                key="pricing"
                onViewAll={() => onNavigate('pricing')}
                onSelectPackage={(pkg, price) =>
                  onOpenContactWithSummary(`Pricing Inquiry: ${pkg} (${price})`)
                }
              />
            );
          case 'testimonials':
            return <Testimonials key="testimonials" />;

          case 'partners':
            return <PartnersMarquee key="partners" />;
          case 'ctaBanner': {
            const banner = content?.ctaBanner;
            const eyebrow = banner?.eyebrow || "Let's Build Together";
            const heading = banner?.heading || 'Tell Us What You Want to Build';
            const description =
              banner?.description ||
              'Have a website, design, marketing, automation, mobile app, SaaS or Shopify project in mind? Tell us about your goals and we will discuss a suitable approach and scope.';
            const primaryLabel = banner?.primaryButtonLabel || 'Request a Project Consultation';
            const primaryAction = banner?.primaryButtonAction || 'contact';

            return (
              <section
                key="ctaBanner"
                className="py-24 sm:py-32 bg-gradient-to-br from-[#004d6a] via-[#093c47] to-[#06242c] text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{eyebrow}</span>
                  </div>
                  <h2
                    className={`font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance ${getHeadlineSizeClass(banner?.headingSize, 'text-3xl sm:text-5xl lg:text-6xl')}`}
                    style={getHeadlineStyle(banner?.headingSize)}
                  >
                    {heading}
                  </h2>
                  <p
                    className={`text-slate-200/90 max-w-xl mx-auto font-normal leading-relaxed ${getParagraphSizeClass(banner?.descriptionSize, 'text-sm sm:text-base')}`}
                    style={getParagraphStyle(banner?.descriptionSize)}
                  >
                    {description}
                  </p>
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={() =>
                        executeAction(primaryAction, {
                          onNavigate,
                          onStartProject,
                          onOpenContact,
                          onOpenContactWithSummary,
                        })
                      }
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4ee1d6] to-[#38bdf8] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white group"
                    >
                      <span>{primaryLabel}</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a
                      href="https://wa.me/923146009810?text=Hello%20Nexordive%2C%20I%20would%20like%20to%20discuss%20a%20project"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm tracking-wide border border-white/20 hover:border-white/40 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Contact via WhatsApp (+92 314 600 9810)</span>
                    </a>
                  </div>
                  <div className="pt-2">
                    <a
                      href="mailto:hello@nexordive.com"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-200/90 hover:text-white transition-colors underline underline-offset-4"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-300" />
                      <span>hello@nexordive.com</span>
                    </a>
                  </div>
                </div>
              </section>
            );
          }
          default: {
            // Render custom block if matches an active custom section
            const customBlock = content?.customSections?.find((c) => c.id === section.id);
            if (customBlock && customBlock.visible !== false) {
              return (
                <DynamicCustomBlock
                  key={customBlock.id}
                  block={customBlock}
                  onNavigate={onNavigate}
                  onStartProject={onStartProject}
                  onOpenContact={onOpenContact}
                  onOpenContactWithSummary={onOpenContactWithSummary}
                />
              );
            }
            return null;
          }
        }
      })}
    </div>
  );
};
