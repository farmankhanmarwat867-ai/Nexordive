'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

export interface ComplementaryService {
  title: string;
  slug: string;
  href: string;
  page: string;
  iconName: string;
  description: string;
  relationshipTag: string;
}

const ALL_SERVICES_MAP: Record<string, ComplementaryService[]> = {
  'web-development': [
    {
      title: 'Graphic Design & Branding',
      slug: 'graphic-design',
      href: '/services/graphic-design',
      page: 'graphic-design',
      iconName: 'PenTool',
      description: 'Establish cohesive visual branding, color palettes, and interface assets to pair with your website build.',
      relationshipTag: 'Design & Identity',
    },
    {
      title: 'SaaS Development & MVPs',
      slug: 'saas-development',
      href: '/services/saas-development',
      page: 'saas-development',
      iconName: 'Cpu',
      description: 'Scale custom websites into multi-user software products, client portals, and cloud web applications.',
      relationshipTag: 'Custom Software',
    },
    {
      title: 'Shopify Store Development',
      slug: 'shopify-development',
      href: '/services/shopify-development',
      page: 'shopify-development',
      iconName: 'ShoppingBag',
      description: 'Launch high-converting e-commerce storefronts, collection layouts, and mobile-friendly shopping funnels.',
      relationshipTag: 'E-Commerce',
    },
  ],
  'graphic-design': [
    {
      title: 'Web Development Services',
      slug: 'web-development',
      href: '/services/web-development',
      page: 'web-development',
      iconName: 'Code2',
      description: 'Transform your brand identity and UI concepts into responsive, fast-loading business websites.',
      relationshipTag: 'Web Execution',
    },
    {
      title: 'Digital Marketing & Campaigns',
      slug: 'digital-marketing',
      href: '/services/digital-marketing',
      page: 'digital-marketing',
      iconName: 'TrendingUp',
      description: 'Deploy your visual creatives across paid ad campaigns, social channels, and search visibility funnels.',
      relationshipTag: 'Growth & Reach',
    },
    {
      title: 'Streamer Assets & Broadcasts',
      slug: 'streamer-assets',
      href: '/streamer-assets',
      page: 'streamer-assets',
      iconName: 'Tv',
      description: 'Explore dedicated creator graphics, broadcast overlays, badges, and stream branding packages.',
      relationshipTag: 'Creator Visuals',
    },
  ],
  'digital-marketing': [
    {
      title: 'Web Development Services',
      slug: 'web-development',
      href: '/services/web-development',
      page: 'web-development',
      iconName: 'Code2',
      description: 'Ensure incoming campaign traffic arrives at fast, mobile-friendly landing pages built to convert.',
      relationshipTag: 'Conversion Foundation',
    },
    {
      title: 'Graphic Design & Creatives',
      slug: 'graphic-design',
      href: '/services/graphic-design',
      page: 'graphic-design',
      iconName: 'PenTool',
      description: 'Produce high-converting ad banners, social media creative variations, and branded campaign collateral.',
      relationshipTag: 'Creative Assets',
    },
    {
      title: 'AI Automation Solutions',
      slug: 'ai-automation',
      href: '/services/ai-automation',
      page: 'ai-automation',
      iconName: 'Bot',
      description: 'Automate incoming lead routing, inquiry handling, and sales follow-up workflows from your campaigns.',
      relationshipTag: 'Workflow Automation',
    },
  ],
  'ai-automation': [
    {
      title: 'SaaS Development & MVPs',
      slug: 'saas-development',
      href: '/services/saas-development',
      page: 'saas-development',
      iconName: 'Cpu',
      description: 'Incorporate intelligent reasoning, automated pipelines, and agentic workflows into your SaaS platform.',
      relationshipTag: 'Product Integration',
    },
    {
      title: 'Web Development Services',
      slug: 'web-development',
      href: '/services/web-development',
      page: 'web-development',
      iconName: 'Code2',
      description: 'Deploy conversational AI chatbots, smart contact intake forms, and automated routing onto your website.',
      relationshipTag: 'Front-End Integration',
    },
    {
      title: 'Digital Marketing Services',
      slug: 'digital-marketing',
      href: '/services/digital-marketing',
      page: 'digital-marketing',
      iconName: 'TrendingUp',
      description: 'Connect automated follow-up workflows directly to lead acquisition campaigns and marketing channels.',
      relationshipTag: 'Marketing Operations',
    },
  ],
  'mobile-app-development': [
    {
      title: 'SaaS Development & MVPs',
      slug: 'saas-development',
      href: '/services/saas-development',
      page: 'saas-development',
      iconName: 'Cpu',
      description: 'Architect a robust cloud backend, REST/GraphQL APIs, and web administration portals for your mobile app.',
      relationshipTag: 'Cloud Backend',
    },
    {
      title: 'Graphic Design & UI/UX',
      slug: 'graphic-design',
      href: '/services/graphic-design',
      page: 'graphic-design',
      iconName: 'PenTool',
      description: 'Design interactive mobile wireframes, intuitive touchscreen user flows, and cohesive design systems.',
      relationshipTag: 'Product UI/UX',
    },
    {
      title: 'AI Automation Solutions',
      slug: 'ai-automation',
      href: '/services/ai-automation',
      page: 'ai-automation',
      iconName: 'Bot',
      description: 'Integrate automated in-app notifications, support bots, and real-time synchronization pipelines.',
      relationshipTag: 'Smart Services',
    },
  ],
  'saas-development': [
    {
      title: 'Web Development Services',
      slug: 'web-development',
      href: '/services/web-development',
      page: 'web-development',
      iconName: 'Code2',
      description: 'Launch high-converting SaaS landing pages, documentation hubs, and marketing sites to acquire subscribers.',
      relationshipTag: 'Acquisition Website',
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      href: '/services/mobile-app-development',
      page: 'mobile-app-development',
      iconName: 'Smartphone',
      description: 'Deliver companion iOS and Android mobile apps connected to your SaaS backend and user accounts.',
      relationshipTag: 'Mobile Extension',
    },
    {
      title: 'AI Automation Solutions',
      slug: 'ai-automation',
      href: '/services/ai-automation',
      page: 'ai-automation',
      iconName: 'Bot',
      description: 'Power background processing jobs, user task automations, and intelligent reporting in your SaaS platform.',
      relationshipTag: 'Workflow Engine',
    },
  ],
  'shopify-development': [
    {
      title: 'Digital Marketing & SEO',
      slug: 'digital-marketing',
      href: '/services/digital-marketing',
      page: 'digital-marketing',
      iconName: 'TrendingUp',
      description: 'Drive high-intent shoppers to your Shopify collections through search visibility, SEO, and paid campaigns.',
      relationshipTag: 'Store Traffic',
    },
    {
      title: 'Graphic Design & Branding',
      slug: 'graphic-design',
      href: '/services/graphic-design',
      page: 'graphic-design',
      iconName: 'PenTool',
      description: 'Elevate your online storefront with branded promotional banners, product graphics, and packaging visuals.',
      relationshipTag: 'Visual Identity',
    },
    {
      title: 'Web Development Services',
      slug: 'web-development',
      href: '/services/web-development',
      page: 'web-development',
      iconName: 'Code2',
      description: 'Build custom headless storefronts, third-party API integrations, or standalone product landing pages.',
      relationshipTag: 'Custom Architecture',
    },
  ],
};

interface RelatedServicesProps {
  currentSlug: string;
  onNavigate?: (page: string) => void;
}

export const RelatedServices: React.FC<RelatedServicesProps> = ({
  currentSlug,
  onNavigate,
}) => {
  const normalizedSlug = currentSlug.replace('services/', '');
  const related = ALL_SERVICES_MAP[normalizedSlug] || [];

  if (related.length === 0) return null;

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-[#0d5363] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d5363]" />
            <span>Complementary Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Explore Connected Digital Solutions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
            Digital projects often achieve stronger results when strategy, design, development and marketing work together. Explore related capabilities that pair with this service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {related.map((service) => (
            <div
              key={service.slug}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0d5363]/40 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#0d5363]/10 border border-[#0d5363]/15 text-[#0d5363] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <DynamicIcon name={service.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {service.relationshipTag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-[#0d5363] transition-colors mb-2">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={service.href}
                  onClick={(e) => handleLinkClick(e, service.page)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0d5363] hover:text-[#093c47] group-hover:translate-x-1 transition-all"
                  aria-label={`Explore ${service.title}`}
                >
                  <span>Explore {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-700" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
