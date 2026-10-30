'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  budget: string;
  message: string;
}

interface ContactProps {
  initialSummary?: string;
  onSuccessSubmit?: (data: ContactFormData) => void;
}

export const Contact: React.FC<ContactProps> = ({
  initialSummary = '',
  onSuccessSubmit,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    whatsapp: '',
    service: 'Web Development',
    budget: '$300 – $699 (Pro Digital Kit)',
    message: initialSummary,
  });

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
    }, 400);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      service: 'Web Development',
      budget: '$300 – $699 (Pro Digital Kit)',
      message: '',
    });
    setErrors({});
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative border-t border-slate-200 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0d5363] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d5363]" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight text-balance">
            Let's start your project.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            Have an idea for a web platform, mobile app, branding system, or custom IT solutions? Reach out directly or fill in the form below.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Side: Contact Information (Email, WhatsApp +92 314 600 9810) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950 font-display">
                Direct Contact Channels
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with our team directly via WhatsApp for quick scoping chats, or email us your comprehensive RFP.
              </p>

              <div className="space-y-4 pt-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/923146009810?text=Hello%20NexorDive,%20I%20would%20like%20to%20discuss%20a%20new%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/80 hover:border-emerald-200 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 block font-semibold">
                      WhatsApp Direct Chat
                    </span>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-mono">
                      +92 314 600 9810
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </a>

                {/* Email */}
                <a
                  href="mailto:hello@nexordive.com?subject=Project%20Inquiry%20via%20NexorDive"
                  className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/80 hover:border-indigo-200 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 block font-semibold">
                      Email Inquiries
                    </span>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate block">
                      hello@nexordive.com
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </a>
              </div>

              {/* Trust Guarantees */}
              <div className="pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>24-Hour Technical Review Guarantee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mutual NDA Protection for all briefs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Modern Form */}
          <div className="lg:col-span-7">
            <div
              id="contact-form"
              className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xl relative scroll-mt-32 transition-all"
            >
              {isSubmitted ? (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase text-indigo-600 tracking-wider block mb-1 font-semibold">
                      Inquiry Received · {submittedId}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-950 font-display">
                      Thank you, {formData.name}!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                      We have received your project details for <span className="text-slate-950 font-semibold">{formData.service}</span>. Our team will contact you on WhatsApp (<span className="text-slate-950 font-mono font-medium">{formData.whatsapp}</span>) or email within 24 hours.
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
                      className="px-6 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                          errors.name ? 'border-rose-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                          errors.email ? 'border-rose-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      id="whatsapp"
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+92 314 600 9810"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                        errors.whatsapp ? 'border-rose-500' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {errors.whatsapp && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.whatsapp}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Service Dropdown */}
                    <div>
                      <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Service *
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Software Development">Software Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Branding">Branding</option>
                        <option value="AI Automation">AI Automation</option>
                        <option value="Streamer Assets">Streamer Assets & Overlays</option>
                      </select>
                    </div>

                    {/* Budget Dropdown */}
                    <div>
                      <label htmlFor="budget" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Budget Range *
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                      >
                        <option value="$49 – $129 (Streamer Pack)">$49 – $129 (Streamer Pack)</option>
                        <option value="$99 – $299 (Starter Website)">$99 – $299 (Starter Website)</option>
                        <option value="$300 – $699 (Pro Digital Kit)">$300 – $699 (Pro Digital Kit)</option>
                        <option value="$1,000 – $5,000 (Standard MVP)">$1,000 – $5,000 (Standard MVP)</option>
                        <option value="$5,000+ (Custom Enterprise)">$5,000+ (Custom Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message (Optional / Notes) */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Project Notes (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us any specific requirements, deadlines, or design preferences..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold text-white bg-[#0d5363] hover:bg-[#093c47] active:scale-98 rounded-full shadow-lg shadow-[#0d5363]/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <span>Submit Project Request</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-500 mt-3">
                      We reply via WhatsApp or email within 24 hours.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
