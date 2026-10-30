'use client';

import React from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  MessageCircle,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';

interface OverviewViewProps {
  onNavigateTab: (tab: 'leads' | 'portfolio' | 'pricing' | 'settings') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab }) => {
  const { leads, projects, services, updateLeadStatus } = useAdmin();

  // Compute metrics
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const activeProjectsCount = projects.length;
  const enabledServicesCount = services.filter((s) => s.enabled).length;

  // Estimated pipeline sum based on lead selections
  const pipelineValue = leads.reduce((acc, lead) => {
    if (lead.budget.includes('$5,000+')) return acc + 10000;
    if (lead.budget.includes('$1,000')) return acc + 3000;
    if (lead.budget.includes('$300')) return acc + 500;
    if (lead.budget.includes('$99')) return acc + 200;
    if (lead.budget.includes('$49')) return acc + 89;
    return acc + 500;
  }, 0);

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Executive Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry on client inquiries, project deliverables, and agency pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('leads')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <span>Review New Leads ({newLeadsCount})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Leads */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Inbound Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tabular-nums">
              {totalLeads}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{newLeadsCount} new this week</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('leads')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Manage Mini CRM Table</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Active Projects */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Portfolio Projects
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tabular-nums">
              {activeProjectsCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{enabledServicesCount} services actively live</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('portfolio')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Add or Edit Case Studies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Estimated Pipeline Value */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estimated Inbound Pipeline
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tabular-nums">
              ${pipelineValue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Based on client budget tiers</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('pricing')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Update Package Pricing</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Activity: Latest Inquiries Data Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Recent Inquiries & Contact Form Submissions
            </h2>
            <p className="text-xs text-slate-500">
              Latest leads captured directly from the NexorDive frontend form.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('leads')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            View All ({totalLeads}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Client Name</th>
                <th className="py-3.5 px-6">WhatsApp</th>
                <th className="py-3.5 px-6">Service Requested</th>
                <th className="py-3.5 px-6">Budget Tier</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                    <div>{lead.name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{lead.email}</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-800 whitespace-nowrap">
                    {lead.whatsapp}
                  </td>
                  <td className="py-4 px-6 text-slate-800 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-medium">
                      {lead.service}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-700 whitespace-nowrap">
                    {lead.budget.split('(')[0]}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">
                    {lead.date}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`text-[11px] font-semibold py-1 px-2.5 rounded-lg border cursor-pointer focus:outline-none ${
                        lead.status === 'New'
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : lead.status === 'In Progress'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : lead.status === 'Contacted'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <a
                      href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                        lead.name
                      )},%20this%20is%20NexorDive%20following%20up%20on%20your%20${encodeURIComponent(
                        lead.service
                      )}%20request.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
