'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Users2, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { executeAction } from '../utils/actionHandler';

interface AboutSectionProps {
  onNavigate?: (page: string) => void;
  onReadMore?: () => void;
  onStartProject?: () => void;
  onOpenContact?: () => void;
  onOpenContactWithSummary?: (summary: string) => void;
}

const WHY_WORK_PILLARS = [
  {
    title: 'Connected thinking',
    description: 'design, development and marketing aligned around your project.',
  },
  {
    title: 'Mobile-first execution',
    description: 'accessible experiences for people using phones, tablets and desktops.',
  },
  {
    title: 'Clear project scope',
    description: 'practical planning, milestones and communication.',
  },
  {
    title: 'Business-focused decisions',
    description: 'prioritize solutions that serve real users and measurable goals.',
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigate,
  onReadMore,
  onStartProject,
  onOpenContact,
  onOpenContactWithSummary,
}) => {
  const { content, settings } = useAdmin();
  const leaderName = content?.mission?.ceoBadgeName || settings?.leaderName || 'Akleem Orakzai';
  const leaderRole = content?.mission?.ceoBadgeTitle || settings?.leaderRole || 'CEO';
  const leaderImage = content?.mission?.ceoAvatar || settings?.leaderImage || '/assets/akleem_orakzai_avatar.png';

  const preheading = content?.mission?.preheading || 'Why NexorDive';
  const heading = content?.mission?.heading || 'Why work with Nexordive?';
  const description =
    content?.mission?.description ||
    'Nexordive provides web development, graphic design, digital marketing, AI automation, mobile app development, SaaS and Shopify services for startups and growing businesses.';
  const readMoreLabel = content?.mission?.readMoreLabel || 'Explore Our Story';
  const readMoreAction = content?.mission?.readMoreAction || 'about';

  const aboutGraphic = content?.mission?.missionImage || '/assets/about_nexordive_graphic.png';
  const aboutGraphicAlt =
    content?.mission?.missionImageAlt || 'About NexorDive - Digital Excellence & Passionate Engineering';
  const secondaryImage = content?.mission?.secondaryImage;
  const secondaryImageAlt = content?.mission?.secondaryImageAlt || 'Feature Graphic';

  const handleReadMore = () => {
    const action = readMoreAction || 'about';
    const navigateFn =
      onNavigate ||
      ((page: string) => {
        if (page === 'about' && onReadMore) {
          onReadMore();
        } else {
          window.location.hash = page === 'home' ? '' : `#${page}`;
        }
      });

    executeAction(action, {
      onNavigate: navigateFn,
      onStartProject,
      onOpenContact,
      onOpenContactWithSummary,
    });
  };

  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Small Pre-heading Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
              <span>{preheading}</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-[1.18] mb-5 text-balance">
              {heading}
            </h2>

            {/* Description Text */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-normal">
              {description}
            </p>

            {/* Four Why Work Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-6">
              {WHY_WORK_PILLARS.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0d5363] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-700 leading-snug">
                    <span className="font-semibold text-slate-900">{pillar.title}:</span>{' '}
                    <span className="text-slate-600">{pillar.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Who We Support Block */}
            <div className="w-full p-4 rounded-2xl bg-teal-50/60 border border-teal-100 mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0d5363] mb-1.5">
                <Users2 className="w-3.5 h-3.5 text-[#0d5363]" />
                <span>Who we support</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Startup founders validating ideas; small businesses establishing an online presence; e-commerce brands launching stores; and organizations exploring custom software or automation.
              </p>
            </div>

            {/* Read More Button */}
            <button
              onClick={handleReadMore}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-[#004d6a]/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#004d6a]"
            >
              <span>{readMoreLabel}</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Right Visual Graphic Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[520px]">
              <img
                src={aboutGraphic}
                alt={aboutGraphicAlt}
                className="w-full h-auto object-contain select-none drop-shadow-md"
                loading="lazy"
              />

              {/* Secondary Feature / Accent Graphic */}
              {secondaryImage && (
                <div className="absolute bottom-[10%] left-[1.5%] w-[25%] max-w-[145px] aspect-square rounded-2xl bg-[#004d6a] p-2 shadow-2xl overflow-hidden z-20 hover:scale-105 transition-transform flex items-center justify-center border border-white/20">
                  <img src={secondaryImage} alt={secondaryImageAlt} className="w-full h-full object-contain rounded-xl" />
                </div>
              )}

              {/* Dynamic CEO / Leadership Badge */}
              <div className="absolute bottom-[5%] right-[2%] sm:bottom-[7%] sm:right-[3%] inline-flex items-center gap-3 sm:gap-4 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl bg-[#004d6a] text-white shadow-2xl shadow-[#004d6a]/40 border border-cyan-400/30 max-w-[92%] z-10 backdrop-blur-md">
                <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full overflow-hidden bg-white/20 shrink-0 shadow-md ring-2 ring-cyan-400/30">
                  <img
                    src={leaderImage}
                    alt={leaderName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-left pr-1 min-w-0">
                  <div className="text-xs sm:text-sm md:text-base font-serif font-bold text-white tracking-wide uppercase truncate">
                    {leaderName}
                  </div>
                  <div className="text-[10px] sm:text-xs text-cyan-200/90 font-mono font-medium mt-0.5 leading-snug">
                    {leaderRole}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
