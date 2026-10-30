'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Diamond,
  LineChart,
  Coins,
  Lightbulb,
  ArrowRight,
  Code2,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface ServicesProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const handleAction = (serviceTitle: string) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Staggered Cards Grid matching video */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Column 1 */}
            <div className="space-y-6">
              {/* Card 1: Web Development (White Card) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0d5363]/10 border border-[#0d5363]/20 flex items-center justify-center text-[#0d5363] mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  <Code2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">
                  Web Development
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>React & Next.js modern websites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Sub-second Core Web Vitals SLA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Responsive, accessible mobile-first UX</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Headless CMS & Edge API integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Full TypeScript & end-to-end testing</span>
                  </li>
                </ul>
              </motion.div>

              {/* Card 3: Mobile App Development (White Card) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0d5363] text-white flex items-center justify-center mb-6 shadow-md shadow-[#0d5363]/20 group-hover:scale-105 transition-transform">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">
                  Mobile App Development
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>iOS & Android UI and scalable apps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>React Native & Expo cross-platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Offline caching & real-time cloud sync</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>App Store & Google Play compliance</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Column 2 (Offset Vertically) */}
            <div className="space-y-6 sm:mt-10">
              {/* Card 2: Software Development (Deep Teal Card Highlight) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="p-8 rounded-2xl bg-[#0d5363] text-white shadow-xl shadow-[#0d5363]/25 hover:-translate-y-1 transition-all group border border-cyan-400/20"
              >
                <div className="w-16 h-16 rounded-2xl bg-white text-[#0d5363] flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                  <LineChart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">
                  Software Development
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-2 shrink-0" />
                    <span>Custom dashboards, CRM, & SaaS MVPs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-2 shrink-0" />
                    <span>Microservices & high-concurrency cloud APIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-2 shrink-0" />
                    <span>Database architecture, migrations & caching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-2 shrink-0" />
                    <span>Automated CI/CD pipelines & Docker</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-2 shrink-0" />
                    <span>100% IP & repository ownership</span>
                  </li>
                </ul>
              </motion.div>

              {/* Card 4: Digital Marketing & AI Automation (Soft Neutral Card) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0d5363] mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">
                  Digital Marketing & AI
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Technical SEO, inbound leads & social media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>AI Chatbots & automated workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Branding & creative design (logos, identity)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>Streamer Graphics (Twitch/Kick assets, emotes)</span>
                  </li>
                </ul>
              </motion.div>
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
              <span>Our Services</span>
            </div>

            {/* Big Serif Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-slate-900 tracking-tight leading-[1.15]">
              We Are Here To Provide Our Services
            </h2>

            {/* Paragraph matching NexorDive services */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              NexorDive builds websites, software systems, digital marketing assets, AI automation, and premium streamer graphics for brands and creators who want to grow online. Our multidisciplinary engineering squad delivers end-to-end digital excellence tailored to your <span className="text-[#0d5363] font-semibold underline decoration-cyan-400 underline-offset-4">brand</span>.
            </p>

            {/* Read More Pill Button in Deep Teal */}
            <div className="pt-4">
              <button
                onClick={() => handleAction('All Services Overview')}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0d5363] hover:bg-[#093c47] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#0d5363]/25 active:scale-95 transition-all cursor-pointer group"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
