'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { TestimonialItem } from '../types/content';

// Distinct border accents matching the reference screenshot design
const CARD_COLOR_STYLES = [
  {
    border: 'border-2 border-rose-300 hover:border-rose-400',
    shadow: 'hover:shadow-rose-100/50',
  },
  {
    border: 'border-2 border-cyan-400 hover:border-cyan-500',
    shadow: 'hover:shadow-cyan-100/50',
  },
  {
    border: 'border-2 border-purple-400 hover:border-purple-500',
    shadow: 'hover:shadow-purple-100/50',
  },
  {
    border: 'border-2 border-amber-300 hover:border-amber-400',
    shadow: 'hover:shadow-amber-100/50',
  },
  {
    border: 'border-2 border-emerald-400 hover:border-emerald-500',
    shadow: 'hover:shadow-emerald-100/50',
  },
  {
    border: 'border-2 border-indigo-400 hover:border-indigo-500',
    shadow: 'hover:shadow-indigo-100/50',
  },
];

export const Testimonials: React.FC = () => {
  const { content } = useAdmin();
  const testData = content?.testimonials;

  const rawTestimonials = testData?.testimonials || [];
  const baseTestimonials = rawTestimonials
    .filter((t: TestimonialItem) => t.visible !== false)
    .sort((a: TestimonialItem, b: TestimonialItem) => (a.order ?? 0) - (b.order ?? 0));

  // If there are fewer than 4 testimonials, cycle them so carousel navigation and 4-dots operate smoothly
  const testimonials =
    baseTestimonials.length > 0 && baseTestimonials.length < 4
      ? [
          ...baseTestimonials,
          ...baseTestimonials.map((item, idx) => ({
            ...item,
            id: `${item.id}-loop-${idx}`,
          })),
        ]
      : baseTestimonials;

  // Responsive visible cards count
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute maximum scrollable index and pagination dots
  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const totalDots = maxIndex > 0 ? maxIndex + 1 : Math.min(testimonials.length, 4);
  const safeIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      handleNext();
      setTouchStart(null);
    } else if (diff < -50) {
      handlePrev();
      setTouchStart(null);
    }
  };

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#f8fafc] relative overflow-hidden">
      {/* Subtle background ambient blur spots */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-slate-900 tracking-tight">
            {testData?.sectionTitle || "Patient Testimonials"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {testData?.sectionDescription ||
              'Read authentic reviews from thousands of patients who booked their clinic visits through our platform.'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-6">
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous review"
            className="absolute -left-2 sm:-left-3 lg:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.25]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next review"
            className="absolute -right-2 sm:-right-3 lg:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.25]" />
          </button>

          {/* Cards Track with overflow hidden */}
          <div
            className="overflow-hidden py-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${safeIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonials.map((t: TestimonialItem, idx: number) => {
                const colorStyle = CARD_COLOR_STYLES[idx % CARD_COLOR_STYLES.length];
                const cleanQuote = t.quote ? t.quote.replace(/^["“](.*)["”]$/, '$1') : '';

                return (
                  <div
                    key={t.id}
                    className="shrink-0 px-3 sm:px-3.5"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div
                      className={`h-full bg-white rounded-3xl ${colorStyle.border} ${colorStyle.shadow} p-7 sm:p-8 shadow-sm flex flex-col justify-between transition-all duration-300 min-h-[300px]`}
                    >
                      {/* Top Row: 5 Stars on Left, Quote Marks on Right */}
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-1.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4.5 h-4.5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <div className="text-slate-300">
                            <Quote className="w-6 h-6 stroke-[1.75]" />
                          </div>
                        </div>

                        {/* Middle: Review Quote Text in italics */}
                        <p className="text-sm sm:text-[15px] text-slate-600 italic leading-relaxed font-normal">
                          &ldquo;{cleanQuote}&rdquo;
                        </p>
                      </div>

                      {/* Bottom Section: Divider + Author Profile */}
                      <div className="pt-5 mt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                            <img
                              src={t.avatar || '/assets/khyber/avatar1.png'}
                              alt={t.author}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  t.author
                                )}&background=0d5363&color=fff`;
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate leading-snug">
                              {t.author}
                            </h4>
                            <p className="text-xs text-slate-400 font-normal truncate mt-0.5 leading-normal">
                              {t.role || t.company || 'United States'}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalDots }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  dotIdx === safeIndex
                    ? 'w-7 bg-cyan-600'
                    : 'w-2 bg-cyan-200/70 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
