'use client';

import React from 'react';
import { motion } from 'motion/react';
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
    badge: '',
    headingLine1: 'Deep Digital',
    headingLine2: 'Solutions for',
    headingLine3: 'Modern',
    headingLine4: 'Businesses',
    description:
      'NexorDive builds websites, software systems, digital marketing assets, AI automation and premium streamer graphics for brands and creators who want to grow online.',
    image: '/assets/khyber/hero_main_tech.png',
    imageAlt: 'NexorDive Digital & AI Solutions',
    secondaryShapeImage: '/assets/khyber/hero_accent_blob.png',
    secondaryShapeAlt: 'White Organic Accent Backdrop Shape',
    outlineGraphic: '/assets/khyber/hero_orbit_ring.png',
    outlineGraphicAlt: 'White Orbital Outline Contour Line',
    primaryButtonLabel: 'Start a Project',
    primaryButtonAction: 'contact',
    secondaryButtonLabel: 'Explore Streamer Assets',
    secondaryButtonAction: 'streamer-assets',
    statCards: [
      { id: 'stat-1', value: '7+', label: 'Service Areas' },
      { id: 'stat-2', value: 'Global', label: 'Client Ready' },
      { id: 'stat-3', value: 'Mobile', label: 'First Design' },
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
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#093c47] rounded-full blur-2xl pointer-events-none" />

      {/* Subtle Dot matrix grid on bottom left exactly like video */}
      <div className="absolute bottom-4 left-6 sm:left-12 w-64 sm:w-80 h-28 sm:h-36 pattern-dots opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-start text-left space-y-6 pt-4 lg:pt-0"
          >
            {/* Optional Badge */}
            {hero.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-200 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{hero.badge}</span>
              </div>
            )}

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white font-sans tracking-tight leading-[1.08]">
              {hero.headingLine1 || 'Deep Digital'}
              {hero.headingLine2 && (
                <>
                  <br />
                  {hero.headingLine2}
                </>
              )}
              {hero.headingLine3 && (
                <>
                  <br />
                  {hero.headingLine3}
                </>
              )}
              {hero.headingLine4 && (
                <>
                  <br />
                  {hero.headingLine4}
                </>
              )}
            </h1>

            {/* Sub-text */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              {hero.description}
            </p>

            {/* Action Buttons: Gradient Start a Project & Dark Secondary */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 w-full">
              {/* Primary Gradient Pill Button */}
              {hero.primaryButtonLabel && (
                <button
                  onClick={handlePrimaryClick}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#4ee1d6] via-[#38bdf8] to-[#818cf8] hover:opacity-95 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition-all cursor-pointer group"
                >
                  <span>{hero.primaryButtonLabel}</span>
                  <span className="text-sm font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              )}

              {/* Secondary Dark Pill Button */}
              {hero.secondaryButtonLabel && (
                <button
                  onClick={handleSecondaryClick}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#122b3e]/80 hover:bg-[#16354d] text-white font-bold text-xs sm:text-sm tracking-wide border border-[#234b6b] active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <span>{hero.secondaryButtonLabel}</span>
                </button>
              )}
            </div>

            {/* Stat / Feature Cards directly underneath */}
            {statCards.length > 0 && (
              <div
                className={`pt-3 grid gap-3 w-full max-w-xl ${
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
                    className="p-4 rounded-2xl bg-[#0f2438]/70 border border-[#1e405e]/70 backdrop-blur-sm"
                  >
                    <div className="text-base sm:text-lg font-bold text-white font-sans">
                      {stat.value}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column - Future Tech Holographic Visual (3 Managed Visual Elements) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[560px] lg:max-w-[620px] aspect-[932/766] flex items-center justify-center select-none animate-float-slow">
              
              {/* Image 2: Secondary Organic Accent Shape / Backdrop Blob (Layer 2 - Left Behind) */}
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
                  />
                </motion.div>
              )}

              {/* Image 1: Main Future Tech Graphic / Organic Visual (Layer 1 - Center) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none"
              >
                <img
                  src={hero.image || '/assets/khyber/hero_main_tech.png'}
                  alt={hero.imageAlt || 'NexorDive Futuristic Digital Technology Visual'}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
                />
              </motion.div>

              {/* Image 3: Orbital Loop Ring / Outline Graphic (Layer 3 - Surrounding Top & Right) */}
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
                  />
                </motion.div>
              )}

              {/* Ambient Glow Effects */}
              <div className="absolute inset-10 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
