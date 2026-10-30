'use client';

import React from 'react';
import { motion } from 'motion/react';

export const PartnersMarquee: React.FC = () => {
  return (
    <section className="py-16 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Banner with smooth rounded corners matching video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700/20"
        >
          <img
            src="/assets/khyber/partners_banner.png"
            alt="Client Partners (SRSP, Said Enterprise, Four Brothers, PMC, MedCare)"
            className="w-full h-auto object-cover select-none"
          />
        </motion.div>

      </div>
    </section>
  );
};
