'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { executeAction } from '../utils/actionHandler';

interface HeroProps {
  onOpenContact?: () => void;
  onExploreWork?: () => void;
  onExploreStreamerAssets?: () => void;
  onStartProject?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenContact,
  onExploreWork,
  onExploreStreamerAssets,
  onStartProject,
}) => {
  const { content } = useAdmin();
  const hero = content?.hero || {
    badge: 'WEB • DESIGN • MARKETING • SOFTWARE • AUTOMATION',
    headingLine1: 'Digital Solutions for',
    headingLine2: 'Businesses Ready to',
    headingLine3: 'Build and Grow',
    headingLine4: '',
    description:
      'Build your digital presence with Nexordive. We bring web development, graphic design, digital marketing, AI automation, mobile app development, SaaS solutions and Shopify services together to help turn business ideas into useful digital products and experiences.',
    image: '/assets/khyber/hero_main_tech.png',
    imageAlt: 'NexorDive Digital Solutions Visual',
    secondaryShapeImage: '/assets/khyber/hero_accent_blob.png',
    secondaryShapeAlt: 'White Organic Accent Backdrop Shape',
    outlineGraphic: '/assets/khyber/hero_orbit_ring.png',
    outlineGraphicAlt: 'White Orbital Outline Contour Line',
    primaryButtonLabel: 'Discuss Your Project',
    primaryButtonAction: 'contact',
    secondaryButtonLabel: 'Explore Our Services',
    secondaryButtonAction: 'services',
    statCards: [
      { id: 'stat-1', value: '7 Focused Solutions', label: 'One Digital Partner' },
      { id: 'stat-2', value: 'Mobile-First', label: 'All Screen Sizes' },
      { id: 'stat-3', value: 'Clear Scope', label: 'Milestones & Planning' },
    ],
  };

  const handlePrimaryClick = () => {
    executeAction(hero.primaryButtonAction || 'contact', {
      onStartProject,
      onOpenContact,
      onNavigate: (page) => {
        if (page === 'portfolio' && onExploreWork) onExploreWork();
        else if (page === 'streamer-assets' && onExploreStreamerAssets) onExploreStreamerAssets();
        else window.location.hash = page === 'home' ? '' : `#${page}`;
      },
    });
  };

  const handleSecondaryClick = () => {
    executeAction(hero.secondaryButtonAction || 'streamer-assets', {
      onStartProject,
      onOpenContact,
      onNavigate: (page) => {
        if (page === 'portfolio' && onExploreWork) onExploreWork();
        else if (page === 'streamer-assets' && onExploreStreamerAssets) onExploreStreamerAssets();
        else window.location.hash = page === 'home' ? '' : `#${page}`;
      },
    });
  };

  const statCards = hero.statCards || [];

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen bg-[#004d6a] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#093c47] rounded-full blur-2xl pointer-events-none" />

      {/* Subtle Dot matrix grid on bottom left */}
      <div className="absolute bottom-4 left-6 sm:left-12 w-64 sm:w-80 h-28 sm:h-36 pattern-dots opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col items-start text-left space-y-6 pt-2 lg:pt-0"
          >
            {/* Optional Badge */}
            {hero.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-200 text-xs font-semibold tracking-wide backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{hero.badge}</span>
              </div>
            )}

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-extrabold text-white font-sans tracking-tight leading-[1.08] text-balance">
              {hero.headingLine1 || 'Digital Solutions for'}
              {hero.headingLine2 && (
                <>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-100">
                    {hero.headingLine2}
                  </span>
                </>
              )}
              {hero.headingLine3 && (
                <>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-[#4ee1d6]">
                    {hero.headingLine3}
                  </span>
                </>
              )}
              {hero.headingLine4 && (
                <>
                  {' '}
                  <span className="text-white">
                    {hero.headingLine4}
                  </span>
                </>
              )}
            </h1>

            {/* Sub-text */}
            <p className="text-sm sm:text-base lg:text-[17px] text-slate-200/90 font-normal leading-relaxed max-w-xl">
              {hero.description}
            </p>

            {/* Action Buttons: Gradient Start a Project & Dark Secondary */}
            <div className="pt-2 flex flex-wrap items-center gap-4 w-full">
              {/* Primary Gradient Pill Button */}
              {hero.primaryButtonLabel && (
                <button
                  onClick={handlePrimaryClick}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#4ee1d6] via-[#38bdf8] to-[#818cf8] hover:shadow-xl hover:shadow-cyan-400/25 hover:-translate-y-0.5 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{hero.primaryButtonLabel}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Secondary Dark Pill Button */}
              {hero.secondaryButtonLabel && (
                <button
                  onClick={handleSecondaryClick}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#122b3e]/80 hover:bg-[#16354d] hover:border-cyan-400/40 text-white font-bold text-xs sm:text-sm tracking-wide border border-[#234b6b] active:scale-95 transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <span>{hero.secondaryButtonLabel}</span>
                </button>
              )}
            </div>

            {/* Stat / Feature Cards directly underneath */}
            {statCards.length > 0 && (
              <div
                className={`pt-4 grid gap-3 w-full max-w-xl ${
                  statCards.length === 1
                    ? 'grid-cols-1'
                    : statCards.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
                }`}
              >
                {statCards.map((stat) => (
                  <div
                    key={stat.id}
                    className="p-4 rounded-2xl bg-[#0f2438]/80 border border-[#1e405e]/80 backdrop-blur-md hover:border-cyan-400/40 transition-all duration-300 group"
                  >
                    <div className="text-lg sm:text-xl font-bold text-cyan-300 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
                      {stat.value}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column - Future Tech Holographic Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[560px] lg:max-w-[620px] aspect-[932/766] flex items-center justify-center select-none animate-float-slow">
              
              {/* Image 2: Secondary Organic Accent Shape / Backdrop Blob */}
              {hero.secondaryShapeImage && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.25, ease: 'easeOut' }}
                  className="absolute inset-0 z-10 pointer-events-none"
                >
                  <img
                    src={hero.secondaryShapeImage}
                    alt={hero.secondaryShapeAlt || 'White Organic Accent Shape'}
                    className="w-full h-full object-contain pointer-events-none"
                    loading="eager"
                  />
                </motion.div>
              )}

              {/* Image 1: Main Future Tech Graphic */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none"
              >
                <img
                  src={hero.image || '/assets/khyber/hero_main_tech.png'}
                  alt={hero.imageAlt || 'NexorDive Futuristic Digital Technology Visual'}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)]"
                  loading="eager"
                />
              </motion.div>

              {/* Image 3: Orbital Loop Ring */}
              {hero.outlineGraphic && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
                  className="absolute inset-0 z-30 pointer-events-none"
                >
                  <img
                    src={hero.outlineGraphic}
                    alt={hero.outlineGraphicAlt || 'White Orbital Outline Loop'}
                    className="w-full h-full object-contain pointer-events-none"
                    loading="eager"
                  />
                </motion.div>
              )}

              {/* Ambient Glow Effects */}
              <div className="absolute inset-10 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
