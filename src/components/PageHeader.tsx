'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  badge: string;
  title: string;
  description: string;
  currentPage: string;
  onNavigateHome?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  description,
  currentPage,
  onNavigateHome,
}) => {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#0d5363] text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#093c47] rounded-full blur-2xl pointer-events-none" />

      {/* Dot matrix grid */}
      <div className="absolute bottom-4 right-6 sm:right-12 w-64 sm:w-80 h-28 sm:h-36 pattern-dots opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
              },
            },
          }}
          className="max-w-3xl space-y-4"
        >
          {/* Breadcrumb & Badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-200"
          >
            <button
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white">{currentPage}</span>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold tracking-wider text-cyan-200 uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{badge}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white leading-tight"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
