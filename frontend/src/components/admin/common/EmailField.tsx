'use client';

import React, { useId } from 'react';
import { Mail, AlertCircle } from 'lucide-react';

interface EmailFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete?: 'username' | 'email';
  placeholder?: string;
  required?: boolean;
  enterKeyHint?: 'next' | 'done';
  hint?: string;
  error?: string | null;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
}

/**
 * Accessible email identifier input with format hint above the field,
 * disabled prose autocorrection, and post-interaction error reporting.
 */
export const EmailField: React.FC<EmailFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  autoComplete = 'username',
  placeholder = 'manager@nexordive.com',
  required = true,
  enterKeyHint = 'next',
  hint,
  error,
  inputRef,
  className = '',
}) => {
  const autoId = useId();
  const hintId = hint ? `${id}-hint-${autoId}` : undefined;
  const errorId = `${id}-error-${autoId}`;
  const describedByIds = [hintId, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono"
      >
        {label} {required && <span className="text-rose-600" aria-hidden="true">*</span>}
      </label>

      {hint && (
        <span id={hintId} className="block text-[11px] text-slate-500 mb-1.5">
          {hint}
        </span>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          required={required}
          enterKeyHint={enterKeyHint}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedByIds}
          className={`w-full min-h-12 pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border text-base sm:text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004d6a]/20 focus:border-[#004d6a] transition-colors ${
            error ? 'border-rose-400 bg-rose-50/40 user-invalid-fallback' : 'border-slate-200'
          }`}
        />
        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
