'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminStore';

export const PartnersMarquee: React.FC = () => {
  const { content } = useAdmin();
  const partnersData = content?.partners;

  const bannerImage = partnersData?.bannerImage || '/assets/khyber/partners_banner.png';
  const bannerAlt =
    partnersData?.bannerAlt ||
    'Client Partners (SRSP, Said Enterprise, Four Brothers, PMC, MedCare)';

  return (
    <section className="py-16 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Banner with smooth rounded corners matching design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700/20"
        >
          <img
            src={bannerImage}
            alt={bannerAlt}
            className="w-full h-auto object-cover select-none"
          />
        </motion.div>

      </div>
    </section>
  );
};
