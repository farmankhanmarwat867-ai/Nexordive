'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { FaqItem } from '../types/content';

export const DEFAULT_HOME_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What services does Nexordive provide?',
    answer:
      'Nexordive offers web development, graphic design, digital marketing, AI automation, mobile app development, SaaS development and Shopify services.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'Can Nexordive help with a new startup idea?',
    answer:
      'Yes. We assist founders with scoping, wireframing, brand identity, landing pages and initial product builds (MVPs) designed to test ideas with real users.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'Do you work with clients internationally?',
    answer:
      'Yes. We collaborate remotely with clients across different regions using structured communication, scheduled check-ins and shared milestones.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'Can I request a single service rather than a full package?',
    answer:
      'Yes. You can work with us for a specific need—such as a single website, Shopify setup, brand redesign or automation workflow—without committing to an ongoing retainer.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'How do I request a quote or project timeline?',
    answer:
      'Use our project discussion form to share a brief summary of what you want to achieve. We will follow up to clarify details and provide an estimated scope.',
    order: 5,
  },
];

interface HomeFAQProps {
  onOpenContact?: () => void;
}

export const HomeFAQ: React.FC<HomeFAQProps> = ({ onOpenContact }) => {
  const { content } = useAdmin();
  const faqData = content?.faq;
  const rawItems = faqData?.items && faqData.items.length > 0 ? faqData.items : DEFAULT_HOME_FAQS;
  const items = [...rawItems]
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Default to first item expanded
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#f8fafc] border-t border-slate-200/80 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0d5363] shadow-xs mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#0d5363]" />
            <span>{faqData?.sectionEyebrow || 'Frequently Asked Questions'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight mb-4">
            {faqData?.sectionTitle || 'Home FAQ'}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            {faqData?.sectionDescription ||
              'Clear answers about our seven core services, startup collaboration, remote process, and project scoping.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {items.map((item, idx) => {
            const isOpen = openId === item.id;
            const headingId = `faq-heading-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#0d5363]/40 shadow-md shadow-[#004d6a]/5'
                    : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004d6a] focus-visible:ring-inset transition-colors"
                >
                  <span className="text-base sm:text-lg font-serif font-bold text-slate-900 pr-2">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen ? 'bg-[#004d6a] text-white rotate-180' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Helper Callout */}
        <div className="mt-10 sm:mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
          <span>Have a specific question about your project?</span>
          {onOpenContact && (
            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0d5363] hover:text-[#093c47] underline underline-offset-4 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask our team directly</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
