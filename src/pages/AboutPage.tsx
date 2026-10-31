'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminStore';
import { DEFAULT_ABOUT_PAGE_CONTENT } from '../data/defaultContent';
import { executeAction } from '../utils/actionHandler';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { PhoneCall, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome?: () => void;
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
  const { content } = useAdmin();
  const aboutPage = content?.aboutPage;

  const intro = aboutPage?.intro || DEFAULT_ABOUT_PAGE_CONTENT.intro;
  const consultation = aboutPage?.consultation || DEFAULT_ABOUT_PAGE_CONTENT.consultation;
  const teamSection = aboutPage?.teamSection || DEFAULT_ABOUT_PAGE_CONTENT.teamSection;
  const rawMembers = aboutPage?.teamMembers || DEFAULT_ABOUT_PAGE_CONTENT.teamMembers;
  const teamMembers = [...rawMembers]
    .filter((m) => m.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const rawPillars = aboutPage?.corePillars || DEFAULT_ABOUT_PAGE_CONTENT.corePillars;
  const corePillars = [...rawPillars]
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const visibility = aboutPage?.sectionsVisibility || DEFAULT_ABOUT_PAGE_CONTENT.sectionsVisibility;

  const actionContext = {
    onNavigate,
    onStartProject,
    onOpenContact,
    onOpenContactWithSummary,
  };

  const handleIntroAction = () => {
    executeAction(intro.buttonAction || 'start-project', actionContext);
  };

  const handleConsultationAction = () => {
    executeAction(consultation.buttonAction || 'start-project', actionContext);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Section 1: Choose NexorDive (Intro Section) */}
      {visibility.intro !== false && (
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
                  <span>{intro.eyebrow}</span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
                  {intro.heading}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {intro.paragraph1}
                </p>

                {intro.paragraph2 && (
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {intro.paragraph2}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleIntroAction}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#004d6a] hover:bg-[#093c47] text-white font-medium text-sm sm:text-base tracking-wide shadow-lg shadow-[#004d6a]/20 hover:shadow-xl transition-all cursor-pointer active:scale-95 group"
                  >
                    <PhoneCall className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
                    <span>{intro.buttonLabel || 'Book a Call'}</span>
                  </button>
                </div>
              </motion.div>

              {/* Right Tech Tree Circuit Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
                className="lg:col-span-6 relative flex justify-center lg:justify-end items-center"
              >
                <div className="relative w-full max-w-[540px] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl shadow-slate-300/60 border border-slate-100 animate-float-slow">
                  <img
                    src={intro.techTreeImage || '/assets/about/tech_tree_card.png'}
                    alt={intro.techTreeImageAlt || 'NexorDive Full-Spectrum Technology Tree'}
                    className="w-full h-auto object-contain select-none rounded-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Start Project With Us ? (Interactive Consultation Banner) */}
      {visibility.consultation !== false && (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-slate-900">
          {/* Full-width Laptop Background */}
          <div className="absolute inset-0 z-0">
            <img
              src={consultation.backgroundImage || '/assets/about/laptop_consultation_bg.jpg'}
              alt={consultation.backgroundImageAlt || 'NexorDive Project Consultation & Software Engineering'}
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
                {consultation.heading}
              </h2>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {consultation.description}
              </p>

              <div className="pt-2">
                <button
                  onClick={handleConsultationAction}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold uppercase tracking-wider text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95"
                >
                  <span>{consultation.buttonLabel || 'Free Consultation'}</span>
                  <ArrowRight className="w-4 h-4 text-[#004d6a]" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Section 3: Meet Our Expert Team */}
      {visibility.team !== false && teamMembers.length > 0 && (
        <section id="team" className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
              <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
                <span>{teamSection.eyebrow}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                {teamSection.title}
              </h2>
              {teamSection.description && (
                <p className="text-sm sm:text-base text-slate-600 font-normal">
                  {teamSection.description}
                </p>
              )}
            </div>

            {/* Team Grid */}
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
                      alt={member.imageAlt || member.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Centered Hover Overlay Card */}
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
                          href={member.linkedin || 'https://linkedin.com'}
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
                          className="flex-1 py-1.5 px-3 rounded-lg bg-white/15 hover:bg-white text-white hover:text-[#004d6a] text-xs font-semibold tracking-wide transition-all text-center cursor-pointer"
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
      )}

      {/* Section 4: NexorDive Core Pillars Banner */}
      {visibility.pillars !== false && corePillars.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {corePillars.map((pillar) => (
                <div key={pillar.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#004d6a] flex items-center justify-center">
                    <DynamicIcon name={pillar.iconName} className="w-5 h-5 text-[#004d6a]" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-slate-900">{pillar.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
