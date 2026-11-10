'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  HelpCircle,
  Zap,
  TrendingUp,
  FileText,
  Video,
  Check,
} from 'lucide-react';
import { CustomBlockType, CustomSectionBlock } from '../../../types/content';

interface CustomBlockBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newBlock: CustomSectionBlock) => void;
  existingCount: number;
}

interface BlockTypeOption {
  type: CustomBlockType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const BLOCK_TYPES: BlockTypeOption[] = [
  {
    type: 'faq',
    title: 'FAQ Accordion',
    description: 'Collapsible list of questions and detailed answers with smooth animations.',
    icon: HelpCircle,
    accentColor: '#0d5363',
  },
  {
    type: 'features',
    title: 'Feature Cards Grid',
    description: 'Multi-column grid showcasing capabilities, perks, or guarantees with icons.',
    icon: Sparkles,
    accentColor: '#4f46e5',
  },
  {
    type: 'banner',
    title: 'Promo / CTA Banner',
    description: 'High-impact conversion banner with background styling and call-to-action buttons.',
    icon: Zap,
    accentColor: '#0284c7',
  },
  {
    type: 'stats',
    title: 'Key Stats & Numbers',
    description: 'Bold achievement counters, metrics, and quantitative milestones.',
    icon: TrendingUp,
    accentColor: '#059669',
  },
  {
    type: 'rich-text',
    title: 'Story / Editorial Split',
    description: 'Two-column editorial narrative with deep text paragraphs and a featured graphic.',
    icon: FileText,
    accentColor: '#d97706',
  },
  {
    type: 'video',
    title: 'Video / Media Showcase',
    description: 'Full-width responsive video player supporting YouTube, Vimeo, or MP4 files.',
    icon: Video,
    accentColor: '#dc2626',
  },
];

export const CustomBlockBuilderModal: React.FC<CustomBlockBuilderModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  existingCount,
}) => {
  const [selectedType, setSelectedType] = useState<CustomBlockType>('faq');
  const [title, setTitle] = useState('');
  const [eyebrow, setEyebrow] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'slate' | 'dark' | 'teal'>('white');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectType = (t: CustomBlockType) => {
    setSelectedType(t);
    setError(null);
    // Suggest intelligent defaults based on chosen type
    if (!title) {
      if (t === 'faq') {
        setTitle('Frequently Asked Questions');
        setEyebrow('ANSWERS & CLARITY');
        setDescription('Everything you need to know about our workflow, technology, and engineering standards.');
      } else if (t === 'features') {
        setTitle('Engineered for Growth');
        setEyebrow('CAPABILITIES');
        setDescription('Core architectural and creative advantages built into every delivery.');
      } else if (t === 'banner') {
        setTitle('Ready to Launch Your Next Big Milestone?');
        setEyebrow('GET STARTED');
        setDescription('Connect with our principal squad today for a guaranteed 24-hour scoping turnaround.');
      } else if (t === 'stats') {
        setTitle('Proven Impact by the Numbers');
        setEyebrow('METRICS & SCALE');
        setDescription('Measurable engineering velocity across enterprise systems and creator productions.');
      } else if (t === 'rich-text') {
        setTitle('Our Architectural Philosophy');
        setEyebrow('THE CRAFT');
        setDescription('We design resilient digital infrastructure that stands up to rapid scale.');
      } else if (t === 'video') {
        setTitle('Watch NexorDive in Action');
        setEyebrow('SHOWCASE REEL');
        setDescription('Explore our end-to-end design, development, and animation process.');
      }
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim();
    if (!finalTitle) {
      setError('Please provide a title for your custom section.');
      return;
    }

    const blockId = `custom-${selectedType}-${Date.now()}`;
    const newBlock: CustomSectionBlock = {
      id: blockId,
      type: selectedType,
      title: finalTitle,
      eyebrow: eyebrow.trim() || undefined,
      description: description.trim() || undefined,
      visible: true,
      order: existingCount + 8,
      backgroundColor,
    };

    // Populate type-specific initial template payloads
    if (selectedType === 'faq') {
      newBlock.faqItems = [
        {
          id: `faq-${Date.now()}-1`,
          question: 'What is your typical kickoff turnaround time?',
          answer: 'We initiate discovery within 48 hours and deliver first sprint milestones within two weeks.',
        },
        {
          id: `faq-${Date.now()}-2`,
          question: 'Do you offer ongoing support after deployment?',
          answer: 'Yes, every release comes with 30-90 days warranty and flexible retainer maintenance.',
        },
        {
          id: `faq-${Date.now()}-3`,
          question: 'Who retains the intellectual property rights?',
          answer: 'You retain 100% full intellectual property and code repository ownership upon sign-off.',
        },
      ];
    } else if (selectedType === 'features') {
      newBlock.featureItems = [
        {
          id: `feat-${Date.now()}-1`,
          title: 'High-Velocity Sprints',
          description: 'Disciplined fortnightly sprints with continuous staging access and test automation.',
          iconName: 'Zap',
          badge: 'Agile',
        },
        {
          id: `feat-${Date.now()}-2`,
          title: 'Enterprise Architecture',
          description: 'Zero-latency edge rendering, rock-solid TypeScript, and distributed database models.',
          iconName: 'Code2',
          badge: 'Robust',
        },
        {
          id: `feat-${Date.now()}-3`,
          title: 'Creator Broadcast Engine',
          description: 'Turnkey 60fps WebM stinger graphics, custom chat widgets, and high-voltage overlays.',
          iconName: 'Radio',
          badge: 'Creators',
        },
      ];
    } else if (selectedType === 'stats') {
      newBlock.statItems = [
        { id: `stat-${Date.now()}-1`, value: '99.9%', label: 'Production Uptime', subtext: 'Global edge network' },
        { id: `stat-${Date.now()}-2`, value: '45+', label: 'Shipped Systems', subtext: 'Across 12 industries' },
        { id: `stat-${Date.now()}-3`, value: '<200ms', label: 'Average TTFB', subtext: 'Lighthouse 99 benchmark' },
        { id: `stat-${Date.now()}-4`, value: '24/7', label: 'Client Collaboration', subtext: 'Direct Slack channel' },
      ];
    } else if (selectedType === 'banner') {
      newBlock.bannerData = {
        buttonLabel: 'Start a Project',
        buttonAction: 'start-project',
        secondaryButtonLabel: 'Explore Services',
        secondaryButtonAction: 'services',
        alignment: 'center',
      };
    } else if (selectedType === 'rich-text') {
      newBlock.richTextData = {
        paragraph1:
          'NexorDive merges technical precision with bold aesthetic design. Every system we craft is engineered to solve core business friction and delight real users.',
        paragraph2:
          'From high-concurrency SaaS applications to motion graphic creator kits, our engineering squad operates with surgical craftsmanship.',
        image: '/assets/about_nexordive_graphic.png',
        imagePosition: 'right',
        ctaLabel: 'Book an Discovery Call',
        ctaAction: 'contact',
      };
    } else if (selectedType === 'video') {
      newBlock.videoData = {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailImage: '/assets/about/laptop_consultation_bg.jpg',
        caption: 'High-resolution preview of our architectural pipeline and creative suite.',
      };
    }

    onCreated(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Create New Custom Section
              </h2>
              <p className="text-xs text-slate-500">
                Choose a pre-built block structure, customize details, and place it anywhere on your page.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Step 1: Choose Block Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              1. Choose Section Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BLOCK_TYPES.map((bt) => {
                const Icon = bt.icon;
                const isSelected = selectedType === bt.type;

                return (
                  <div
                    key={bt.type}
                    onClick={() => handleSelectType(bt.type)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${bt.accentColor}18`, color: bt.accentColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {bt.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                        {bt.description}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Section Title & Copy */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Section Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Eyebrow Tag (Optional)
                </label>
                <input
                  type="text"
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value)}
                  placeholder="e.g. ANSWERS"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase tracking-wider font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Section Main Heading *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Frequently Asked Questions"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Intro Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary paragraph explaining this section..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Step 3: Background Theme */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-semibold text-slate-700 mb-2">
              Background Color Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'white', label: 'Clean White', bg: 'bg-white border-slate-300' },
                { id: 'slate', label: 'Light Slate', bg: 'bg-slate-100 border-slate-300' },
                { id: 'dark', label: 'Midnight Dark', bg: 'bg-slate-900 border-slate-800 text-white' },
                { id: 'teal', label: 'Deep Brand Teal', bg: 'bg-[#0d5363] border-cyan-800 text-white' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setBackgroundColor(theme.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    theme.bg
                  } ${
                    backgroundColor === theme.id ? 'ring-2 ring-indigo-500 scale-[1.02]' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>{theme.label}</span>
                  {backgroundColor === theme.id && <Check className="w-3.5 h-3.5 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 cursor-pointer transition-all active:scale-95"
            >
              Create Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
