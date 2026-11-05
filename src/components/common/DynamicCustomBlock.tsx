'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Minus, ArrowRight, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { CustomSectionBlock } from '../../types/content';
import { DynamicIcon } from './DynamicIcon';
import { executeAction, ActionContext } from '../../utils/actionHandler';

interface DynamicCustomBlockProps extends ActionContext {
  block: CustomSectionBlock;
}

export const DynamicCustomBlock: React.FC<DynamicCustomBlockProps> = ({
  block,
  onNavigate,
  onStartProject,
  onOpenContact,
  onOpenContactWithSummary,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(() => {
    // Open the first FAQ item by default
    return block.faqItems && block.faqItems.length > 0 ? block.faqItems[0].id : null;
  });

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const actionContext: ActionContext = {
    onNavigate,
    onStartProject,
    onOpenContact,
    onOpenContactWithSummary,
  };

  const bgStyle = block.backgroundColor || 'white';
  const isDark = bgStyle === 'dark' || bgStyle === 'teal';

  // Section theme classes
  const themeClasses: Record<string, { section: string; heading: string; body: string; card: string; cardBorder: string }> = {
    white: {
      section: 'bg-white text-slate-900 border-t border-slate-100',
      heading: 'text-slate-950',
      body: 'text-slate-600',
      card: 'bg-white',
      cardBorder: 'border-slate-200/90',
    },
    slate: {
      section: 'bg-[#f8fafc] text-slate-900 border-t border-slate-200/80',
      heading: 'text-slate-950',
      body: 'text-slate-600',
      card: 'bg-white',
      cardBorder: 'border-slate-200/90',
    },
    dark: {
      section: 'bg-slate-950 text-white border-t border-slate-800',
      heading: 'text-white',
      body: 'text-slate-300',
      card: 'bg-slate-900',
      cardBorder: 'border-slate-800',
    },
    teal: {
      section: 'bg-[#0d5363] text-white border-t border-cyan-800/40 relative overflow-hidden',
      heading: 'text-white',
      body: 'text-slate-200',
      card: 'bg-white/10 backdrop-blur-md',
      cardBorder: 'border-white/15',
    },
  };

  const currentTheme = themeClasses[bgStyle] || themeClasses.white;

  // Render FAQ Block
  if (block.type === 'faq') {
    const items = block.faqItems || [];

    return (
      <section id={block.id} className={`py-20 lg:py-28 relative ${currentTheme.section}`}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="text-center mb-14 space-y-3">
            {block.eyebrow && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0d5363] dark:text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>{block.eyebrow}</span>
              </div>
            )}
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${currentTheme.heading}`}>
              {block.title}
            </h2>
            {block.description && (
              <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${currentTheme.body}`}>
                {block.description}
              </p>
            )}
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5">
            {items.map((item) => {
              const isOpen = openFaqId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    currentTheme.card
                  } ${currentTheme.cardBorder} ${
                    isOpen ? 'shadow-md ring-1 ring-cyan-500/30' : 'hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <span className={`text-base sm:text-lg font-serif font-bold ${currentTheme.heading}`}>
                      {item.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'bg-[#0d5363] text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Render Features Grid Block
  if (block.type === 'features') {
    const items = block.featureItems || [];

    return (
      <section id={block.id} className={`py-20 lg:py-28 relative ${currentTheme.section}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            {block.eyebrow && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0d5363] dark:text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>{block.eyebrow}</span>
              </div>
            )}
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${currentTheme.heading}`}>
              {block.title}
            </h2>
            {block.description && (
              <p className={`text-sm sm:text-base leading-relaxed ${currentTheme.body}`}>
                {block.description}
              </p>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((feat) => (
              <div
                key={feat.id}
                className={`p-7 rounded-3xl border ${currentTheme.card} ${currentTheme.cardBorder} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0d5363]/10 text-[#0d5363] dark:bg-cyan-400/20 dark:text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DynamicIcon name={feat.iconName || 'Sparkles'} className="w-6 h-6" />
                    </div>
                    {feat.badge && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-[#0d5363] dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                        {feat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-xl font-serif font-bold mb-3 ${currentTheme.heading}`}>
                    {feat.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${currentTheme.body}`}>
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render Stats Numbers Grid Block
  if (block.type === 'stats') {
    const items = block.statItems || [];

    return (
      <section id={block.id} className={`py-18 lg:py-24 relative ${currentTheme.section}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            {block.eyebrow && (
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0d5363] dark:text-cyan-400">
                {block.eyebrow}
              </div>
            )}
            <h2 className={`text-3xl sm:text-4xl font-serif font-bold ${currentTheme.heading}`}>
              {block.title}
            </h2>
            {block.description && (
              <p className={`text-sm ${currentTheme.body}`}>
                {block.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((stat) => (
              <div
                key={stat.id}
                className={`p-6 sm:p-8 rounded-3xl border text-center ${currentTheme.card} ${currentTheme.cardBorder} shadow-sm`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#0d5363] dark:text-cyan-300 tracking-tight">
                  {stat.value}
                </div>
                <div className={`text-sm sm:text-base font-bold mt-2 ${currentTheme.heading}`}>
                  {stat.label}
                </div>
                {stat.subtext && (
                  <div className={`text-xs mt-1 ${currentTheme.body}`}>
                    {stat.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render Promo Banner Block
  if (block.type === 'banner') {
    const data = block.bannerData || {};
    const primaryLabel = data.buttonLabel || 'Get Started';
    const primaryAction = data.buttonAction || 'start-project';
    const secondaryLabel = data.secondaryButtonLabel;
    const secondaryAction = data.secondaryButtonAction;

    return (
      <section
        id={block.id}
        className="py-20 lg:py-28 bg-[#0d5363] text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-900/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-6">
          {block.eyebrow && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              <span>{block.eyebrow}</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight">
            {block.title}
          </h2>
          {block.description && (
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              {block.description}
            </p>
          )}

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => executeAction(primaryAction, actionContext)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0d5363] hover:bg-slate-100 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all cursor-pointer"
            >
              <span>{primaryLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {secondaryLabel && (
              <button
                onClick={() => executeAction(secondaryAction, actionContext)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black/25 hover:bg-black/40 text-white font-semibold text-xs sm:text-sm tracking-wide border border-white/20 transition-all cursor-pointer"
              >
                <span>{secondaryLabel}</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Render Rich Text / Story Split Block
  if (block.type === 'rich-text') {
    const data = block.richTextData || {};
    const isImageLeft = data.imagePosition === 'left';

    return (
      <section id={block.id} className={`py-20 lg:py-28 relative ${currentTheme.section}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div className={`lg:col-span-6 space-y-6 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
              {block.eyebrow && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0d5363] dark:text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>{block.eyebrow}</span>
                </div>
              )}
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${currentTheme.heading}`}>
                {block.title}
              </h2>
              {data.paragraph1 && (
                <p className={`text-sm sm:text-base leading-relaxed ${currentTheme.body}`}>
                  {data.paragraph1}
                </p>
              )}
              {data.paragraph2 && (
                <p className={`text-sm sm:text-base leading-relaxed ${currentTheme.body}`}>
                  {data.paragraph2}
                </p>
              )}
              {data.ctaLabel && (
                <div className="pt-2">
                  <button
                    onClick={() => executeAction(data.ctaAction || 'contact', actionContext)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#004d61] hover:bg-[#093c47] text-white font-medium text-sm sm:text-base tracking-wide shadow-md shadow-[#004d61]/20 hover:shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <span>{data.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Image Column */}
            <div className={`lg:col-span-6 flex justify-center ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src={data.image || '/assets/about_nexordive_graphic.png'}
                  alt={block.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render Video / Media Showcase Block
  if (block.type === 'video') {
    const data = block.videoData || {};
    const videoUrl = data.videoUrl || '';

    // Extract YouTube embed if applicable
    const getEmbedUrl = (url: string) => {
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
      }
      return url;
    };

    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

    return (
      <section id={block.id} className={`py-20 lg:py-28 relative ${currentTheme.section}`}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8">
          <div className="space-y-3">
            {block.eyebrow && (
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0d5363] dark:text-cyan-400">
                {block.eyebrow}
              </div>
            )}
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold ${currentTheme.heading}`}>
              {block.title}
            </h2>
            {block.description && (
              <p className={`text-sm sm:text-base max-w-2xl mx-auto ${currentTheme.body}`}>
                {block.description}
              </p>
            )}
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xl">
            {isVideoPlaying && isYouTube ? (
              <iframe
                src={getEmbedUrl(videoUrl)}
                title={block.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVideoPlaying && !isYouTube && videoUrl ? (
              <video src={videoUrl} autoPlay controls className="w-full h-full object-cover" />
            ) : (
              <div
                onClick={() => setIsVideoPlaying(true)}
                className="relative w-full h-full cursor-pointer group flex items-center justify-center bg-slate-900"
              >
                {data.thumbnailImage && (
                  <img
                    src={data.thumbnailImage}
                    alt={block.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="w-20 h-20 rounded-full bg-white/90 text-[#0d5363] shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all z-10">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            )}
          </div>

          {data.caption && (
            <p className={`text-xs ${currentTheme.body}`}>
              {data.caption}
            </p>
          )}
        </div>
      </section>
    );
  }

  return null;
};
