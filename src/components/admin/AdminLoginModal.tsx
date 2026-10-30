'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('Please enter your email.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(cleanEmail);
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-200/90 text-slate-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Logo & Heading */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center tracking-widest text-[#0d5363] font-extrabold text-xl font-mono select-none mb-3">
            <span className="text-[#0d5363] font-bold">&lt;</span>
            <span className="tracking-widest">NEXOR</span>
            <span className="mx-1 text-slate-400 font-normal">|</span>
            <span className="tracking-widest">DIVE</span>
            <span className="text-[#0d5363] font-bold">&gt;</span>
          </div>

          <h2 className="text-2xl font-bold font-serif text-slate-900">
            Login
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form: ONLY Email & Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0d5363] focus:ring-2 focus:ring-[#0d5363]/20 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#0d5363] focus:ring-2 focus:ring-[#0d5363]/20 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Button: JUST "Login" */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-5 rounded-xl bg-[#0d5363] hover:bg-[#0a424f] text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#0d5363]/25 transition-all flex items-center justify-center cursor-pointer active:scale-[0.98] disabled:opacity-75"
          >
            {isLoading ? '...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
