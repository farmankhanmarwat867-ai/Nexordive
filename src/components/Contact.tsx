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
} from 'lucide-react';

export interface ContactFormData {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  budget: string;
  message: string;
}

export interface ContactProps {
  initialSummary?: string;
  onSuccessSubmit?: (data: ContactFormData) => void;
  className?: string;
  isModal?: boolean;
}

export const Contact: React.FC<ContactProps> = ({
  initialSummary = '',
  onSuccessSubmit,
  className = '',
  isModal = false,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    whatsapp: '',
    service: 'Web Development',
    budget: '$300 – $699 (Growth Kit)',
    message: initialSummary,
  });

  useEffect(() => {
    if (initialSummary) {
      setFormData((prev) => ({ ...prev, message: initialSummary }));
    }
  }, [initialSummary]);

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Valid work email is required';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `NXD-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedId(generatedId);
      setIsSubmitted(true);
      setIsSubmitting(false);
      if (onSuccessSubmit) {
        onSuccessSubmit(formData);
      }
    }, 450);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      service: 'Web Development',
      budget: '$300 – $699 (Growth Kit)',
      message: '',
    });
    setErrors({});
  };

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className={`max-w-2xl ${isModal ? 'mb-8' : 'mb-14'}`}>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#0d5363] mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0d5363]" />
          <span>{isModal ? 'Quick Scoping & Inquiry' : 'Get In Touch'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight text-balance">
          Let's start your project.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed font-normal">
          Have an idea for high-performance software, modern web platforms, mobile apps, or custom AI automation? Connect directly below for guaranteed 24-hour turnaround.
        </p>
      </div>

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
                Direct Communication
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                Prefer an immediate conversation? Reach out directly via WhatsApp for quick scoping, or email us your comprehensive RFP.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              {/* WhatsApp */}
              <a
                href="https://wa.me/923146009810?text=Hello%20NexorDive,%20I%20would%20like%20to%20discuss%20a%20new%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 hover:border-emerald-300 transition-all group"
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
                    +92 314 600 9810
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              {/* Email */}
              <a
                href="mailto:hello@nexordive.com?subject=Project%20Inquiry%20via%20NexorDive"
                className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-cyan-50/60 hover:bg-cyan-100/70 border border-cyan-200/80 hover:border-cyan-300 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#004d6a] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#004d6a]">
                    Official RFP & Inquiries
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-950 font-mono tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    hello@nexordive.com
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#004d6a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            </div>

            {/* Trust Guarantees */}
            <div className="pt-5 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#004d6a] shrink-0" />
                <span className="font-medium">24-Hour Technical Review Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Mutual NDA Protection for all client briefs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="font-medium">Direct communication with principal engineers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Modern Form */}
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
                    We have received your project details for <span className="text-slate-950 font-semibold">{formData.service}</span>. Our engineering team will contact you on WhatsApp (<span className="text-slate-950 font-mono font-medium">{formData.whatsapp}</span>) or email within 24 hours.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="text-slate-900 font-medium">{formData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span className="text-slate-900 font-medium">{formData.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WhatsApp:</span>
                    <span className="text-emerald-700 font-bold">{formData.whatsapp}</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <User className="w-3.5 h-3.5 text-[#004d6a]" />
                      <span>Your Name</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 transition-all ${
                        errors.name ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <Mail className="w-3.5 h-3.5 text-[#004d6a]" />
                      <span>Email Address</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 transition-all ${
                        errors.email ? 'border-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp / Phone Number</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Service Dropdown */}
                  <div>
                    <label htmlFor="service" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#004d6a]" />
                      <span>Service *</span>
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 text-sm text-slate-900 focus:outline-none transition-all cursor-pointer font-medium"
                      >
                        <option value="Web Development">Web & Cloud Apps</option>
                        <option value="Software Development">Custom Software</option>
                        <option value="Mobile App Development">Mobile Apps (iOS & Android)</option>
                        <option value="AI Automation">AI Agents & Automation</option>
                        <option value="Branding">UI/UX & Brand Design</option>
                        <option value="Streamer Assets">Streamer Graphics & Hub</option>
                        <option value="Digital Marketing">Growth Marketing & SEO</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Budget Dropdown */}
                  <div>
                    <label htmlFor="budget" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Budget Range *</span>
                    </label>
                    <div className="relative">
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 text-sm text-slate-900 focus:outline-none transition-all cursor-pointer font-medium"
                      >
                        <option value="$300 – $699 (Growth Kit)">$300 – $699 (Growth Kit)</option>
                        <option value="$99 – $299 (Starter Website)">$99 – $299 (Starter Website)</option>
                        <option value="$700 – $1,500 (Pro Launch)">$700 – $1,500 (Pro Launch)</option>
                        <option value="$1,500 – $5,000 (Standard MVP)">$1,500 – $5,000 (Standard MVP)</option>
                        <option value="$5,000+ (Custom Enterprise)">$5,000+ (Custom Enterprise)</option>
                        <option value="$49 – $129 (Streamer Pack)">$49 – $129 (Streamer Pack)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message (Optional / Notes) */}
                <div>
                  <label htmlFor="message" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <FileText className="w-3.5 h-3.5 text-[#004d6a]" />
                    <span>Project Notes (Optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us any specific requirements, deadlines, or design preferences..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#004d6a] focus:ring-4 focus:ring-[#004d6a]/10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-y min-h-[85px]"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-8 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#004d6a] via-[#0d5363] to-[#093c47] hover:from-[#093c47] hover:to-[#06242c] active:scale-[0.99] rounded-xl shadow-lg shadow-[#004d6a]/25 hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 group"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </div>
                    ) : (
                      <>
                        <span>Submit Project Request</span>
                        <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500 font-medium">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Strictly confidential · We reply via WhatsApp or email within 24 hours</span>
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
    return content;
  }

  return (
    <section id="contact" className={`py-20 md:py-28 relative bg-[#f8fafc] ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {content}
      </div>
    </section>
  );
};