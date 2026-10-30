'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp, Users, Award } from 'lucide-react';

export const CompanyMission: React.FC = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Top CEO Floating Badge Header as seen in video */}
        <div className="flex justify-end mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-[#0d5363] text-white shadow-xl shadow-[#0d5363]/20 border border-cyan-400/20"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-white/30 shrink-0">
              <img
                src="/assets/khyber/avatar2.png"
                alt="Wasi Ullah Khalil"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-serif font-bold tracking-wide uppercase">
                FARMAN ULLAH KHALIL
              </div>
              <div className="text-xs text-cyan-200/90 font-medium">
                Founder & Principal Architect
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Grid: Left Mission Text, Right Graphic with 3 Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, Paragraph, Numbered Services */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
              Our Company Mission Is To Exceed Expectations
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At NexorDive, our goal is to surpass expectations. We are dedicated to delivering outstanding results across web applications, software systems, AI automation, and creator broadcast graphics, emphasizing technical precision and design craft.
            </p>

            {/* Numbered Service List */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-4 group">
                <span className="text-2xl font-serif font-bold text-slate-800 tracking-wider">
                  01
                </span>
                <span className="text-base sm:text-lg font-serif font-semibold text-slate-800 group-hover:text-[#0d5363] transition-colors">
                  Web Development & Custom Software
                </span>
              </div>

              <div className="flex items-center gap-4 group">
                <span className="text-2xl font-serif font-bold text-slate-800 tracking-wider">
                  02
                </span>
                <span className="text-base sm:text-lg font-serif font-semibold text-slate-800 group-hover:text-[#0d5363] transition-colors">
                  AI Automation & Digital Marketing
                </span>
              </div>

              <div className="flex items-center gap-4 group">
                <span className="text-2xl font-serif font-bold text-slate-800 tracking-wider">
                  03
                </span>
                <span className="text-base sm:text-lg font-serif font-semibold text-slate-800 group-hover:text-[#0d5363] transition-colors">
                  Streamer Graphics & Branding Design
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Circular Team Collaboration Visual with Built-in Stat Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-[540px]">
              {/* Center Blob Image (Already includes the authentic stat badges) */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/khyber/mission_graphic.png"
                  alt="Team collaboration mission"
                  className="w-full h-auto object-cover select-none"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
