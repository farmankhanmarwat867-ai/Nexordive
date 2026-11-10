'use client';

import React, { useState, useId } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { getPasswordStrength } from '../../../services/adminAuth';

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete: 'current-password' | 'new-password';
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  enterKeyHint?: 'next' | 'done';
  error?: string | null;
  hintId?: string;
  aboveHint?: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
}

/**
 * Accessible password input with show/hide toggle, aria-pressed state,
 * and post-interaction error binding.
 */
export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  autoComplete,
  placeholder = '••••••••',
  required = true,
  minLength,
  enterKeyHint = 'done',
  error,
  hintId,
  aboveHint,
  inputRef,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const autoId = useId();
  const errorId = `${id}-error-${autoId}`;
  const warningId = `${id}-toggle-warning-${autoId}`;

  const describedByIds = [hintId, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono"
      >
        {label} {required && <span className="text-rose-600" aria-hidden="true">*</span>}
      </label>

      {aboveHint && <div className="mb-2">{aboveHint}</div>}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          enterKeyHint={enterKeyHint}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedByIds}
          className={`w-full min-h-12 pl-10 pr-12 py-2.5 rounded-xl bg-slate-50 border text-base sm:text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004d6a]/20 focus:border-[#004d6a] transition-colors ${
            error ? 'border-rose-400 bg-rose-50/40 user-invalid-fallback' : 'border-slate-200'
          }`}
        />
        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-pressed={showPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-describedby={warningId}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <span id={warningId} className="visually-hidden">
          Warning: this will display your password on the screen.
        </span>
      </div>

      {error && (
        <div
          id={errorId}
          className="mt-1.5 flex items-start gap-1.5 text-xs text-rose-700 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

interface PasswordRequirementsListProps {
  id: string;
  password: string;
  hasError?: boolean;
}

const STRENGTH_BAR_CLASSES: Record<number, string> = {
  0: 'bg-slate-200 w-0',
  1: 'bg-rose-500 w-1/4',
  2: 'bg-amber-500 w-2/4',
  3: 'bg-cyan-600 w-3/4',
  4: 'bg-emerald-600 w-full',
};

/**
 * Displays password complexity requirements and strength meter above password inputs.
 */
export const PasswordRequirementsList: React.FC<PasswordRequirementsListProps> = ({
  id,
  password,
  hasError = false,
}) => {
  const { score, label, checks } = getPasswordStrength(password);

  const items = [
    { key: 'len', met: checks.minLength, text: 'At least 8 characters' },
    { key: 'letter', met: checks.hasLetter, text: 'At least one letter (A–Z)' },
    { key: 'num', met: checks.hasNumber, text: 'At least one number (0–9)' },
  ];

  return (
    <div
      id={id}
      className={`p-3 rounded-xl border text-[11px] space-y-2 transition-colors ${
        hasError
          ? 'bg-rose-50/70 border-rose-200 text-rose-800'
          : 'bg-slate-50 border-slate-200/80 text-slate-600'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-700">Password requirements</span>
        {password && (
          <span
            className={`font-bold ${
              score >= 4
                ? 'text-emerald-700'
                : score >= 3
                ? 'text-cyan-700'
                : score >= 2
                ? 'text-amber-700'
                : 'text-rose-700'
            }`}
          >
            {label}
          </span>
        )}
      </div>

      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
        <div className={`h-full rounded-full transition-all duration-300 ${STRENGTH_BAR_CLASSES[score]}`} />
      </div>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-1.5">
            {item.met ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            )}
            <span className={item.met ? 'text-emerald-800 font-medium' : undefined}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
