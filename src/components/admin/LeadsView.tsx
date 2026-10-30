'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  MessageCircle,
  Mail,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminStore';

export const LeadsView: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead, addLead } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualService, setManualService] = useState('Web Development');
  const [manualBudget, setManualBudget] = useState('$300 – $699 (Pro Digital Kit)');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      lead.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) return;

    addLead({
      name: manualName,
      whatsapp: manualPhone,
      email: manualEmail || 'lead@direct.contact',
      service: manualService,
      budget: manualBudget,
      status: 'New',
      notes: 'Manually logged lead from client discovery call.',
    });

    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setIsManualModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,WhatsApp,Email,Service,Budget,Date,Status'];
    const rows = leads.map(
      (l) =>
        `"${l.id}","${l.name}","${l.whatsapp}","${l.email}","${l.service}","${l.budget}","${l.date}","${l.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexordive-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & CRM Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Leads & Inquiries Manager (Mini CRM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture, follow up, and update conversion stages for all prospective clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, WhatsApp, email, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['All', 'New', 'Contacted', 'In Progress', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads CRM Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">WhatsApp Number</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Service Needed</th>
                <th className="py-3.5 px-6">Budget</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status Update</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No leads found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {lead.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-900 whitespace-nowrap">
                      <a
                        href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lead.whatsapp}</span>
                      </a>
                    </td>
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                      <a href={`mailto:${lead.email}`} className="hover:underline flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.email}</span>
                      </a>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-semibold">
                        {lead.service}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-800 whitespace-nowrap">
                      {lead.budget}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">
                      {lead.date}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                        className={`text-[11px] font-bold py-1.5 px-3 rounded-xl border cursor-pointer focus:outline-none transition-colors ${
                          lead.status === 'New'
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : lead.status === 'In Progress'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : lead.status === 'Contacted'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}
                      >
                        <option value="New">● New</option>
                        <option value="Contacted">● Contacted</option>
                        <option value="In Progress">● In Progress</option>
                        <option value="Closed">● Closed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                            lead.name
                          )},%20this%20is%20NexorDive.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open WhatsApp chat"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Inbound Lead Modal */}
      {isManualModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsManualModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-900 font-display mb-1">
              Add Manual Inbound Lead
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Record a client inquiry received via call, DM, or networking.
            </p>

            <form onSubmit={handleCreateManualLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilal Ahmed"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+92 314 600 9810"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service</label>
                  <select
                    value={manualService}
                    onChange={(e) => setManualService(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Streamer Assets">Streamer Assets</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Budget Tier</label>
                  <select
                    value={manualBudget}
                    onChange={(e) => setManualBudget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="$49 – $129 (Streamer Pack)">$49 – $129</option>
                    <option value="$99 – $299 (Starter Website)">$99 – $299</option>
                    <option value="$300 – $699 (Pro Digital Kit)">$300 – $699</option>
                    <option value="$1,000 – $5,000 (Standard MVP)">$1,000 – $5,000</option>
                    <option value="$5,000+ (Custom Enterprise)">$5,000+</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
