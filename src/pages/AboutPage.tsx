'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminStore';
import {
  PhoneCall,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Zap,
  Globe2,
  Users2,
  ExternalLink,
} from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigate?: (page: string) => void;
  onOpenContact?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
  onStartProject?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigate,
  onOpenContact,
  onOpenContactWithSummary,
  onStartProject,
}) => {
  const { settings } = useAdmin();
  const leaderName = settings?.leaderName || 'Akleem Orakzai';
  const leaderRole = settings?.leaderRole || 'CEO';
  const leaderImage = settings?.leaderImage || '/assets/akleem_orakzai.png';

  const handleBookCall = () => {
    if (onStartProject) {
      onStartProject();
    } else if (onOpenContact) {
      onOpenContact();
    } else {
      window.location.hash = '#contact';
    }
  };

  const handleFreeConsultation = () => {
    if (onStartProject) {
      onStartProject();
    } else if (onNavigate) {
      onNavigate('contact');
    } else {
      window.location.hash = '#contact';
    }
  };

  const teamMembers = [
    {
      id: 'ceo',
      name: leaderName,
      role: leaderRole,
      image: leaderImage,
      bio: 'Visionary leadership driving technical rigor, strategic client partnerships, and company growth.',
      linkedin: 'https://linkedin.com',
      isLeader: true,
    },
    {
      id: 'farman',
      name: 'Farman Ullah',
      role: 'Principal Solutions Architect',
      image: '/assets/about/team/member_1_architect.jpg',
      bio: 'Distributed cloud systems, microservices architectures, and enterprise database scaling.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'hamza',
      name: 'Hamza Khan',
      role: 'Lead Full-Stack Engineer',
      image: '/assets/about/team/member_3_lead_dev.jpg',
      bio: 'Next.js 15+, real-time WebSockets, high-concurrency Node.js & Go API platforms.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'younas',
      name: 'Younas Ali',
      role: 'Senior Flutter & Mobile Developer',
      image: '/assets/about/team/member_5_flutter.jpg',
      bio: 'Native performance iOS & Android cross-platform ecosystems with fluid UI motion.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'zaryab',
      name: 'Zaryab Khan',
      role: 'Applied AI & ML Systems Engineer',
      image: '/assets/about/team/member_6_ai.jpg',
      bio: 'Autonomous multi-agent routing, RAG vector pipelines, and custom LLM integrations.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'shahafahad',
      name: 'Shahafahad',
      role: 'Local SEO & Growth Marketing',
      image: '/assets/about/team/member_8_seo.jpg',
      bio: 'Organic search domination, conversion funnels, and data-backed digital acquisition.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'bilal',
      name: 'Bilal Ahmed',
      role: 'UI/UX & Motion Interaction Designer',
      image: '/assets/about/team/member_4_fullstack.jpg',
      bio: 'Tokenized Figma design systems, micro-interactions, and high-fidelity user journeys.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'asad',
      name: 'Asad Malik',
      role: 'Cloud & DevOps Infrastructure Lead',
      image: '/assets/about/team/member_7_uiux.jpg',
      bio: 'Automated CI/CD pipelines, Docker containerization, Kubernetes, and AWS edge security.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'tariq',
      name: 'Tariq Mehmood',
      role: 'Senior Backend & Systems Engineer',
      image: '/assets/about/team/member_9_devops.jpg',
      bio: 'PostgreSQL optimization, Redis caching, event streaming, and API gateway design.',
      linkedin: 'https://linkedin.com',
    },
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Section 1: Choose NexorDive (Intro Section matching video) */}
      <section id="choose-nexordive" className="pt-28 pb-20 lg:pt-36 lg:pb-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-6 flex flex-col items-start text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0d5363]">
                <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
                <span>Our Digital Agency</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
                Choose NexorDive
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <strong className="text-slate-900 font-semibold">NexorDive</strong> is a leading software engineering studio and digital product house dedicated to delivering innovative, enterprise-grade technology solutions. Specializing in custom software development, web and mobile application engineering, AI automation, and strategic IT consulting, we focus on delivering tangible results that drive sustained business success.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                With a team of experienced professionals, NexorDive blends creative craft, technical mastery, and a customer-centric approach to deliver tailored solutions that meet the unique needs of each client. Whether you're an ambitious startup or a global enterprise, we empower your business through cutting-edge software and seamless user experiences.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleBookCall}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#004d6a] hover:bg-[#093c47] text-white font-medium text-sm sm:text-base tracking-wide shadow-lg shadow-[#004d6a]/20 hover:shadow-xl transition-all cursor-pointer active:scale-95 group"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
                  <span>Book a Call</span>
                </button>
              </div>
            </motion.div>

            {/* Right Tech Tree Circuit Card matching video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
              className="lg:col-span-6 relative flex justify-center lg:justify-end items-center"
            >
              <div className="relative w-full max-w-[540px] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl shadow-slate-300/60 border border-slate-100 animate-float-slow">
                <img
                  src="/assets/about/tech_tree_card.png"
                  alt="NexorDive Full-Spectrum Technology Tree"
                  className="w-full h-auto object-contain select-none rounded-2xl"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Section 2: Start Project With Us ? (Interactive Consultation Banner matching video) */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-slate-900">
        {/* Full-width Laptop Background from video */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/about/laptop_consultation_bg.jpg"
            alt="NexorDive Project Consultation & Software Engineering"
            className="w-full h-full object-cover object-center brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="max-w-xl rounded-3xl bg-[#004d6a]/95 backdrop-blur-xl p-8 sm:p-12 text-white shadow-2xl border border-cyan-400/25 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.18]">
              Start Project With Us ?
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              At <strong className="text-white font-semibold">NexorDive</strong>, we bring your ideas to life with precision and innovation. Our team of skilled professionals is dedicated to turning your vision into a powerful digital reality. With our motto, <em className="text-cyan-200 not-italic font-medium">"We code your digital vision,"</em> we work hand-in-hand with you to ensure every project is a seamless blend of creativity, technology, and strategy. Whether you're building from the ground up or enhancing your digital presence, let's create something extraordinary together!
            </p>

            <div className="pt-2">
              <button
                onClick={handleFreeConsultation}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold uppercase tracking-wider text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95"
              >
                <span>Free Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#004d6a]" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Section 3: Meet Our Expert Team (Exact Card Layout & Hover Animation from video!) */}
      <section id="team" className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          {/* Section Header matching video */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
            <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
              <span>Our Team</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Meet Our Expert Team
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Meet the software architects, mobile engineers, AI specialists, and designers building the next generation of digital products at NexorDive.
            </p>
          </div>

          {/* Team Grid matching video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative rounded-3xl overflow-hidden bg-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Centered Hover Overlay Card - Exact replication of video animation! */}
                  <div className="absolute inset-5 sm:inset-7 rounded-2xl bg-[#004d6a]/95 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between text-white shadow-2xl border border-cyan-400/25 opacity-0 scale-90 translate-y-3 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-cyan-200/95 font-serif font-medium mt-1">
                        {member.role}
                      </p>
                      <p className="text-xs text-slate-200/85 leading-relaxed mt-3.5">
                        {member.bio}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${member.name} LinkedIn Profile`}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white text-cyan-200 hover:text-[#004d6a] border border-white/20 flex items-center justify-center font-bold text-xs transition-colors shadow-sm"
                      >
                        <span className="font-serif font-bold lowercase">in</span>
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenContactWithSummary(`Inquiring about collaborating with ${member.name} (${member.role})`);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white/15 hover:bg-white text-white hover:text-[#004d6a] text-xs font-semibold tracking-wide transition-all text-center"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Section 4: NexorDive Core Pillars Banner */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#004d6a] flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-slate-900">100% IP & Clean Code</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full intellectual property assignment and sanitized Git repository handover upon completion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#004d6a] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-slate-900">Sub-second Speed</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Engineered for maximum Core Web Vitals, sub-second load times, and fluid 60fps animations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#004d6a] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-slate-900">Autonomous AI Systems</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tailored LLM agent workflows, customer routing automations, and intelligent data pipelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#004d6a] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-slate-900">Post-Launch Warranty</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive 30 to 90-day post-launch bug fixing and dedicated technical support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
