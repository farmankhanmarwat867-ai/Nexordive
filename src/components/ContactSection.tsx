import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, Mail, MessageSquare, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { LeadFormData } from '../types/agency';
import { validateLeadForm } from '../utils/estimator';

interface ContactSectionProps {
  initialSummary?: string;
  onSuccessSubmit?: (data: LeadFormData) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialSummary = '',
  onSuccessSubmit,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    company: '',
    serviceCategory: 'Full Product Design & Engineering',
    budgetRange: '$50,000 – $100,000',
    timeline: 'Within 4 – 8 weeks',
    message: initialSummary,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    // Simulate real network submission with realistic latency
    setTimeout(() => {
      const generatedId = `NXD-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedInquiryId(generatedId);
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
      fullName: '',
      email: '',
      company: '',
      serviceCategory: 'Full Product Design & Engineering',
      budgetRange: '$50,000 – $100,000',
      timeline: 'Within 4 – 8 weeks',
      message: '',
    });
    setErrors({});
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative border-t border-white/[0.07] bg-[#07090F]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Start a Conversation
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight text-balance">
              Let's engineer your next breakthrough.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Whether you need to build an ambitious zero-to-one product, redesign a complex SaaS platform, or deploy custom autonomous AI agents, we are ready.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    24-Hour Technical Response
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every inquiry is reviewed directly by a Principal Engineer or Design Partner.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Mutual NDA Standard
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your intellectual property, product ideas, and proprietary roadmap remain fully protected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-600/10 text-violet-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Direct Partner Inquiries
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prefer direct email? Reach us at <span className="text-indigo-300 font-mono">partners@nexordive.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form or Success State */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0D111C] border border-white/10 shadow-2xl relative">
              {isSubmitted ? (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase text-indigo-400 tracking-wider block mb-1">
                      Inquiry Received · {submittedInquiryId}
                    </span>
                    <h3 className="text-2xl font-bold text-white font-display">
                      Thank you, {formData.fullName}!
                    </h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                      We have logged your product brief for <span className="text-white font-semibold">{formData.company}</span>. A Principal Partner will contact you at <span className="text-white font-semibold">{formData.email}</span> within 24 hours with an initial architecture breakdown.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left text-xs space-y-2 max-w-md mx-auto font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="text-slate-200">{formData.serviceCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Budget:</span>
                      <span className="text-slate-200">{formData.budgetRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span className="text-slate-200">{formData.timeline}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Your Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Sophia Laurent"
                        className={`w-full px-4 py-3 rounded-xl bg-[#090C14] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                          errors.fullName ? 'border-rose-500' : 'border-white/10 hover:border-white/20'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Work Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sophia@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#090C14] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                          errors.email ? 'border-rose-500' : 'border-white/10 hover:border-white/20'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Company or Startup Name *
                      </label>
                      <input
                        id="company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Technologies"
                        className={`w-full px-4 py-3 rounded-xl bg-[#090C14] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                          errors.company ? 'border-rose-500' : 'border-white/10 hover:border-white/20'
                        }`}
                      />
                      {errors.company && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.company}</p>
                      )}
                    </div>

                    {/* Service Category */}
                    <div>
                      <label htmlFor="serviceCategory" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Primary Capability Needed
                      </label>
                      <select
                        id="serviceCategory"
                        name="serviceCategory"
                        value={formData.serviceCategory}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#090C14] border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                      >
                        <option value="Full Product Design & Engineering">Full Product Design & Engineering</option>
                        <option value="High-Performance Web Engineering">High-Performance Web Engineering</option>
                        <option value="Product Architecture & UI/UX Systems">Product Architecture & UI/UX Systems</option>
                        <option value="Applied AI & Neural Workflows">Applied AI & Neural Workflows</option>
                        <option value="Brand Strategy & Interactive Motion">Brand Strategy & Interactive Motion</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Budget Tier */}
                    <div>
                      <label htmlFor="budgetRange" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Estimated Budget *
                      </label>
                      <select
                        id="budgetRange"
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-[#090C14] border text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer ${
                          errors.budgetRange ? 'border-rose-500' : 'border-white/10'
                        }`}
                      >
                        <option value="$25,000 – $50,000">$25,000 – $50,000 (MVP Sprint)</option>
                        <option value="$50,000 – $100,000">$50,000 – $100,000 (Standard Product Build)</option>
                        <option value="$100,000 – $200,000">$100,000 – $200,000 (Enterprise Scale)</option>
                        <option value="$200,000+">$200,000+ (Multi-Platform / Retainer)</option>
                      </select>
                      {errors.budgetRange && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.budgetRange}</p>
                      )}
                    </div>

                    {/* Timeline */}
                    <div>
                      <label htmlFor="timeline" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Desired Launch Cadence
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#090C14] border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                      >
                        <option value="Immediate (Within 4 weeks)">Immediate (Within 4 weeks)</option>
                        <option value="Within 4 – 8 weeks">Within 4 – 8 weeks</option>
                        <option value="Within 2 – 4 months">Within 2 – 4 months</option>
                        <option value="Flexible / Exploration">Flexible / Exploration</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Project Goals & Requirements *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what you are building, key technical challenges, and what success looks like for this engagement..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#090C14] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                        errors.message ? 'border-rose-500' : 'border-white/10 hover:border-white/20'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Brief...</span>
                      ) : (
                        <>
                          <span>Schedule Discovery Call</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-3">
                      Protected under standard Mutual NDA. No obligation or spam.
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
