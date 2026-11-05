'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { executeAction } from '../utils/actionHandler';
import { trackCtaClick } from '../utils/analytics';
import {
  getHeadlineSizeClass,
  getHeadlineStyle,
  getParagraphSizeClass,
  getParagraphStyle,
} from '../utils/typography';

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
    imageAlt: 'NexorDive Digital Solutions Visual',
    secondaryShapeImage: '/assets/khyber/hero_accent_blob.png',
    secondaryShapeAlt: 'White Organic Accent Backdrop Shape',
    outlineGraphic: '/assets/khyber/hero_orbit_ring.png',
    outlineGraphicAlt: 'White Orbital Outline Contour Line',
    primaryButtonLabel: 'Start a Project',
    primaryButtonAction: 'contact',
    secondaryButtonLabel: 'Explore Streamer Assets',
    secondaryButtonAction: 'streamer-assets',
    statCards: [
      { id: 'stat-1', value: '7+', label: 'Core Digital Services' },
      { id: 'stat-2', value: 'Global', label: 'Remote Delivery Process' },
      { id: 'stat-3', value: 'Mobile', label: 'SaaS & Web Platforms' },
    ],
  };

  const handlePrimaryClick = () => {
    trackCtaClick(hero.primaryButtonLabel || 'Start a Project', hero.primaryButtonAction || 'contact');
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
    trackCtaClick(hero.secondaryButtonLabel || 'Explore Streamer Assets', hero.secondaryButtonAction || 'streamer-assets');
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
      className="relative min-h-[85vh] lg:min-h-[calc(100vh-1rem)] bg-[#004d6a] pt-24 pb-8 sm:pb-10 lg:pt-28 lg:pb-10 flex items-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#093c47] rounded-full blur-2xl pointer-events-none" />

      {/* Subtle Dot matrix grid on bottom left */}
      <div className="absolute bottom-3 left-6 sm:left-12 w-64 sm:w-80 h-24 sm:h-28 pattern-dots opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col items-start text-left space-y-3.5 sm:space-y-4 pt-1 lg:pt-0"
          >
            {/* Main Heading - Clean, refined, balanced sizing designed to fit above the fold */}
            <h1
              className={`font-extrabold text-white font-sans tracking-tight leading-[1.12] text-balance ${getHeadlineSizeClass(hero.headingSize, 'text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.15rem]')}`}
              style={getHeadlineStyle(hero.headingSize)}
            >
              <span
                className={getHeadlineSizeClass(hero.line1Size)}
                style={getHeadlineStyle(hero.line1Size)}
              >
                {hero.headingLine1 || 'Deep Digital'}
              </span>
              {hero.headingLine2 && (
                <>
                  <br />
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-100 ${getHeadlineSizeClass(hero.line2Size)}`}
                    style={getHeadlineStyle(hero.line2Size)}
                  >
                    {hero.headingLine2}
                  </span>
                </>
              )}
              {hero.headingLine3 && (
                <>
                  <br />
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-[#4ee1d6] ${getHeadlineSizeClass(hero.line3Size)}`}
                    style={getHeadlineStyle(hero.line3Size)}
                  >
                    {hero.headingLine3}
                  </span>
                </>
              )}
              {hero.headingLine4 && (
                <>
                  {' '}
                  <span
                    className={`text-white ${getHeadlineSizeClass(hero.line4Size)}`}
                    style={getHeadlineStyle(hero.line4Size)}
                  >
                    {hero.headingLine4}
                  </span>
                </>
              )}
            </h1>

            {/* Sub-text */}
            <p
              className={`text-slate-200/90 font-normal leading-relaxed max-w-lg ${getParagraphSizeClass(hero.descriptionSize, 'text-xs sm:text-sm lg:text-[14.5px] xl:text-[15px]')}`}
              style={getParagraphStyle(hero.descriptionSize)}
            >
              {hero.description}
            </p>

            {/* Action Buttons: Gradient Start a Project & Dark Secondary */}
            <div className="pt-1 sm:pt-1.5 flex flex-wrap items-center gap-3 sm:gap-4 w-full">
              {/* Primary Gradient Pill Button */}
              {hero.primaryButtonLabel && (
                <button
                  onClick={handlePrimaryClick}
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-[#4ee1d6] via-[#38bdf8] to-[#818cf8] hover:shadow-xl hover:shadow-cyan-400/25 hover:-translate-y-0.5 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{hero.primaryButtonLabel}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Secondary Dark Pill Button */}
              {hero.secondaryButtonLabel && (
                <button
                  onClick={handleSecondaryClick}
                  className="inline-flex items-center justify-center px-5 py-3 sm:px-6 sm:py-3.5 rounded-full bg-[#122b3e]/80 hover:bg-[#16354d] hover:border-cyan-400/40 text-white font-bold text-xs sm:text-sm tracking-wide border border-[#234b6b] active:scale-95 transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <span>{hero.secondaryButtonLabel}</span>
                </button>
              )}
            </div>

            {/* Stat / Feature Cards directly underneath */}
            {statCards.length > 0 && (
              <div
                className={`pt-2 sm:pt-2.5 grid gap-2.5 sm:gap-3 w-full max-w-lg ${
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
                    className="p-3 sm:p-3.5 rounded-xl bg-[#0f2438]/85 border border-[#1e405e]/80 backdrop-blur-md hover:border-cyan-400/40 transition-all duration-300 group"
                  >
                    <div className="text-base sm:text-lg font-bold text-cyan-300 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
                      {stat.value}
                    </div>
                    <div className="text-[11px] sm:text-[11.5px] text-slate-300 font-medium mt-0.5 line-clamp-1">
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
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[490px] xl:max-w-[520px] aspect-[932/766] flex items-center justify-center select-none animate-float-slow">
              
              {/* Image 2: Secondary Organic Accent Shape / Backdrop Blob */}
              {hero.secondaryShapeImage && (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none"
              >
                <img
                  src={hero.image || '/assets/khyber/hero_main_tech.png'}
                  alt={hero.imageAlt || 'NexorDive Futuristic Digital Technology Visual'}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  loading="eager"
                />
              </motion.div>

              {/* Image 3: Orbital Loop Ring */}
              {hero.outlineGraphic && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
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
              <div className="absolute inset-8 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
