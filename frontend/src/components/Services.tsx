'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { DynamicIcon } from './common/DynamicIcon';
import {
  getHeadlineSizeClass,
  getHeadlineStyle,
  getParagraphSizeClass,
  getParagraphStyle,
} from '../utils/typography';

interface ServicesProps {
  limit?: number;
  layout?: 'horizontal' | 'split';
  onSelectService?: (serviceTitle: string) => void;
  onViewAllServices?: () => void;
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

// Rhythmic vertical stagger for the horizontal cards (kuch ooper neechy organic wave)
const STAGGER_OFFSETS = [
  'lg:mt-5',   // Card 1: slightly lowered (+20px)
  'lg:-mt-3',  // Card 2: elevated pillar (-12px)
  'lg:mt-7',   // Card 3: lower wave (+28px)
  'lg:mt-1',   // Card 4: balanced rise (+4px)
];

export const Services: React.FC<ServicesProps> = ({
  limit,
  layout = 'horizontal',
  onSelectService,
  onViewAllServices,
  searchFilter = '',
}) => {
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

  const handleViewAll = () => {
    if (onViewAllServices) {
      onViewAllServices();
    } else {
      handleAction('All Services Overview');
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

  const displayedCards = limit && limit > 0 ? visibleCards.slice(0, limit) : visibleCards;

  // Determine if we should use horizontal layout (heading top, cards in horizontal row, button bottom)
  const isHorizontal = layout === 'horizontal' || (limit !== undefined && limit <= 4 && layout !== 'split');

  const isLandingPreview = limit !== undefined && limit <= 4;

  if (isHorizontal) {
    return (
      <section id="services" className="py-20 sm:py-28 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
        {/* Background ambient lighting accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50/60 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          
          {/* Top: Eyebrow, Heading & Paragraph */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
            {/* Tag pill with white circle dot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
              <span>{servicesData?.sectionEyebrow || 'Services'}</span>
            </div>

            {/* Big Serif Heading */}
            <h2
              className={`font-bold font-serif text-slate-900 tracking-tight leading-[1.15] text-balance mb-4 ${getHeadlineSizeClass(servicesData?.titleSize, 'text-3xl sm:text-4xl lg:text-5xl')}`}
              style={getHeadlineStyle(servicesData?.titleSize)}
            >
              {servicesData?.sectionTitle || 'We Are Here To Provide Our Services'}
            </h2>

            {/* Description Paragraph */}
            <p
              className={`text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto ${getParagraphSizeClass(servicesData?.descriptionSize, 'text-sm sm:text-base')}`}
              style={getParagraphStyle(servicesData?.descriptionSize)}
            >
              {servicesData?.sectionDescription ||
                'NexorDive builds websites, software systems, digital marketing assets, AI automation, and premium streamer graphics for brands and creators who want to grow online.'}
            </p>
          </div>

          {/* Middle: Cards Grid (Horizontal wave on landing page preview, clean grid on full services page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 items-stretch mb-16 sm:mb-20">
            {displayedCards.map((card, idx) => {
              const serviceLink = getServiceUrl(card.title);
              const staggerClass = isLandingPreview ? STAGGER_OFFSETS[idx % STAGGER_OFFSETS.length] : '';

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => handleAction(card.title)}
                  className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-[#004d6a]/25 hover:-translate-y-2.5 ${staggerClass}`}
                >
                  {/* Hover dark teal gradient layer (smooth fade-in on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#004d6a] via-[#00455f] to-[#013549] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Subtle decorative glow orb on hover */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-400/25 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      {/* Top Row: Icon + Numbered Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-sm bg-[#0d5363]/10 border border-[#0d5363]/15 text-[#0d5363] group-hover:bg-white/10 group-hover:text-cyan-300 group-hover:border-white/20 group-hover:scale-110 group-hover:rotate-[-2deg] transition-all duration-300">
                          <DynamicIcon name={card.iconName} className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>

                        {/* Numbered Index Pill (glows cyan on hover) */}
                        <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-cyan-200 group-hover:bg-cyan-400/20 group-hover:border group-hover:border-cyan-400/40 px-2.5 py-0.5 rounded-full transition-all duration-300">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-serif font-bold mb-2.5 tracking-tight text-slate-900 group-hover:text-white transition-colors duration-300">
                        {card.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3 text-slate-600 group-hover:text-slate-200/90 transition-colors duration-300">
                        {card.description}
                      </p>

                      {/* Features list (top 3) */}
                      {card.features && card.features.length > 0 && (
                        <ul className="space-y-2 text-xs mb-6 text-slate-600 group-hover:text-slate-200/85 transition-colors duration-300">
                          {card.features.slice(0, 3).map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#0d5363] group-hover:bg-cyan-300 transition-colors duration-300" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Bottom Link */}
                    <div className="pt-3.5 border-t border-slate-100 group-hover:border-white/15 transition-colors duration-300">
                      <a
                        href={serviceLink.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAction(card.title);
                        }}
                        className="flex items-center justify-between text-xs font-bold uppercase tracking-wider group/link"
                        aria-label={serviceLink.anchorText}
                      >
                        <span className="text-[#0d5363] group-hover:text-cyan-300 transition-colors duration-300">
                          {serviceLink.anchorText.replace(/^Explore\s+/i, '')}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#0d5363] group-hover:text-cyan-300 group-hover/link:translate-x-1.5 transition-all duration-300" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom: Read More Button Centered under cards (Landing Page only) */}
          {onViewAllServices && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleViewAll}
                className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#004d6a]/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#004d6a]"
                aria-label="Read more services"
              >
                <span>{servicesData?.ctaText || 'Read More'}</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </section>
    );
  }

  // Split Staggered Layout (Used on full /services page catalog)
  const col1 = displayedCards.filter((_, idx) => idx % 2 === 0);
  const col2 = displayedCards.filter((_, idx) => idx % 2 !== 0);

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Staggered Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Column 1 */}
            <div className="space-y-6">
              {col1.map((card, idx) => {
                const serviceLink = getServiceUrl(card.title);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleAction(card.title)}
                    className="p-7 sm:p-8 rounded-3xl transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden bg-white border border-slate-200/90 shadow-md hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-[#004d6a]/25 hover:-translate-y-2"
                  >
                    {/* Hover dark teal gradient layer */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#004d6a] via-[#00455f] to-[#013549] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Decorative glow orb on hover */}
                    <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-400/25 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm bg-[#0d5363]/10 border border-[#0d5363]/15 text-[#0d5363] group-hover:bg-white/10 group-hover:text-cyan-300 group-hover:border-white/20 group-hover:scale-105 transition-all duration-300">
                          <DynamicIcon name={card.iconName} className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 text-slate-900 group-hover:text-white transition-colors duration-300">
                          {card.title}
                        </h3>

                        <p className="text-xs sm:text-sm mb-5 leading-relaxed text-slate-600 group-hover:text-slate-200/90 transition-colors duration-300">
                          {card.description}
                        </p>

                        {card.features && card.features.length > 0 && (
                          <ul className="space-y-2.5 text-xs sm:text-sm mb-6 text-slate-600 group-hover:text-slate-200/85 transition-colors duration-300">
                            {card.features.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[#0d5363] group-hover:bg-cyan-300 transition-colors duration-300" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <a
                        href={serviceLink.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAction(card.title);
                        }}
                        className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group/link text-[#0d5363] group-hover:text-cyan-300 transition-colors duration-300"
                        aria-label={serviceLink.anchorText}
                      >
                        <span>{serviceLink.anchorText}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#0d5363] group-hover:text-cyan-300 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Column 2 (Offset Vertically) */}
            <div className="space-y-6 sm:mt-12">
              {col2.map((card, idx) => {
                const serviceLink = getServiceUrl(card.title);
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx + 1) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleAction(card.title)}
                    className="p-7 sm:p-8 rounded-3xl transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden bg-white border border-slate-200/90 shadow-md hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-[#004d6a]/25 hover:-translate-y-2"
                  >
                    {/* Hover dark teal gradient layer */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#004d6a] via-[#00455f] to-[#013549] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Decorative glow orb on hover */}
                    <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-400/25 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm bg-[#0d5363]/10 border border-[#0d5363]/15 text-[#0d5363] group-hover:bg-white/10 group-hover:text-cyan-300 group-hover:border-white/20 group-hover:scale-105 transition-all duration-300">
                          <DynamicIcon name={card.iconName} className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 text-slate-900 group-hover:text-white transition-colors duration-300">
                          {card.title}
                        </h3>

                        <p className="text-xs sm:text-sm mb-5 leading-relaxed text-slate-600 group-hover:text-slate-200/90 transition-colors duration-300">
                          {card.description}
                        </p>

                        {card.features && card.features.length > 0 && (
                          <ul className="space-y-2.5 text-xs sm:text-sm mb-6 text-slate-600 group-hover:text-slate-200/85 transition-colors duration-300">
                            {card.features.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[#0d5363] group-hover:bg-cyan-300 transition-colors duration-300" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <a
                        href={serviceLink.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAction(card.title);
                        }}
                        className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group/link text-[#0d5363] group-hover:text-cyan-300 transition-colors duration-300"
                        aria-label={serviceLink.anchorText}
                      >
                        <span>{serviceLink.anchorText}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#0d5363] group-hover:text-cyan-300 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
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
            <h2
              className={`font-bold font-serif text-slate-900 tracking-tight leading-[1.15] text-balance ${getHeadlineSizeClass(servicesData?.titleSize, 'text-4xl sm:text-5xl lg:text-6xl')}`}
              style={getHeadlineStyle(servicesData?.titleSize)}
            >
              {servicesData?.sectionTitle || 'We Are Here To Provide Our Services'}
            </h2>

            {/* Paragraph */}
            <p
              className={`text-slate-600 leading-relaxed font-normal ${getParagraphSizeClass(servicesData?.descriptionSize, 'text-sm sm:text-base')}`}
              style={getParagraphStyle(servicesData?.descriptionSize)}
            >
              {servicesData?.sectionDescription ||
                'Whether you are launching a business, improving an online store or building a new software product, our services can be planned around your goals, audience and technical requirements.'}
            </p>

            {/* Read More Pill Button */}
            <div className="pt-4">
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewAll();
                }}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#004d6a] hover:bg-[#093c47] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#004d6a]/25 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#004d6a]"
                aria-label="Read more services"
              >
                <span>{servicesData?.ctaText || 'Read More'}</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
