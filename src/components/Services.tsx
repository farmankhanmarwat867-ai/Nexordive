'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { DynamicIcon } from './common/DynamicIcon';

interface ServicesProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const { content } = useAdmin();
  const servicesData = content?.services;

  const handleAction = (serviceTitle: string) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contact';
      }
    }
  };

  const rawCards = servicesData?.cards || [];
  const visibleCards = rawCards
    .filter((c) => c.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Distribute cards into 2 staggered columns like original design
  const col1 = visibleCards.filter((_, idx) => idx % 2 === 0);
  const col2 = visibleCards.filter((_, idx) => idx % 2 !== 0);

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Staggered Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Column 1 */}
            <div className="space-y-6">
              {col1.map((card, idx) => {
                const isHighlight = !!card.isTealHighlight;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.15 }}
                    className={`p-8 rounded-2xl transition-all group ${
                      isHighlight
                        ? 'bg-[#0d5363] text-white shadow-xl shadow-[#0d5363]/25 hover:-translate-y-1 border border-cyan-400/20'
                        : 'bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform ${
                        isHighlight
                          ? 'bg-white text-[#0d5363] shadow-md'
                          : 'bg-[#0d5363]/10 border border-[#0d5363]/20 text-[#0d5363]'
                      }`}
                    >
                      <DynamicIcon name={card.iconName} className="w-8 h-8" />
                    </div>

                    <h3
                      className={`text-xl font-serif font-bold mb-4 ${
                        isHighlight ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {card.title}
                    </h3>

                    <p
                      className={`text-xs mb-4 leading-relaxed ${
                        isHighlight ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {card.description}
                    </p>

                    {card.features && card.features.length > 0 && (
                      <ul
                        className={`space-y-2 text-xs sm:text-sm ${
                          isHighlight ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {card.features.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                                isHighlight ? 'bg-cyan-300' : 'bg-slate-400'
                              }`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Column 2 (Offset Vertically) */}
            <div className="space-y-6 sm:mt-10">
              {col2.map((card, idx) => {
                const isHighlight = !!card.isTealHighlight;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: (idx + 1) * 0.15 }}
                    className={`p-8 rounded-2xl transition-all group ${
                      isHighlight
                        ? 'bg-[#0d5363] text-white shadow-xl shadow-[#0d5363]/25 hover:-translate-y-1 border border-cyan-400/20'
                        : 'bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform ${
                        isHighlight
                          ? 'bg-white text-[#0d5363] shadow-md'
                          : 'bg-[#0d5363]/10 border border-[#0d5363]/20 text-[#0d5363]'
                      }`}
                    >
                      <DynamicIcon name={card.iconName} className="w-8 h-8" />
                    </div>

                    <h3
                      className={`text-xl font-serif font-bold mb-4 ${
                        isHighlight ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {card.title}
                    </h3>

                    <p
                      className={`text-xs mb-4 leading-relaxed ${
                        isHighlight ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {card.description}
                    </p>

                    {card.features && card.features.length > 0 && (
                      <ul
                        className={`space-y-2 text-xs sm:text-sm ${
                          isHighlight ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {card.features.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                                isHighlight ? 'bg-cyan-300' : 'bg-slate-400'
                              }`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Right Side: Sticky Section Header & Description */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Tag pill with white circle dot */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d5363]" />
              <span>{servicesData?.sectionEyebrow || 'Our Services'}</span>
            </div>

            {/* Big Serif Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-slate-900 tracking-tight leading-[1.15]">
              {servicesData?.sectionTitle || 'We Are Here To Provide Our Services'}
            </h2>

            {/* Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {servicesData?.sectionDescription ||
                'NexorDive builds websites, software systems, digital marketing assets, AI automation, and premium streamer graphics for brands and creators who want to grow online.'}
            </p>

            {/* Read More Pill Button */}
            <div className="pt-4">
              <button
                onClick={() => handleAction('All Services Overview')}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0d5363] hover:bg-[#093c47] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#0d5363]/25 active:scale-95 transition-all cursor-pointer group"
              >
                <span>{servicesData?.ctaText || 'Read More'}</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
