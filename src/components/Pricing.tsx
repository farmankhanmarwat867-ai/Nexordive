'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Sparkles, Shield } from 'lucide-react';

interface PricingProps {
  onSelectPackage?: (packageName: string, priceRange: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  // 4 modern pricing cards as requested
  const plans = [
    {
      id: 'starter-website',
      name: 'Starter Website',
      price: '$99 – $299',
      billing: 'One-time investment',
      badge: 'Launch Fast',
      popular: false,
      description: 'A clean, high-performance web presence designed to establish instant credibility and capture initial customer interest.',
      features: [
        'Responsive 1–3 Page Next.js / Tailwind Website',
        'Sub-second Core Web Vitals performance guarantee',
        'Mobile-first UX with animated contact / booking form',
        'Domain setup, SSL certificate & Cloudflare edge DNS',
        'Basic On-Page SEO meta tags & social share cards',
      ],
      turnaround: '3–5 Business Days',
      accentColor: '#4F46E5', // Indigo
    },
    {
      id: 'pro-digital-kit',
      name: 'Pro Digital Kit',
      price: '$300 – $699',
      billing: 'One-time investment',
      badge: 'Most Popular',
      popular: true,
      description: 'Comprehensive digital foundation with multi-page architecture, conversion copywriting, and programmatic growth funnels.',
      features: [
        'Full Multi-Page Web Platform (Up to 8 Pages)',
        'Bespoke Figma UI/UX Design System with Tokens',
        'Inbound Lead Capture & CRM Email Automation',
        'Technical SEO Architecture & Google Analytics 4',
        'High-converting landing page A/B testing setup',
      ],
      turnaround: '7–12 Business Days',
      accentColor: '#7C3AED', // Violet
    },
    {
      id: 'streamer-starter-pack',
      name: 'Streamer Starter Pack',
      price: '$49 – $129',
      billing: 'One-time investment',
      badge: 'Creators & Esports',
      popular: false,
      description: 'Streamlined broadcast overhaul for Twitch, Kick, and YouTube creators seeking sharp animated visuals and branded alerts.',
      features: [
        'Full Animated Stream Overlay Suite (Starting, BRB, End)',
        'Modular Webcam Border & Dynamic Audio Level HUD',
        'Custom 60fps Stinger Transition with Sound FX',
        'Twitch & Kick Chatbox CSS for OBS Studio / Streamlabs',
        'Sub Loyalty Badges (3 Tiers) & 5 Kinetic Emotes',
      ],
      turnaround: '3–6 Business Days',
      accentColor: '#DB2777', // Pink
    },
    {
      id: 'custom-software-mvp',
      name: 'Custom Software MVP',
      price: 'Custom Pricing',
      billing: 'Milestone-based sprints',
      badge: 'Enterprise & AI',
      popular: false,
      description: 'Full-stack SaaS application, custom autonomous AI agents, or cross-platform mobile apps built for scale and venture funding.',
      features: [
        'Custom Web & Mobile App (Next.js, React Native, Node)',
        'Autonomous AI Agent & LLM Workflow Integration',
        'Scalable Postgres / Supabase Database Architecture',
        'Stripe Billing, User Authentication & Role-Based Access',
        '100% IP Assignment & Bi-Weekly Deployable Sprints',
      ],
      turnaround: '4–10 Calendar Weeks',
      accentColor: '#059669', // Emerald
    },
  ];

  const handleDiscuss = (planName: string, price: string) => {
    if (onSelectPackage) {
      onSelectPackage(planName, price);
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="pricing" className="py-24 md:py-32 relative bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span>Transparent Investment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-display tracking-tight text-balance">
              Predictable packages, world-class execution.
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Transparent pricing without surprise hourly overages. Every package includes direct principal engineer access, strict milestones, and complete IP handover.
          </p>
        </div>

        {/* 4 Modern Pricing Cards Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                plan.popular
                  ? 'border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-indigo-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Highlight ribbon for popular card */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{plan.badge}</span>
                  </div>
                </div>
              )}

              {/* Top Card Content */}
              <div>
                {!plan.popular && (
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-4">
                    {plan.badge}
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-950 font-display mb-1 group-hover:text-indigo-600 transition-colors">
                  {plan.name}
                </h3>

                {/* Price Display */}
                <div className="mt-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display tabular-nums tracking-tight">
                    {plan.price}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {plan.billing}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* 4-5 Features */}
                <div className="space-y-3 mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    What's Included:
                  </span>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer: Turnaround & CTA Button */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4 font-mono">
                  <span>Turnaround:</span>
                  <span className="text-slate-900 font-semibold">{plan.turnaround}</span>
                </div>

                <button
                  onClick={() => handleDiscuss(plan.name, plan.price)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 active:scale-98'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 active:scale-98'
                  }`}
                >
                  <span>Discuss Package</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>
              All packages include a mutual non-disclosure agreement (NDA), clean source code repository handover, and post-launch bug warranty.
            </span>
          </div>
          <button
            onClick={() => handleDiscuss('Custom Scope / Tailored Plan', 'Custom')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Need Custom Scope?</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
