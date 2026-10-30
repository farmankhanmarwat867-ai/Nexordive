'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CheckCircle2,
  Flame,
  Gamepad2,
  PlaySquare,
  Radio,
  Wand2,
} from 'lucide-react';

interface StreamerAssetsProps {
  onInquirePackage?: (packageName: string) => void;
}

export const StreamerAssets: React.FC<StreamerAssetsProps> = ({ onInquirePackage }) => {
  // The 4 small starting price cards requested
  const startingPriceCards = [
    {
      id: 'twitch-assets',
      platform: 'Twitch Assets',
      startingPrice: 'From $29',
      priceNumeric: 29,
      icon: Gamepad2,
      accentColor: '#9333EA', // Twitch Purple
      badge: 'Popular',
      description: 'Animated stream overlays, custom webcam HUDs, Tier 1–3 subscriber badges, and kinetic emotes optimized for OBS Studio.',
      features: ['60fps WebM Stinger Transition', 'Animated Twitch Emotes (3 Sizes)', 'Custom Streamlabs Alert Boxes'],
    },
    {
      id: 'kick-assets',
      platform: 'Kick Assets',
      startingPrice: 'From $29',
      priceNumeric: 29,
      icon: Flame,
      accentColor: '#059669', // Kick Emerald / Green
      badge: 'Trending',
      description: 'Sleek, high-contrast broadcast graphics tailored for Kick creators, with green neon accents, live chat CSS, and goal bars.',
      features: ['Kick Verified Chat CSS Theme', 'Live Sub & Tip Goal Counters', 'Starting & BRB Kinetic Screens'],
    },
    {
      id: 'youtube-gaming',
      platform: 'YouTube Gaming',
      startingPrice: 'From $39',
      priceNumeric: 39,
      icon: PlaySquare,
      accentColor: '#DC2626', // YouTube Red
      badge: '4K Ready',
      description: 'Ultra-high-definition broadcast packs, animated channel memberships, click-worthy video thumbnails, and intro stingers.',
      features: ['4K Animated Screen Loops', 'Member Loyalty Badges & Stickers', 'Modular Video Endscreen Overlays'],
    },
    {
      id: 'vtuber-branding',
      platform: 'VTuber Branding',
      startingPrice: 'From $149',
      priceNumeric: 149,
      icon: Wand2,
      accentColor: '#DB2777', // VTuber Pink / Magenta
      badge: 'Bespoke Lore',
      description: 'Complete digital identity package for 2D/3D VTuber models, bespoke fantasy rooms, reactive audio props, and mascot emotes.',
      features: ['Live2D/3D Model Stage Rooms', 'Reactive Audio Visualizer Props', 'Bespoke Debut Logo & Stream Assets'],
    },
  ];

  // Full broadcast production suites
  const suites = [
    {
      id: 'signature-broadcast',
      name: 'Turnkey Esports & Streamer Package',
      turnaround: '7–10 Business Days',
      description: 'An all-inclusive broadcast overhaul engineered for partnered creators, esports teams, and tournament organizers.',
      items: [
        'Custom 60fps WebM stinger transitions with synced audio sound FX',
        'Starting Soon, Intermission, and Stream Ending animated scene loops',
        'Modular webcam HUDs with dynamic audio level bars & sponsor slots',
        'Custom interactive browser-source chatbox CSS for OBS / Streamlabs',
      ],
      popular: true,
    },
    {
      id: 'interactive-alert-engine',
      name: 'Custom WebGL Interactive Alerts',
      turnaround: '5–7 Business Days',
      description: 'Dynamic browser-source particles and audio cues that trigger live during subs, gift bombs, raids, and donations.',
      items: [
        'Particle physics alert animations rendered live in OBS browser source',
        'Custom synthesized audio chimes tailored to your channel aesthetic',
        'Twitch, Kick, and StreamElements webhook integration ready',
        'Web dashboard for modifying alert text, colors, and thresholds',
      ],
      popular: false,
    },
  ];

  const handleAction = (packageName: string) => {
    if (onInquirePackage) {
      onInquirePackage(packageName);
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="streamer-assets" className="py-24 md:py-32 relative bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Dedicated to Gamers & Creators</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight text-balance">
              Streamer Assets Hub
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Elevate your broadcast into an unforgettable visual spectacle. We craft broadcast-grade overlays, animated stingers, interactive alerts, and custom branding for top-tier creators across Twitch, Kick, YouTube, and VTubing.
          </p>
        </div>

        {/* 4 Small Starting Price Cards Grid (1 col on mobile, 2 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {startingPriceCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative rounded-2xl p-6 bg-white border border-slate-200 hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                {/* Subtle colored glow on hover */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none blur-3xl"
                  style={{ backgroundColor: card.accentColor }}
                />

                <div>
                  {/* Top: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform"
                      style={{ color: card.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-950 font-display mb-1 group-hover:text-indigo-600 transition-colors">
                    {card.platform}
                  </h3>

                  {/* Starting Price Highlight */}
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-extrabold text-slate-950 font-display tabular-nums tracking-tight">
                      {card.startingPrice}
                    </span>
                    <span className="text-xs text-slate-500">/ package</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    {card.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-1.5 mb-6">
                    {card.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleAction(`Streamer Asset: ${card.platform} (${card.startingPrice})`)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Get {card.platform.split(' ')[0]} Pack</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 2 Turnkey Suites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {suites.map((suite) => (
            <div
              key={suite.id}
              className={`p-8 rounded-2xl bg-white border flex flex-col justify-between relative shadow-xs ${
                suite.popular
                  ? 'border-indigo-400 shadow-xl shadow-indigo-500/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {suite.popular && (
                <div className="absolute -top-3 left-8 px-3 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  Recommended Suite
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-950 font-display mb-2">
                  {suite.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {suite.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  {suite.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 font-mono">
                  Turnaround: <span className="text-slate-900 font-semibold">{suite.turnaround}</span>
                </div>
                <button
                  onClick={() => handleAction(`Creator Suite: ${suite.name}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <span>Inquire for Suite</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
