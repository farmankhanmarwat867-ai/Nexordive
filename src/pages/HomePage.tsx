'use client';

import React from 'react';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { CompanyMission } from '../components/CompanyMission';
import { Testimonials } from '../components/Testimonials';
import { BlogSection } from '../components/BlogSection';
import { PartnersMarquee } from '../components/PartnersMarquee';
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';

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
    { id: 'hero', name: 'Hero Section', visible: true, order: 0 },
    { id: 'services', name: 'Services Grid', visible: true, order: 1 },
    { id: 'mission', name: 'Company Mission & Stats', visible: true, order: 2 },
    { id: 'testimonials', name: 'Client Testimonials', visible: true, order: 3 },
    { id: 'blog', name: 'Latest Blog Cards', visible: true, order: 4 },
    { id: 'partners', name: 'Partners Marquee', visible: true, order: 5 },
    { id: 'ctaBanner', name: 'Bottom CTA Banner', visible: true, order: 6 },
  ];

  const sections = [...rawSections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="flex-1">
      {sections.map((sec) => {
        switch (sec.id) {
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
          case 'services':
            return (
              <Services
                key="services"
                onSelectService={() => onNavigate('services')}
              />
            );
          case 'mission':
            return <CompanyMission key="mission" />;
          case 'testimonials':
            return <Testimonials key="testimonials" />;
          case 'blog':
            return <BlogSection key="blog" />;
          case 'partners':
            return <PartnersMarquee key="partners" />;
          case 'ctaBanner':
            return (
              <section
                key="ctaBanner"
                className="py-20 bg-[#0d5363] text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200">
                    <span>Ready to Scale Your Brand?</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight">
                    Let's Engineer Your Next Big Digital Milestone.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
                    From modern web applications and AI automation to high-voltage streamer graphics, NexorDive brings world-class craft to your vision.
                  </p>
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={onStartProject || (() => onNavigate('contact'))}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0d5363] hover:bg-slate-100 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all cursor-pointer"
                    >
                      <span>Start a Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('services')}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black/25 hover:bg-black/40 text-white font-semibold text-xs sm:text-sm tracking-wide border border-white/20 transition-all cursor-pointer"
                    >
                      <span>Explore All Services</span>
                    </button>
                  </div>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
