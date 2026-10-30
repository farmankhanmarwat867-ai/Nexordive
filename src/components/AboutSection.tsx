'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminStore';

interface AboutSectionProps {
  onReadMore?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onReadMore }) => {
  const { settings } = useAdmin();
  const leaderName = settings?.leaderName || 'Akleem Orakzai';
  const leaderRole = settings?.leaderRole || 'CEO';
  const leaderImage = settings?.leaderImage || '/assets/akleem_orakzai_avatar.png';

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    } else {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#services';
      }
    }
  };

  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Text Column - Matching User's Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            {/* Small Pre-heading Pill */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-5">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>About NexorDive</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-bold text-slate-900 tracking-tight leading-[1.18] mb-6">
              We love our work and do it passionately
            </h2>

            {/* Description Text tailored for NexorDive */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-normal">
              NexorDive designs and builds great software, high-performance web platforms, and modern digital experiences. Each project is created with passion, innovation, and dedicated craftsmanship by our engineering team. We work efficiently to keep development costs lean while delivering enterprise-grade quality. We also specialize in SEO, digital marketing, mobile app development, AI systems, and creator digital assets, helping businesses succeed smoothly.
            </p>

            {/* Read More Button */}
            <button
              onClick={handleReadMore}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#004d61] hover:bg-[#093c47] text-white font-medium text-sm sm:text-base tracking-wide shadow-md shadow-[#004d61]/20 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <span>Read More</span>
            </button>
          </motion.div>

          {/* Right Visual Graphic Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[580px]">
              <img
                src="/assets/about_nexordive_graphic.png"
                alt="About NexorDive - Digital Excellence & Passionate Engineering"
                className="w-full h-auto object-contain select-none"
              />

              {/* Dynamic CEO / Leadership Badge (Controlled from Admin Dashboard) */}
              <div className="absolute bottom-[5%] right-[2%] sm:bottom-[7%] sm:right-[3%] inline-flex items-center gap-3 sm:gap-4 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl bg-[#004d6a] text-white shadow-2xl shadow-[#004d6a]/40 border border-cyan-400/25 max-w-[92%] z-10">
                <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full overflow-hidden bg-white/20 border-2 border-white shrink-0 shadow-md">
                  <img
                    src={leaderImage}
                    alt={leaderName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left pr-1 min-w-0">
                  <div className="text-xs sm:text-sm md:text-base font-serif font-bold text-white tracking-wide uppercase truncate">
                    {leaderName}
                  </div>
                  <div className="text-[10px] sm:text-xs text-cyan-200/90 font-serif font-medium mt-0.5 leading-snug">
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
