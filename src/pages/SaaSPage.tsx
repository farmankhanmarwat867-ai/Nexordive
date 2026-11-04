'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Server,
  CreditCard,
  ShieldCheck,
  Zap,
  Layers,
  Database,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Search,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { ProjectShowcase } from '../components/ProjectShowcase';

interface SaaSPageProps {
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigatePricing?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

interface SaaSCapability {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
  techStack: string[];
}

const SAAS_CAPABILITIES: SaaSCapability[] = [
  {
    id: 'multi-tenancy',
    title: 'Multi-Tenant Database Architecture',
    tagline: 'Tenant isolation with Postgres Row-Level Security (RLS)',
    description: 'We design bulletproof multi-tenant database schemas ensuring complete tenant data isolation, encrypted connection pooling, and seamless automated tenant provisioning.',
    icon: <Database className="w-6 h-6 text-cyan-300" />,
    specs: [
      'PostgreSQL RLS tenant boundary isolation',
      'Supabase & Prisma automated schema migrations',
      'Encrypted read replicas & connection pooling',
      'Tenant-level backups and restore protocols',
    ],
    techStack: ['PostgreSQL', 'Supabase', 'Prisma', 'Redis'],
  },
  {
    id: 'stripe-billing',
    title: 'Subscription Engine & Metered Billing',
    tagline: 'Stripe Billing, usage meters & webhook idempotency',
    description: 'Engineered for seamless monetization. We implement multi-tier seat licensing, metered usage calculations, customer portals, tax compliance, and automated dunning workflows.',
    icon: <CreditCard className="w-6 h-6 text-emerald-300" />,
    specs: [
      'Stripe Checkout, Customer Portal & Elements',
      'Idempotent webhook handlers with dead-letter retries',
      'Metered usage reporting and overage billing',
      'Automated failed payment recovery (Dunning)',
    ],
    techStack: ['Stripe API', 'Webhooks', 'Upstash', 'Node.js'],
  },
  {
    id: 'edge-apis',
    title: 'High-Concurrency Serverless & Edge APIs',
    tagline: 'Sub-50ms p95 latency for global SaaS users',
    description: 'Built on Next.js App Router and edge compute. We implement distributed caching layers, rate limiting, and optimistic UI updates for instantaneous user interactions.',
    icon: <Zap className="w-6 h-6 text-amber-300" />,
    specs: [
      'Sub-50ms global edge cache hit latency',
      'Redis token-bucket API rate limiting',
      'Edge middleware JWT authentication verification',
      'Real-time WebSocket notifications & state sync',
    ],
    techStack: ['Next.js 15', 'Cloudflare Workers', 'Redis', 'Vercel Edge'],
  },
  {
    id: 'enterprise-rbac',
    title: 'Enterprise RBAC, SSO & Audit Logging',
    tagline: 'SOC2 & enterprise security readiness from Day 1',
    description: 'Provide enterprise customers with granular role-based permissions, SAML/OIDC single sign-on, and immutable compliance audit logs.',
    icon: <ShieldCheck className="w-6 h-6 text-sky-300" />,
    specs: [
      'Granular role-based access control (RBAC) matrix',
      'WorkOS / Auth0 enterprise SAML & Okta SSO integration',
      'Tamper-evident system activity and change logs',
      'GDPR & HIPAA compliance architectural alignment',
    ],
    techStack: ['NextAuth', 'SAML SSO', 'OpenTelemetry', 'TypeScript'],
  },
  {
    id: 'background-queues',
    title: 'Distributed Background Workers & Queues',
    tagline: 'Reliable asynchronous processing and scheduled jobs',
    description: 'Prevent UI bottlenecks by offloading heavy computational tasks, AI document analysis, video transcoding, and batch report exports to resilient message queues.',
    icon: <Cpu className="w-6 h-6 text-purple-300" />,
    specs: [
      'BullMQ and Redis distributed task queues',
      'Automated exponential retry with backoff strategies',
      'Cron schedules for automated recurring maintenance',
      'Real-time progress telemetry via WebSockets',
    ],
    techStack: ['BullMQ', 'Redis', 'Node.js Workers', 'Docker'],
  },
  {
    id: 'ci-cd-devops',
    title: 'Automated CI/CD & Zero-Downtime Deployments',
    tagline: 'Sanitized Git repository ownership & automated pipelines',
    description: 'We construct airtight continuous integration pipelines, automated staging preview environments for every pull request, and zero-downtime rolling production deploys.',
    icon: <Server className="w-6 h-6 text-teal-300" />,
    specs: [
      'GitHub Actions with automated linting & test suites',
      'Vercel & Docker preview environments per PR',
      'Zero-downtime blue-green production cutovers',
      '100% intellectual property & Git ownership handover',
    ],
    techStack: ['Docker', 'GitHub Actions', 'Terraform', 'AWS'],
  },
];

export const SaaSPage: React.FC<SaaSPageProps> = ({
  onNavigateHome,
  onNavigateServices,
  onNavigatePricing,
  onOpenContactWithSummary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCapabilities = SAAS_CAPABILITIES.filter((cap) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cap.title.toLowerCase().includes(q) ||
      cap.tagline.toLowerCase().includes(q) ||
      cap.description.toLowerCase().includes(q) ||
      cap.specs.some((s) => s.toLowerCase().includes(q)) ||
      cap.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 bg-white">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="SaaS Development Services"
        title="SaaS Development Services — MVP, Dashboards & Subscriptions"
        description="We build full-lifecycle SaaS MVPs, interactive operational dashboards, and automated Stripe subscription billing engines for startups, founders, and growing software companies worldwide."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Services', onClick: onNavigateServices },
          { label: 'SaaS Architecture' },
        ]}
        actions={[
          {
            label: 'Schedule SaaS Architecture Call',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Full-Lifecycle SaaS Architecture & Multi-Tenant Platform Engineering'),
          },
          {
            label: 'Calculate SaaS Investment',
            variant: 'secondary',
            onClick: onNavigatePricing,
          },
        ]}
        searchSlot={
          <div className="relative w-full">
            <Search className="w-4 h-4 text-cyan-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SaaS architecture capabilities (e.g. Stripe, RLS, Edge APIs, SSO)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-cyan-100/60 text-xs sm:text-sm border border-cyan-400/30 focus:outline-hidden focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-cyan-200 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        }
      />

      {/* 2. Architectural Capabilities Section */}
      <section className="py-20 lg:py-28 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] mb-4">
              <Layers className="w-3.5 h-3.5 text-[#0d5363]" />
              <span>Architectural Standards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-950 tracking-tight">
              Enterprise SaaS Core Capabilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Every SaaS platform we engineer is built with zero technical debt, complete intellectual property handover, and production-tested cloud patterns.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCapabilities.map((cap, idx) => (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#0d5363]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#004d6a] flex items-center justify-center mb-6 shadow-md shadow-[#004d6a]/20 group-hover:scale-105 transition-transform">
                    {cap.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#004d6a] transition-colors mb-2">
                    {cap.title}
                  </h3>
                  <div className="text-xs font-mono font-semibold text-[#0d5363] mb-3">
                    {cap.tagline}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {cap.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      Engineering Specifications
                    </span>
                    {cap.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100">
                    {cap.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenContactWithSummary(`Inquiring about SaaS Architecture: ${cap.title}`)
                    }
                    className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#004d6a] hover:text-white text-[#0d5363] text-xs font-bold tracking-wide transition-all cursor-pointer group/btn border border-slate-200"
                  >
                    <span>Inquire This Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCapabilities.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-slate-600 text-sm mb-4">
                No capabilities matched your search term "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-6 py-2.5 rounded-full bg-[#004d6a] text-white text-xs font-bold tracking-wide"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. SaaS Case Studies & Prototype Proof */}
      <ProjectShowcase
        limit={3}
        onInquireProject={(project) =>
          onOpenContactWithSummary(`Inquiring about SaaS Case Reference: ${project}`)
        }
      />

      {/* 4. Disciplined Six-Phase Process Timeline */}
      <ProcessTimeline />
    </div>
  );
};
