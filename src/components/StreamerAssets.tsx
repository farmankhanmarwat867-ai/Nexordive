'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Radio, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { DynamicIcon } from './common/DynamicIcon';
import { StreamerStartingCard, StreamerSuite } from '../types/content';

interface StreamerAssetsProps {
  onInquirePackage?: (packageName: string) => void;
}

export const StreamerAssets: React.FC<StreamerAssetsProps> = ({ onInquirePackage }) => {
  const { content } = useAdmin();
  const streamerData = content?.streamer;

  const rawStartingCards = streamerData?.startingCards || [];
  const startingPriceCards = rawStartingCards
    .filter((c: StreamerStartingCard) => c.visible !== false)
    .sort((a: StreamerStartingCard, b: StreamerStartingCard) => (a.order ?? 0) - (b.order ?? 0));

  const suites = streamerData?.suites || [];

  const handleAction = (packageName: string) => {
    if (onInquirePackage) {
      onInquirePackage(packageName);
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contact';
      }
    }
  };

  return (
    <section id="streamer-assets" className="py-24 md:py-32 relative border-t border-slate-200/80 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>{streamerData?.sectionEyebrow || 'Dedicated to Gamers & Creators'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight text-balance">
              {streamerData?.sectionTitle || 'Streamer Assets Hub'}
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            {streamerData?.sectionDescription ||
              'Elevate your broadcast into an unforgettable visual spectacle. We craft broadcast-grade overlays, animated stingers, interactive alerts, and custom branding for top-tier creators across Twitch, Kick, YouTube, and VTubing.'}
          </p>
        </div>

        {/* Starting Price Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {startingPriceCards.map((card: StreamerStartingCard, index: number) => (
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
              className="group relative rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Platform Badge & Icon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: card.accentColor || '#9333EA' }}
                  >
                    <DynamicIcon name={card.iconName} className="w-5 h-5" />
                  </div>
                  {card.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60">
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Platform Name & Price */}
                <h3 className="text-lg font-bold text-slate-950 font-display mb-1">
                  {card.platform}
                </h3>
                <div className="text-xl font-extrabold text-slate-950 font-display tracking-tight mb-3">
                  {card.startingPrice}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  {card.description}
                </p>

                {/* Features List */}
                {card.features && card.features.length > 0 && (
                  <div className="space-y-2 mb-6 pt-3 border-t border-slate-100">
                    {card.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0 mt-0.5"
                          style={{ color: card.accentColor || '#9333EA' }}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAction(`${card.platform} (${card.startingPrice})`)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Customize Pack</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Broadcast Turnkey Suites Section */}
        {suites.length > 0 && (
          <div>
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-semibold block mb-1">
                Full Production
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
                All-Inclusive Broadcast Suites
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {suites.map((suite: StreamerSuite) => (
                <div
                  key={suite.id}
                  className={`p-8 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
                    suite.popular
                      ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-500/5'
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-medium text-slate-500">
                        Turnaround: {suite.turnaround}
                      </span>
                      {suite.popular && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Staff Pick</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-bold text-slate-950 font-display mb-2">
                      {suite.name}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {suite.description}
                    </p>

                    {suite.items && suite.items.length > 0 && (
                      <div className="space-y-2.5 mb-8">
                        {suite.items.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAction(suite.name)}
                    className="w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-950 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Inquire Broadcast Suite</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
