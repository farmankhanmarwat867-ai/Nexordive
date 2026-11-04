'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { DynamicIcon } from './common/DynamicIcon';

interface ServicesProps {
  onSelectService?: (serviceTitle: string) => void;
  searchFilter?: string;
}

const getServiceUrl = (title: string): { href: string; anchorText: string } => {
  const t = title.toLowerCase();
  if (t.includes('web')) return { href: '/services/web-development', anchorText: 'Explore Web Development Services' };
  if (t.includes('graphic') || t.includes('brand') || t.includes('design')) return { href: '/services/graphic-design', anchorText: 'Explore Graphic Design & Branding' };
  if (t.includes('marketing') || t.includes('seo')) return { href: '/services/digital-marketing', anchorText: 'Explore Digital Marketing Services' };
  if (t.includes('ai') || t.includes('automation')) return { href: '/services/ai-automation', anchorText: 'Explore AI Automation Solutions' };
  if (t.includes('mobile') || t.includes('app')) return { href: '/services/mobile-app-development', anchorText: 'Explore Mobile App Development' };
  if (t.includes('saas') || t.includes('software')) return { href: '/services/saas-development', anchorText: 'Explore SaaS Development & MVPs' };
  if (t.includes('shopify') || t.includes('store') || t.includes('commerce')) return { href: '/services/shopify-development', anchorText: 'Explore Shopify Store Development' };
  return { href: '/services', anchorText: `Explore ${title}` };
};

export const Services: React.FC<ServicesProps> = ({ onSelectService, searchFilter = '' }) => {
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
  const query = searchFilter.trim().toLowerCase();
  const visibleCards = rawCards
    .filter((c) => c.visible !== false)
    .filter((c) => {
      if (!query) return true;
      return (
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.features && c.features.some((f: string) => f.toLowerCase().includes(query))) ||
        (c.techStack && c.techStack.some((t: string) => t.toLowerCase().includes(query)))
      );
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Distribute cards into 2 staggered columns like original design
  const col1 = visibleCards.filter((_, idx) => idx % 2 === 0);
  const col2 = visibleCards.filter((_, idx) => idx % 2 !== 0);

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Staggered Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Column 1 */}
            <div className="space-y-6">
              {col1.map((card, idx) => {
                const isHighlight = !!card.isTealHighlight;
                const serviceLink = getServiceUrl(card.title);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleAction(card.title)}
                    className={`p-7 sm:p-8 rounded-3xl transition-all duration-300 group cursor-pointer ${
                      isHighlight
                        ? 'bg-[#004d6a] text-white shadow-xl shadow-[#004d6a]/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#004d6a]/30 border border-cyan-400/30'
                        : 'bg-white border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0d5363]/40 hover:-translate-y-1.5'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform ${
                        isHighlight
                          ? 'bg-white/10 text-cyan-300 border border-white/20'
                          : 'bg-[#0d5363]/10 border border-[#0d5363]/15 text-[#0d5363]'
                      }`}
                    >
                      <DynamicIcon name={card.iconName} className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    <h3
                      className={`text-xl sm:text-2xl font-serif font-bold mb-3 ${
                        isHighlight ? 'text-white' : 'text-slate-900 group-hover:text-[#0d5363] transition-colors'
                      }`}
                    >
                      {card.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm mb-5 leading-relaxed ${
                        isHighlight ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {card.description}
                    </p>

                    {card.features && card.features.length > 0 && (
                      <ul
                        className={`space-y-2.5 text-xs sm:text-sm mb-6 ${
                          isHighlight ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {card.features.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                                isHighlight ? 'bg-cyan-300' : 'bg-[#0d5363]'
                              }`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <a
                      href={serviceLink.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAction(card.title);
                      }}
                      className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group/link"
                      aria-label={serviceLink.anchorText}
                    >
                      <span className={isHighlight ? 'text-cyan-300' : 'text-[#0d5363]'}>{serviceLink.anchorText}</span>
                      <ChevronRight className={`w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform ${
                        isHighlight ? 'text-cyan-300' : 'text-[#0d5363]'
                      }`} />
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Column 2 (Offset Vertically) */}
            <div className="space-y-6 sm:mt-12">
              {col2.map((card, idx) => {
                const isHighlight = !!card.isTealHighlight;
                const serviceLink = getServiceUrl(card.title);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx + 1) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleAction(card.title)}
                    className={`p-7 sm:p-8 rounded-3xl transition-all duration-300 group cursor-pointer ${
                      isHighlight
                        ? 'bg-[#004d6a] text-white shadow-xl shadow-[#004d6a]/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#004d6a]/30 border border-cyan-400/30'
                        : 'bg-white border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0d5363]/40 hover:-translate-y-1.5'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform ${
                        isHighlight
                          ? 'bg-white/10 text-cyan-300 border border-white/20'
                          : 'bg-[#0d5363]/10 border border-[#0d5363]/15 text-[#0d5363]'
                      }`}
                    >
                      <DynamicIcon name={card.iconName} className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    <h3
                      className={`text-xl sm:text-2xl font-serif font-bold mb-3 ${
                        isHighlight ? 'text-white' : 'text-slate-900 group-hover:text-[#0d5363] transition-colors'
                      }`}
                    >
                      {card.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm mb-5 leading-relaxed ${
                        isHighlight ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {card.description}
                    </p>

                    {card.features && card.features.length > 0 && (
                      <ul
                        className={`space-y-2.5 text-xs sm:text-sm mb-6 ${
                          isHighlight ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {card.features.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                                isHighlight ? 'bg-cyan-300' : 'bg-[#0d5363]'
                              }`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <a
                      href={serviceLink.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAction(card.title);
                      }}
                      className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group/link"
                      aria-label={serviceLink.anchorText}
                    >
                      <span className={isHighlight ? 'text-cyan-300' : 'text-[#0d5363]'}>{serviceLink.anchorText}</span>
                      <ChevronRight className={`w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform ${
                        isHighlight ? 'text-cyan-300' : 'text-[#0d5363]'
                      }`} />
                    </a>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Right Side: Sticky Section Header & Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Tag pill with white circle dot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
              <span>{servicesData?.sectionEyebrow || 'Services'}</span>
            </div>

            {/* Big Serif Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-slate-900 tracking-tight leading-[1.15] text-balance">
              {servicesData?.sectionTitle || 'One digital partner. Seven focused solutions.'}
            </h2>

            {/* Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {servicesData?.sectionDescription ||
                'Whether you are launching a business, improving an online store or building a new software product, our services can be planned around your goals, audience and technical requirements.'}
            </p>

            {/* Read More Pill Button */}
            <div className="pt-4">
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  handleAction('All Services Overview');
                }}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#004d6a]/25 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#004d6a]"
                aria-label="Explore all digital services"
              >
                <span>{servicesData?.ctaText || 'Explore Our Services'}</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
