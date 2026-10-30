'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Trash2,
  MessageCircle,
  Mail,
  Download,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  DollarSign,
  Tag,
  Calendar,
  X,
  Send,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { useAdmin, Lead } from '../../context/AdminStore';
import {
  normalizeWhatsAppNumber,
  generateWhatsAppUrl,
  validateEmail,
  generateMailtoUrl,
  generateDefaultReplies,
  InquiryDraft,
} from '../../utils/inquiryReplies';

type StatusFilterType = 'All' | 'New' | 'Contacted' | 'In Progress' | 'Closed';

function getAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-emerald-100 text-emerald-700 border-emerald-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-sky-100 text-sky-700 border-sky-200',
    'bg-rose-100 text-rose-700 border-rose-200',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  const parts = (name || '').trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'CL';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const LeadsView: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead, content } = useAdmin();
  const agencyName = content.global?.agencyName || 'NexorDive';

  // Navigation State: null = List View, string = Detail View of that lead
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Preserve scroll position when transitioning from list to detail and back
  const scrollPositionRef = useRef<number>(0);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);

  // Search & Filtering State (preserved across detail navigations)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('All');

  // Per-inquiry customized drafts state (isolated by lead.id)
  const [customDrafts, setCustomDrafts] = useState<Record<string, InquiryDraft>>({});

  // Country code overrides for local numbers without dial code
  const [countryCodeOverrides, setCountryCodeOverrides] = useState<Record<string, string>>({});
  const [tempCountryCode, setTempCountryCode] = useState('');

  // UI state for expandable reply editor & copy feedback
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<'whatsapp' | 'email' | null>(null);

  // Filtered inquiries list
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.whatsapp.includes(q) ||
        lead.service.toLowerCase().includes(q) ||
        (lead.notes || '').toLowerCase().includes(q) ||
        lead.budget.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'New'
          ? lead.status === 'New'
          : statusFilter === 'Contacted'
          ? lead.status === 'Contacted'
          : statusFilter === 'In Progress'
          ? lead.status === 'In Progress'
          : lead.status === 'Closed';

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  // Selected lead object (handles deletions gracefully)
  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Compute active reply draft for the selected inquiry
  const activeDraft: InquiryDraft = useMemo(() => {
    if (!selectedLead) {
      return { whatsappText: '', emailSubject: '', emailBody: '' };
    }
    // Return customized draft if manager modified it, else default deterministic template
    if (customDrafts[selectedLead.id]) {
      return customDrafts[selectedLead.id];
    }
    return generateDefaultReplies(selectedLead, agencyName);
  }, [selectedLead, customDrafts, agencyName]);

  // Contact channel validations
  const whatsappValidation = useMemo(() => {
    if (!selectedLead) return { valid: false, error: 'No lead selected' };
    const cc = countryCodeOverrides[selectedLead.id];
    return normalizeWhatsAppNumber(selectedLead.whatsapp, cc);
  }, [selectedLead, countryCodeOverrides]);

  const emailValidation = useMemo(() => {
    if (!selectedLead) return { valid: false, error: 'No lead selected' };
    return validateEmail(selectedLead.email);
  }, [selectedLead]);

  // URLs for outbound messaging links
  const whatsappUrl = useMemo(() => {
    if (!whatsappValidation.valid || !whatsappValidation.normalized) return '';
    return generateWhatsAppUrl(whatsappValidation.normalized, activeDraft.whatsappText);
  }, [whatsappValidation, activeDraft.whatsappText]);

  const mailtoUrl = useMemo(() => {
    if (!emailValidation.valid || !emailValidation.sanitizedEmail) return '';
    return generateMailtoUrl(
      emailValidation.sanitizedEmail,
      activeDraft.emailSubject,
      activeDraft.emailBody
    );
  }, [emailValidation, activeDraft.emailSubject, activeDraft.emailBody]);

  // Navigation handlers
  const handleSelectLead = (leadId: string) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedLeadId(leadId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToList = () => {
    setSelectedLeadId(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' });
    });
  };

  // Draft editing handlers for current inquiry
  const handleUpdateWhatsAppDraft = (text: string) => {
    if (!selectedLead) return;
    setCustomDrafts((prev) => ({
      ...prev,
      [selectedLead.id]: {
        ...activeDraft,
        whatsappText: text,
      },
    }));
  };

  const handleUpdateEmailDraft = (subject: string, body: string) => {
    if (!selectedLead) return;
    setCustomDrafts((prev) => ({
      ...prev,
      [selectedLead.id]: {
        ...activeDraft,
        emailSubject: subject,
        emailBody: body,
      },
    }));
  };

  const handleResetDraft = () => {
    if (!selectedLead) return;
    setCustomDrafts((prev) => {
      const copy = { ...prev };
      delete copy[selectedLead.id];
      return copy;
    });
  };

  const handleApplyCountryCode = () => {
    if (!selectedLead || !tempCountryCode.trim()) return;
    setCountryCodeOverrides((prev) => ({
      ...prev,
      [selectedLead.id]: tempCountryCode.trim(),
    }));
    setTempCountryCode('');
  };

  const handleCopyText = async (type: 'whatsapp' | 'email') => {
    const textToCopy =
      type === 'whatsapp'
        ? activeDraft.whatsappText
        : `Subject: ${activeDraft.emailSubject}\n\n${activeDraft.emailBody}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch (_) {
      // Fallback
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID,Name,WhatsApp,Email,Service,Budget,Date,Status,Notes'];
    const exportItems = filteredLeads.length > 0 ? filteredLeads : leads;
    const rows = exportItems.map(
      (l) =>
        `"${l.id}","${l.name.replace(/"/g, '""')}","${l.whatsapp.replace(/"/g, '""')}","${l.email.replace(/"/g, '""')}","${l.service.replace(/"/g, '""')}","${l.budget.replace(/"/g, '""')}","${l.date}","${l.status}","${(l.notes || '').replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexordive-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const newCount = leads.filter((l) => l.status === 'New').length;

  return (
    <div className="space-y-6 pb-20 max-w-full">
      {/* =========================================================================
          VIEW 1: INQUIRIES LIST (Full Width on Desktop and Mobile)
          ========================================================================= */}
      {!selectedLead ? (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-display text-slate-900">
                  Messages & Inquiries
                </h1>
                {newCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {newCount} New
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Client inquiries received from your website contact forms and scope calculator.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar across full width */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client name, email, phone, service, budget..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {(
                [
                  { id: 'All', label: 'All', count: leads.length },
                  { id: 'New', label: 'New', count: leads.filter((l) => l.status === 'New').length },
                  { id: 'Contacted', label: 'Replied', count: leads.filter((l) => l.status === 'Contacted').length },
                  { id: 'In Progress', label: 'In Progress', count: leads.filter((l) => l.status === 'In Progress').length },
                  { id: 'Closed', label: 'Closed', count: leads.filter((l) => l.status === 'Closed').length },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 bg-slate-100 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      statusFilter === tab.id
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Full-Width Inquiries List */}
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <Mail className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No inquiries found</h3>
                <p className="text-xs text-slate-500">
                  {searchTerm
                    ? 'No inquiries match your search query.'
                    : 'Messages submitted via contact forms will appear here.'}
                </p>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isNew = lead.status === 'New';
                const avatarColor = getAvatarColor(lead.name);
                const initials = getInitials(lead.name);

                return (
                  <div
                    key={lead.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectLead(lead.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectLead(lead.id);
                      }
                    }}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer select-none text-left flex items-start gap-4 group focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {/* Client Avatar with Initials */}
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-xs ${avatarColor}`}
                    >
                      {initials}
                    </div>

                    {/* Middle Content */}
                    <div className="min-w-0 flex-1">
                      {/* Top Row: Name, Status, Date */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 font-display group-hover:text-indigo-600 transition-colors">
                            {lead.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {lead.service}
                          </span>
                          {isNew ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              New
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                lead.status === 'Contacted'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : lead.status === 'In Progress'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {lead.status === 'Contacted' ? 'Replied' : lead.status}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {lead.date}
                        </span>
                      </div>

                      {/* Second Row: Channels & Budget */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                        <span>{lead.email}</span>
                        <span>·</span>
                        <span>{lead.whatsapp}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-700">Budget: {lead.budget}</span>
                      </div>

                      {/* Third Row: Inquiry Message Preview */}
                      <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        {lead.notes || 'No message text provided.'}
                      </div>
                    </div>

                    {/* Right Arrow Indicator */}
                    <div className="hidden sm:flex items-center self-center pl-2 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: INQUIRY DETAIL & STICKY OUTBOUND REPLY STATION
            (Full Width Single-Panel View on Desktop & Mobile)
            ========================================================================= */
        <div className="space-y-4">
          {/* Top Navigation & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <button
              ref={backButtonRef}
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Back to Messages"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to Messages</span>
            </button>

            {/* Right Top Status Controls */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  Status:
                </span>
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    updateLeadStatus(selectedLead.id, e.target.value as Lead['status'])
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted (Replied)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {selectedLead.status === 'New' && (
                <button
                  type="button"
                  onClick={() => updateLeadStatus(selectedLead.id, 'Contacted')}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Mark Replied</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete inquiry from ${selectedLead.name}?`)) {
                    deleteLead(selectedLead.id);
                    setSelectedLeadId(null);
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Delete inquiry"
                aria-label="Delete inquiry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full-Width Detail Box with Sticky Action Footer */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden flex flex-col h-[calc(100dvh-11rem)] sm:h-[calc(100dvh-12rem)] sm:max-h-[820px] relative">
            {/* 1. Header Bar: Client Identification (shrink-0) */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 shrink-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-xs ${getAvatarColor(
                    selectedLead.name
                  )}`}
                >
                  {getInitials(selectedLead.name)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate font-display">
                      {selectedLead.name}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      ID: {selectedLead.id}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 block truncate">
                    {selectedLead.email} · {selectedLead.whatsapp}
                  </span>
                </div>
              </div>

              {/* Status pill indicator */}
              <div className="shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    selectedLead.status === 'New'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : selectedLead.status === 'Contacted'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : selectedLead.status === 'In Progress'
                      ? 'bg-sky-50 text-sky-800 border-sky-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {selectedLead.status === 'Contacted' ? 'Replied' : selectedLead.status}
                </span>
              </div>
            </div>

            {/* 2. Scrollable Middle Content Area (flex-1 min-h-0 overflow-y-auto) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Parameter Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1 font-medium">
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    Service Requested
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {selectedLead.service}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    Budget Range
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {selectedLead.budget}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    Submission Date
                  </span>
                  <span className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
                    {selectedLead.date}
                  </span>
                </div>
              </div>

              {/* Original Inquiry Message Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Client Message</span>
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedLead.notes || 'No extra notes provided with this inquiry.'}
                </div>
              </div>

              {/* Country Code Clarification Card if required for local number */}
              {whatsappValidation.requiresCountryCode && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Country code needed for local WhatsApp number</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    The client provided local format ({selectedLead.whatsapp}). Please enter their international dial code (e.g. +92, +1, +44) to format the WhatsApp chat link:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. +92 or +1"
                      value={tempCountryCode}
                      onChange={(e) => setTempCountryCode(e.target.value)}
                      className="w-28 px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCountryCode}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      Apply Code
                    </button>
                  </div>
                </div>
              )}

              {/* Collapsible Customize Reply Drafts Section */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                  className="flex items-center justify-between w-full text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Customize reply draft before opening app</span>
                  </span>
                  {isEditorExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isEditorExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-4 bg-white p-4 rounded-xl">
                    {/* WhatsApp Message Draft */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700">
                        WhatsApp Draft Text
                      </label>
                      <textarea
                        rows={3}
                        value={activeDraft.whatsappText}
                        onChange={(e) => handleUpdateWhatsAppDraft(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                        placeholder="WhatsApp message text..."
                      />
                    </div>

                    {/* Email Subject & Body Draft */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Email Subject
                        </label>
                        <input
                          type="text"
                          value={activeDraft.emailSubject}
                          onChange={(e) =>
                            handleUpdateEmailDraft(e.target.value, activeDraft.emailBody)
                          }
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="Subject..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Email Body
                        </label>
                        <textarea
                          rows={4}
                          value={activeDraft.emailBody}
                          onChange={(e) =>
                            handleUpdateEmailDraft(activeDraft.emailSubject, e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-sans"
                          placeholder="Email body content..."
                        />
                      </div>
                    </div>

                    {/* Reset Button */}
                    {customDrafts[selectedLead.id] && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleResetDraft}
                          className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset to default template</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================================
                3. STICKY / PINNED ACTION FOOTER
                Always visible on desktop and mobile near the bottom of detail card
                ========================================================================= */}
            <div className="shrink-0 p-3.5 sm:p-4 bg-slate-50/95 backdrop-blur-md border-t border-slate-200 space-y-2.5 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
              {/* Primary Reply Buttons (Stack on narrow screens, 2 cols on sm+) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* WhatsApp Action */}
                <div>
                  {whatsappValidation.valid ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Reply via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-200/80 text-slate-500 border border-slate-300/80 cursor-not-allowed opacity-80"
                      title={whatsappValidation.error || 'Invalid phone'}
                    >
                      <MessageCircle className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="truncate">
                        Reply via WhatsApp ({whatsappValidation.requiresCountryCode ? 'Code Needed' : 'Disabled'})
                      </span>
                    </button>
                  )}
                </div>

                {/* Email Action */}
                <div>
                  {emailValidation.valid ? (
                    <a
                      href={mailtoUrl}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>Reply via Email</span>
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-200/80 text-slate-500 border border-slate-300/80 cursor-not-allowed opacity-80"
                      title={emailValidation.error || 'Invalid email'}
                    >
                      <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="truncate">
                        Reply via Email (Disabled: No Email)
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Bar Sub-Tools: Target Recipient Info & Copy Fallbacks */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-slate-500 pt-0.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {whatsappValidation.valid && (
                    <span className="font-mono text-emerald-800 font-medium">
                      +{whatsappValidation.normalized}
                    </span>
                  )}
                  {emailValidation.valid && (
                    <span className="truncate max-w-[200px] text-indigo-800 font-medium">
                      {emailValidation.sanitizedEmail}
                    </span>
                  )}
                </div>

                {/* Copy Draft Fallback Buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleCopyText('whatsapp')}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {copyFeedback === 'whatsapp' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy WA Draft</span>
                      </>
                    )}
                  </button>

                  <span>·</span>

                  <button
                    type="button"
                    onClick={() => handleCopyText('email')}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline cursor-pointer"
                  >
                    {copyFeedback === 'email' ? (
                      <>
                        <Check className="w-3 h-3 text-indigo-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Email Draft</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Small Honest Feedback Notice */}
              <p className="text-[10px] text-slate-400 leading-tight">
                Opening an external app does not automatically send messages or mark the inquiry as replied.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
