'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { X, AlertCircle, KeyRound, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import {
  verifyAdminLogin,
  validateEmail,
} from '../../services/adminAuth';
import { EmailField } from './common/EmailField';
import { PasswordField } from './common/PasswordField';

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
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const helpPanelId = useId();

  useEffect(() => {
    if (!isOpen) return;
    setPassword('');
    setEmailBlurred(false);
    setPasswordBlurred(false);
    setSubmitted(false);
    setFormError(null);
    setShowHelp(false);
  }, [isOpen]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showEmailValidation = submitted || (emailBlurred && email.length > 0);
  const showPasswordValidation = submitted || (passwordBlurred && password.length > 0);

  const emailError = showEmailValidation ? validateEmail(email) : null;
  const passwordError =
    showPasswordValidation && !password ? 'Please enter your password.' : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError(null);

    if (cooldownSeconds > 0) {
      setFormError(`Too many failed attempts. Please wait ${cooldownSeconds}s before trying again.`);
      return;
    }

    const currentEmailErr = validateEmail(email);
    const currentPasswordErr = !password ? 'Please enter your password.' : null;

    if (currentEmailErr) {
      emailRef.current?.focus();
      return;
    }
    if (currentPasswordErr) {
      passwordRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyAdminLogin(email, password);

      if (!result.success || !result.email) {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setCooldownSeconds(5);
          setFormError('Too many failed sign-in attempts. Please wait 5 seconds and try again.');
        } else {
          setFormError(result.error || 'Invalid admin email or password.');
        }
        passwordRef.current?.focus();
        return;
      }

      setFailedAttempts(0);
      setCooldownSeconds(0);
      setPassword('');
      onLoginSuccess(result.email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-200/90 text-slate-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#004d6a]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Logo & Heading */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center tracking-widest text-[#004d6a] font-extrabold text-xl font-mono select-none mb-2">
            <span className="text-cyan-600 font-bold">&lt;</span>
            <span className="tracking-widest">NEXOR</span>
            <span className="mx-1 text-slate-400 font-normal">|</span>
            <span className="tracking-widest">DIVE</span>
            <span className="text-cyan-600 font-bold">&gt;</span>
          </div>

          <h2 id={headingId} className="text-2xl font-bold font-serif text-slate-900">
            Admin Login
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Authorized access only. Sign in with your admin email and password.
          </p>
        </div>

        {/* Form-level status / error feedback */}
        {formError && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="nexor-auth-form space-y-4">
          <EmailField
            inputRef={emailRef}
            id="admin-login-email"
            name="email"
            label="Admin Email"
            value={email}
            onChange={(val) => {
              setEmail(val);
              if (formError) setFormError(null);
            }}
            onBlur={() => setEmailBlurred(true)}
            autoComplete="username"
            enterKeyHint="next"
            error={emailError}
          />

          <PasswordField
            inputRef={passwordRef}
            id="admin-login-password"
            name="password"
            label="Password"
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (formError) setFormError(null);
            }}
            onBlur={() => setPasswordBlurred(true)}
            autoComplete="current-password"
            enterKeyHint="done"
            error={passwordError}
          />

          <button
            type="submit"
            disabled={isLoading || cooldownSeconds > 0}
            className="w-full min-h-12 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#004d6a] hover:bg-[#093c47] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
          >
            <KeyRound className="w-4 h-4" aria-hidden="true" />
            <span>
              {isLoading
                ? 'Verifying...'
                : cooldownSeconds > 0
                ? `Wait ${cooldownSeconds}s`
                : 'Login as Admin'}
            </span>
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            aria-expanded={showHelp}
            aria-controls={helpPanelId}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#004d6a] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Trouble signing in?</span>
          </button>

          {showHelp && (
            <div
              id={helpPanelId}
              className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 text-left leading-relaxed"
            >
              Only the configured NexorDive administrator can sign in here. Once signed in, you
              can update your login email and password anytime under{' '}
              <strong className="text-slate-800">Website Settings → Account &amp; Security</strong>.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
