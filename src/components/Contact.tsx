'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  User,
  Phone,
  Briefcase,
  DollarSign,
  FileText,
  ChevronDown,
  Lock,
  AlertCircle,
  Calendar,
  Target,
} from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { normalizeWhatsAppNumber, validateEmail } from '../utils/inquiryReplies';
import { trackLeadSubmission, trackContactClick } from '../utils/analytics';

export interface ContactFormData {
  name: string;
  email: string;
  whatsapp?: string;
  service: string;
  projectGoals: string;
  requiredFeatures?: string;
  budget?: string;
  preferredTimeline?: string;
  consent: boolean;
  message?: string;
}

export interface ContactProps {
  initialSummary?: string;
  onSuccessSubmit?: (data: ContactFormData) => Promise<{ success: boolean; id?: string; error?: string } | void> | { success: boolean; id?: string; error?: string } | void;
  className?: string;
  isModal?: boolean;
  hideHeader?: boolean;
}

export const Contact: React.FC<ContactProps> = ({
  initialSummary = '',
  onSuccessSubmit,
  className = '',
  isModal = false,
  hideHeader = false,
}) => {
  const { content, addLead } = useAdmin();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    whatsapp: '',
    service: 'Web Development',
    projectGoals: initialSummary || '',
    requiredFeatures: '',
    budget: 'Exploring / Open to recommendation',
    preferredTimeline: 'Flexible / Planning Phase',
    consent: false,
    message: initialSummary,
  });

  useEffect(() => {
    if (initialSummary) {
      setFormData((prev) => ({
        ...prev,
        projectGoals: prev.projectGoals ? prev.projectGoals : initialSummary,
        message: initialSummary,
      }));
    }
  }, [initialSummary]);

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  // CMS dynamic copy
  const contactContent = content?.contact;
  const globalContent = content?.global;

  const eyebrow = isModal
    ? (contactContent?.modalEyebrow || 'Discuss Your Digital Project')
    : (contactContent?.sectionEyebrow || 'Contact Nexordive');

  const heading = contactContent?.sectionTitle || "Let’s Discuss Your Digital Project";
  const description =
    contactContent?.sectionDescription ||
    'Tell us what you want to create or improve. Whether you need a website, online store, brand identity, marketing support, business automation or custom software, a clear project brief helps us discuss the right next steps.';

  const directHeading = contactContent?.directHeading || 'Direct Communication';
  const directDescription =
    contactContent?.directDescription ||
    'Prefer an immediate conversation? Reach out directly via WhatsApp for quick scoping, or email us your comprehensive RFP.';

  // Canonical phone & email with strict validation to prevent broken links
  const displayPhone =
    globalContent?.whatsappNumber !== undefined && globalContent.whatsappNumber !== ''
      ? globalContent.whatsappNumber
      : '+92 314 600 9810';
  const waAgencyResult = normalizeWhatsAppNumber(displayPhone);
  const whatsappUrl =
    waAgencyResult.valid && waAgencyResult.normalized
      ? `https://wa.me/${waAgencyResult.normalized}?text=Hello%20Nexordive,%20I%20would%20like%20to%20discuss%20a%20new%20project.`
      : undefined;

  const displayEmail =
    globalContent?.contactEmail !== undefined && globalContent.contactEmail !== ''
      ? globalContent.contactEmail
      : 'hello@nexordive.com';
  const emailAgencyResult = validateEmail(displayEmail);
  const emailUrl =
    emailAgencyResult.valid && emailAgencyResult.sanitizedEmail
      ? `mailto:${emailAgencyResult.sanitizedEmail}?subject=Project%20Inquiry%20via%20Nexordive`
      : undefined;

  const responseGuarantee = contactContent?.responseGuarantee || 'Prompt Scoping Turnaround';
  const ndaGuarantee = contactContent?.ndaGuarantee || 'Mutual Confidentiality & IP Protection';
  const successMessage =
    contactContent?.successMessage ||
    'Thank you for reaching out. Your project inquiry has been received. We will review the information provided and respond using your selected contact details.';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required';
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      newErrors.email = emailCheck.error || 'Valid business email is required';
    }

    if (!formData.projectGoals.trim() && !formData.message?.trim()) {
      newErrors.projectGoals = 'Please briefly outline what you want to create or improve';
    }

    if (formData.whatsapp && formData.whatsapp.trim()) {
      const waCheck = normalizeWhatsAppNumber(formData.whatsapp);
      if (!waCheck.valid) {
        newErrors.whatsapp = waCheck.error || 'Valid phone number with country code is required';
      }
    }

    if (!formData.consent) {
      newErrors.consent = 'Please confirm your consent to be contacted regarding this inquiry';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSuccessSubmit) {
        const result = await onSuccessSubmit(formData);
        if (result && typeof result === 'object' && result.success === false) {
          setSubmitError(result.error || 'Failed to submit inquiry. Please check your network and try again.');
          setIsSubmitting(false);
          return;
        }
        const assignedId =
          result && typeof result === 'object' && result.id
            ? result.id
            : `NXD-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmittedId(assignedId);
        setIsSubmitted(true);
      } else {
        // Fallback: save directly via AdminStore
        const notesCompiled = [
          formData.projectGoals ? `Project Goals: ${formData.projectGoals}` : '',
          formData.requiredFeatures ? `Required Features: ${formData.requiredFeatures}` : '',
          formData.preferredTimeline ? `Timeline: ${formData.preferredTimeline}` : '',
          formData.message && formData.message !== formData.projectGoals ? `Notes: ${formData.message}` : '',
        ]
          .filter(Boolean)
          .join(' | ');

        const result = addLead({
          name: formData.name,
          whatsapp: formData.whatsapp || 'Not provided',
          email: formData.email,
          service: formData.service,
          budget: formData.budget || 'Exploring',
          status: 'New',
          notes: notesCompiled || 'Direct lead captured from website contact form.',
          projectGoals: formData.projectGoals,
          requiredFeatures: formData.requiredFeatures,
          preferredTimeline: formData.preferredTimeline,
        });

        if (result && !result.success) {
          setSubmitError(result.error || 'Failed to record inquiry locally. Please try again.');
          setIsSubmitting(false);
          return;
        }
        setSubmittedId(result?.id || `NXD-${Math.floor(100000 + Math.random() * 900000)}`);
        setIsSubmitted(true);
        trackLeadSubmission({
          service: formData.service,
          budget: formData.budget,
          preferredTimeline: formData.preferredTimeline,
        });
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err?.message || 'An unexpected error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      service: 'Web Development',
      projectGoals: '',
      requiredFeatures: '',
      budget: 'Exploring / Open to recommendation',
      preferredTimeline: 'Flexible / Planning Phase',
      consent: false,
      message: '',
    });
    setErrors({});
  };

  const contentElement = (
    <div className="w-full">
      {/* Section Header */}
      {!hideHeader && (
        <div className={`max-w-2xl ${isModal ? 'mb-8' : 'mb-14'}`}>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0d5363] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight text-balance">
            {heading}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed font-normal">
            {description}
          </p>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Side: Contact Information Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-sm">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#0d5363] font-semibold block mb-1">
                Direct Channels
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">
                {directHeading}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                {directDescription}
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              {/* WhatsApp */}
              <a
                href={whatsappUrl || '#'}
                onClick={(e) => {
                  if (!whatsappUrl) {
                    e.preventDefault();
                  } else {
                    trackContactClick('whatsapp', displayPhone);
                  }
                }}
                aria-disabled={!whatsappUrl}
                target={whatsappUrl ? '_blank' : undefined}
                rel={whatsappUrl ? 'noopener noreferrer' : undefined}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 hover:border-emerald-300 transition-all group ${!whatsappUrl ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>WhatsApp Direct</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-950 font-mono tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {displayPhone}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              {/* Email */}
              <a
                href={emailUrl || '#'}
                onClick={(e) => {
                  if (!emailUrl) {
                    e.preventDefault();
                  } else {
                    trackContactClick('email', displayEmail);
                  }
                }}
                aria-disabled={!emailUrl}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-cyan-50/60 hover:bg-cyan-100/70 border border-cyan-200/80 hover:border-cyan-300 transition-all group ${!emailUrl ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#004d6a] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#004d6a]">
                    Official Inquiries & RFP
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-950 font-mono tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {displayEmail}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#004d6a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            </div>

            {/* Trust Guarantees */}
            <div className="pt-5 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#004d6a] shrink-0" />
                <span className="font-medium">{responseGuarantee}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{ndaGuarantee}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="font-medium">Direct review with staff engineers and designers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Modern Brief Form */}
        <div className="lg:col-span-7">
          <div
            id="contact-form"
            className="p-6 sm:p-9 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 relative scroll-mt-32 transition-all"
          >
            {isSubmitted ? (
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-[#004d6a] tracking-wider block mb-1 font-semibold">
                    Inquiry Received · {submittedId}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-950">
                    Thank you, {formData.name}!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                    {successMessage}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Selected Service:</span>
                    <span className="text-slate-900 font-medium">{formData.service}</span>
                  </div>
                  {formData.budget && (
                    <div className="flex justify-between">
                      <span>Estimated Budget:</span>
                      <span className="text-slate-900 font-medium">{formData.budget}</span>
                    </div>
                  )}
                  {formData.preferredTimeline && (
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span className="text-slate-900 font-medium">{formData.preferredTimeline}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Contact Email:</span>
                    <span className="text-[#004d6a] font-bold">{formData.email}</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* 1. Name & Business Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <User className="w-3.5 h-3.5 text-[#004d6a]" />
                      <span>Name</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 transition-all ${
                        errors.name ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <Mail className="w-3.5 h-3.5 text-[#004d6a]" />
                      <span>Business Email</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 transition-all ${
                        errors.email ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* 2. Service & Estimated Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="service" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#004d6a]" />
                      <span>Service</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 text-sm text-slate-900 focus:outline-none transition-all cursor-pointer font-medium"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Graphic Design & Branding">Graphic Design & Branding</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="AI Automation">AI Automation</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="SaaS Development">SaaS Development</option>
                        <option value="Shopify Development">Shopify Development</option>
                        <option value="Streamer Assets">Streamer Assets</option>
                        <option value="Other Digital Solution">Other Digital Solution</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Estimated Budget (Optional)</span>
                    </label>
                    <div className="relative">
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 text-sm text-slate-900 focus:outline-none transition-all cursor-pointer font-medium"
                      >
                        <option value="Exploring / Open to recommendation">Exploring / Open to recommendation</option>
                        <option value="$300 – $699 (Starter / Growth Kit)">$300 – $699 (Starter / Growth Kit)</option>
                        <option value="$700 – $1,500 (Pro Launch)">$700 – $1,500 (Pro Launch)</option>
                        <option value="$1,500 – $5,000 (Standard MVP / Build)">$1,500 – $5,000 (Standard MVP / Build)</option>
                        <option value="$5,000+ (Custom Enterprise)">$5,000+ (Custom Enterprise)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Preferred Timeline & WhatsApp (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="preferredTimeline" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#004d6a]" />
                      <span>Preferred Timeline</span>
                    </label>
                    <div className="relative">
                      <select
                        id="preferredTimeline"
                        name="preferredTimeline"
                        value={formData.preferredTimeline}
                        onChange={handleChange}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 text-sm text-slate-900 focus:outline-none transition-all cursor-pointer font-medium"
                      >
                        <option value="Flexible / Planning Phase">Flexible / Planning Phase</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="1 – 3 Months">1 – 3 Months</option>
                        <option value="Urgent (< 2 weeks)">Urgent (&lt; 2 weeks)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp / Phone (Optional)</span>
                    </label>
                    <input
                      id="whatsapp"
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp || ''}
                      onChange={handleChange}
                      placeholder="+92 314 600 9810 or international format"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 transition-all ${
                        errors.whatsapp ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.whatsapp && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.whatsapp}</p>
                    )}
                  </div>
                </div>

                {/* 4. Project Goals */}
                <div>
                  <label htmlFor="projectGoals" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <Target className="w-3.5 h-3.5 text-[#004d6a]" />
                    <span>Project Goals</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="projectGoals"
                    name="projectGoals"
                    rows={3}
                    value={formData.projectGoals}
                    onChange={handleChange}
                    placeholder="Tell us what you want to create or improve: business objectives, target audience, or current problems..."
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 transition-all resize-y min-h-[85px] ${
                      errors.projectGoals ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {errors.projectGoals && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.projectGoals}</p>
                  )}
                </div>

                {/* 5. Required Features */}
                <div>
                  <label htmlFor="requiredFeatures" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <FileText className="w-3.5 h-3.5 text-[#004d6a]" />
                    <span>Required Features (Optional)</span>
                  </label>
                  <input
                    id="requiredFeatures"
                    type="text"
                    name="requiredFeatures"
                    value={formData.requiredFeatures || ''}
                    onChange={handleChange}
                    placeholder="e.g. Member login, Stripe subscriptions, multilingual, CRM sync..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 transition-all"
                  />
                </div>

                {/* 6. Consent to be contacted */}
                <div>
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 rounded text-[#004d6a] border-slate-300 focus:ring-[#004d6a] cursor-pointer"
                    />
                    <span>
                      I agree to be contacted by Nexordive regarding this project inquiry.{' '}
                      <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium pl-6">{errors.consent}</p>
                  )}
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-8 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#004d6a] via-[#0d5363] to-[#093c47] hover:from-[#093c47] hover:to-[#06242c] active:scale-[0.99] rounded-xl shadow-lg shadow-[#004d6a]/25 hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 group"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Your Project Brief...</span>
                      </div>
                    ) : (
                      <>
                        <span>Discuss Your Digital Project</span>
                        <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500 font-medium">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Strictly confidential · We respond promptly using your selected contact details</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return contentElement;
  }

  return (
    <section id="contact" className={`py-20 md:py-28 relative bg-[#f8fafc] ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {contentElement}
      </div>
    </section>
  );
};
