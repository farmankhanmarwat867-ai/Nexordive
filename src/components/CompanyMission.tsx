'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminStore';
import { MissionPillar } from '../types/content';

export const CompanyMission: React.FC = () => {
  const { content } = useAdmin();
  const mission = content?.mission || {
    ceoBadgeName: 'FARMAN ULLAH KHALIL',
    ceoBadgeTitle: 'Founder & Principal Architect',
    ceoAvatar: '/assets/khyber/avatar2.png',
    heading: 'Our Company Mission Is To Exceed Expectations',
    description:
      'At NexorDive, our goal is to surpass expectations. We are dedicated to delivering outstanding results across web applications, software systems, AI automation, and creator broadcast graphics, emphasizing technical precision and design craft.',
    pillars: [
      { id: 'p-1', number: '01', title: 'Web Development & Custom Software' },
      { id: 'p-2', number: '02', title: 'AI Automation & Digital Marketing' },
      { id: 'p-3', number: '03', title: 'Streamer Graphics & Branding Design' },
    ],
    missionImage: '/assets/khyber/mission_graphic.png',
    missionImageAlt: 'Team collaboration mission',
    metrics: [],
  };

  return (
    <section id="about" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Top CEO Floating Badge Header */}
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
                src={mission.ceoAvatar || '/assets/khyber/avatar2.png'}
                alt={mission.ceoBadgeName || 'Founder'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-serif font-bold tracking-wide uppercase">
                {mission.ceoBadgeName}
              </div>
              <div className="text-xs text-cyan-200/90 font-medium">
                {mission.ceoBadgeTitle}
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
              {mission.heading}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {mission.description}
            </p>

            {/* Numbered Service List */}
            {mission.pillars && mission.pillars.length > 0 && (
              <div className="space-y-5 pt-2">
                {mission.pillars.map((pillar: MissionPillar) => (
                  <div key={pillar.id} className="flex items-center gap-4 group">
                    <span className="text-2xl font-serif font-bold text-slate-800 tracking-wider">
                      {pillar.number}
                    </span>
                    <span className="text-base sm:text-lg font-serif font-semibold text-slate-800 group-hover:text-[#0d5363] transition-colors">
                      {pillar.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column: Visual Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-[540px]">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={mission.missionImage || '/assets/khyber/mission_graphic.png'}
                  alt={mission.missionImageAlt || 'Team collaboration mission'}
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
