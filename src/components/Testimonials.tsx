'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        'I had the pleasure of working with NexorDive on several projects, and their service quality is exceptional. Their web engineering and software application development are particularly noteworthy, producing highly functional and visually appealing products. Their digital marketing expertise has greatly improved our inbound pipeline.',
      author: 'Arsalan Khan',
      role: 'Founder, TechVentures',
      avatar: '/assets/khyber/avatar1.png',
    },
    {
      id: 2,
      quote:
        'Collaborating with NexorDive has been an excellent experience. Their speed and execution in custom web platforms and SaaS dashboard development are top-notch. The applications they design are both beautiful and highly scalable. Their technical strategies significantly accelerated our production releases.',
      author: 'Salman Khan',
      role: 'Head of Product, SaaSify',
      avatar: '/assets/khyber/avatar2.png',
    },
    {
      id: 3,
      quote:
        'Working with NexorDive has been a delightful experience. Their craft in custom streamer graphics, branding, and interactive digital interfaces is unparalleled. Everything they develop is not only attractive but also high-performing and conversion-centric.',
      author: 'Chris Bell',
      role: 'Creator & Founder, Nexus Media',
      avatar: '/assets/khyber/avatar3.png',
    },
  ];

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header matching video */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            What Our Client's Say About Us
          </h2>

          {/* 3-dots with indicator line divider */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            <span className="w-8 h-1 rounded-full bg-[#0d5363]" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Our clients are highly satisfied with NexorDive digital solutions. They commend our engineering professionalism, technical architecture, and tailored execution across web, software, and creator assets that accelerate business growth.
          </p>
        </div>

        {/* 3 Cards Grid with bottom protruding avatars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 items-stretch pt-4 pb-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative p-8 pb-14 rounded-2xl bg-white border border-slate-200/80 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all"
            >
              <div>
                {/* Large light cyan quote icon watermark at top */}
                <div className="text-cyan-200/60 font-serif text-6xl leading-none select-none mb-2">
                  &ldquo;&ldquo;
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {t.quote}
                </p>

                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              {/* Bottom Protruding Avatar */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm font-serif font-bold text-slate-900 mt-2 text-center whitespace-nowrap">
                  {t.author}
                </div>
                <div className="text-xs text-slate-500 text-center">
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
