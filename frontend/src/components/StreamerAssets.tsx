'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Radio, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { DynamicIcon } from './common/DynamicIcon';
import { StreamerStartingCard, StreamerSuite } from '../types/content';
import { executeAction } from '../utils/actionHandler';

interface StreamerAssetsProps {
  onInquirePackage?: (packageName: string) => void;
  onViewAll?: () => void;
  showSuites?: boolean;
}

export const StreamerAssets: React.FC<StreamerAssetsProps> = ({ onInquirePackage, onViewAll, showSuites = true }) => {
  const { content } = useAdmin();
  const streamerData = content?.streamer;

  const rawStartingCards = streamerData?.startingCards || [];
  const startingPriceCards = rawStartingCards
    .filter((c: StreamerStartingCard) => c.visible !== false)
    .sort((a: StreamerStartingCard, b: StreamerStartingCard) => (a.order ?? 0) - (b.order ?? 0));

  const suites = (streamerData?.suites || [])
    .filter((s: StreamerSuite) => s.visible !== false)
    .sort((a: StreamerSuite, b: StreamerSuite) => (a.order ?? 0) - (b.order ?? 0));

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
    <section id="streamer-assets" className="py-24 md:py-32 relative bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-4">
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>{streamerData?.sectionEyebrow || 'Dedicated to Gamers & Creators'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight text-balance">
              {streamerData?.sectionTitle || 'Streamer Assets Hub'}
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              {streamerData?.sectionDescription ||
                'Elevate your broadcast into an unforgettable visual spectacle. We craft broadcast-grade overlays, animated stingers, interactive alerts, and custom branding for top-tier creators across Twitch, Kick, YouTube, and VTubing.'}
            </p>
            {onViewAll && (
              <div className="mt-3 flex justify-start md:justify-end">
                <button
                  type="button"
                  onClick={onViewAll}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004d6a] hover:text-[#093c47] transition-colors group cursor-pointer"
                >
                  <span>View All Assets</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Starting Price Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {startingPriceCards.map((card: StreamerStartingCard, index: number) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 hover:border-[#0d5363]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div>
                {/* Platform Badge & Icon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: card.accentColor || '#004d6a' }}
                  >
                    <DynamicIcon name={card.iconName} className="w-5 h-5" />
                  </div>
                  {card.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60">
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Platform Name & Price */}
                <h3 className="text-lg font-bold text-slate-900 font-serif mb-1">
                  {card.platform}
                </h3>
                <div className="text-2xl font-extrabold text-slate-950 font-mono tracking-tight mb-3">
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
                          className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-600"
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
                className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-[#004d6a] text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <span>Customize Pack</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All CTA Button */}
        {onViewAll && (
          <div className="flex justify-center -mt-6 mb-16">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#004d6a]/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer border border-cyan-400/20 group"
            >
              <span>View All Streamer Assets</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Broadcast Turnkey Suites Section */}
        {showSuites && suites.length > 0 && (
          <div>
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-[#004d6a] font-bold block mb-1">
                {streamerData?.suitesSectionEyebrow || 'Full Production'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-950">
                {streamerData?.suitesSectionTitle || 'All-Inclusive Broadcast Suites'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {suites.map((suite: StreamerSuite) => (
                <div
                  key={suite.id}
                  className={`p-7 sm:p-8 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                    suite.popular
                      ? 'border-2 border-[#004d6a] shadow-xl shadow-[#004d6a]/10'
                      : 'border-slate-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-medium text-slate-500">
                        Turnaround: {suite.turnaround}
                      </span>
                      {suite.popular && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-[#004d6a] flex items-center gap-1 font-mono">
                          <Sparkles className="w-3 h-3 text-[#004d6a]" />
                          <span>Staff Pick</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-bold font-serif text-slate-900 mb-2">
                      {suite.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {suite.description}
                    </p>

                    {suite.items && suite.items.length > 0 && (
                      <div className="space-y-2.5 mb-8">
                        {suite.items.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (suite.buttonAction && suite.buttonAction !== 'contact') {
                        executeAction(suite.buttonAction);
                      } else {
                        handleAction(suite.name);
                      }
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#004d6a] hover:bg-[#093c47] text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#004d6a]/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>{suite.buttonLabel || 'Inquire Broadcast Suite'}</span>
                    <ArrowUpRight className="w-4 h-4 text-cyan-300" />
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
