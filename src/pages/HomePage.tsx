'use client';

import React from 'react';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { Services } from '../components/Services';
import { Testimonials } from '../components/Testimonials';
import { BlogSection } from '../components/BlogSection';
import { PartnersMarquee } from '../components/PartnersMarquee';
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { executeAction } from '../utils/actionHandler';

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
  const rawSections = content?.sectionsManager?.landingPageSections || [
    { id: 'hero', label: 'Hero Section', visible: true, order: 1 },
    { id: 'about', label: 'About NexorDive', visible: true, order: 2 },
    { id: 'services', label: 'Services Grid', visible: true, order: 3 },
    { id: 'testimonials', label: 'Client Testimonials', visible: true, order: 4 },
    { id: 'blog', label: 'Latest Blog Cards', visible: true, order: 5 },
    { id: 'partners', label: 'Partners Marquee', visible: true, order: 6 },
    { id: 'ctaBanner', label: 'Bottom CTA Banner', visible: true, order: 7 },
  ];

  const sections = [...rawSections]
    .filter((s) => s.visible !== false)
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
                onReadMore={() => onNavigate('about')}
              />
            );
          case 'services':
            return (
              <Services
                key="services"
                onSelectService={(_serviceTitle) => onNavigate('services')}
              />
            );
          case 'testimonials':
            return <Testimonials key="testimonials" />;
          case 'blog':
            return <BlogSection key="blog" />;
          case 'partners':
            return <PartnersMarquee key="partners" />;
          case 'ctaBanner': {
            const banner = content?.ctaBanner;
            const eyebrow = banner?.eyebrow || 'Ready to Scale Your Brand?';
            const heading = banner?.heading || "Let's Engineer Your Next Big Digital Milestone.";
            const description =
              banner?.description ||
              'From modern web applications and AI automation to high-voltage streamer graphics, NexorDive brings world-class craft to your vision.';
            const primaryLabel = banner?.primaryButtonLabel || 'Start a Project';
            const primaryAction = banner?.primaryButtonAction || 'start-project';
            const secondaryLabel = banner?.secondaryButtonLabel || 'Explore All Services';
            const secondaryAction = banner?.secondaryButtonAction || 'services';

            return (
              <section
                key="ctaBanner"
                className="py-20 bg-[#0d5363] text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200">
                    <span>{eyebrow}</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight">
                    {heading}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
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
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0d5363] hover:bg-slate-100 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all cursor-pointer"
                    >
                      <span>{primaryLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        executeAction(secondaryAction, {
                          onNavigate,
                          onStartProject,
                          onOpenContact,
                          onOpenContactWithSummary,
                        })
                      }
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black/25 hover:bg-black/40 text-white font-semibold text-xs sm:text-sm tracking-wide border border-white/20 transition-all cursor-pointer"
                    >
                      <span>{secondaryLabel}</span>
                    </button>
                  </div>
                </div>
              </section>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
};
