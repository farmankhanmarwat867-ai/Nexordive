'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminStore';

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
    image: '/assets/hero_business_tech.jpg',
    imageAlt: 'NexorDive Digital & AI Solutions',
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
    const action = hero.primaryButtonAction || 'contact';
    if (action === 'contact') {
      if (onStartProject) onStartProject();
      else if (onOpenContact) onOpenContact();
      else window.location.hash = '#contact';
    } else if (action === 'streamer-assets') {
      if (onExploreStreamerAssets) onExploreStreamerAssets();
      else window.location.hash = '#streamer-assets';
    } else if (action === 'portfolio') {
      if (onExploreWork) onExploreWork();
      else window.location.hash = '#portfolio';
    } else {
      window.location.hash = `#${action}`;
    }
  };

  const handleSecondaryClick = () => {
    const action = hero.secondaryButtonAction || 'streamer-assets';
    if (action === 'streamer-assets') {
      if (onExploreStreamerAssets) onExploreStreamerAssets();
      else {
        const streamerSection = document.querySelector('#streamer-assets');
        if (streamerSection) streamerSection.scrollIntoView({ behavior: 'smooth' });
        else window.location.hash = '#streamer-assets';
      }
    } else if (action === 'portfolio') {
      if (onExploreWork) onExploreWork();
      else window.location.hash = '#portfolio';
    } else if (action === 'contact') {
      handlePrimaryClick();
    } else {
      window.location.hash = `#${action}`;
    }
  };

  const statCards = hero.statCards || [];

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen bg-[#0d5363] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden"
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

          {/* Right Column - Future Tech Holographic Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[540px] animate-float-slow">
              {/* Ambient backlight glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-400/25 via-sky-500/20 to-indigo-500/25 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

              {/* Styled image container */}
              <div className="relative rounded-3xl overflow-hidden border border-cyan-400/30 shadow-2xl shadow-[#04161b]/80 bg-[#071d24]">
                <img
                  src={hero.image || '/assets/hero_business_tech.jpg'}
                  alt={hero.imageAlt || 'NexorDive Digital & AI Solutions'}
                  className="w-full h-auto object-cover select-none"
                />
                {/* Subtle sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d5363]/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Glowing cyan pulse behind */}
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
