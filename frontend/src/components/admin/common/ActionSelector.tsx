'use client';

import React, { useState } from 'react';
import { COMMON_ACTION_OPTIONS } from '../../../utils/actionHandler';

interface ActionSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  className?: string;
}

export const ActionSelector: React.FC<ActionSelectorProps> = ({
  label,
  value,
  onChange,
  helperText,
  className = '',
}) => {
  const isPreset = COMMON_ACTION_OPTIONS.some((opt) => opt.value === value);
  const [isCustomMode, setIsCustomMode] = useState(!isPreset && value !== '');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__custom__') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      onChange(selected);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <div className="space-y-2">
        <select
          value={isCustomMode ? '__custom__' : value}
          onChange={handleSelectChange}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
        >
          <optgroup label="Standard Actions">
            {COMMON_ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </option>
            ))}
          </optgroup>
          <optgroup label="Custom">
            <option value="__custom__">Custom URL, Email or In-Page Anchor...</option>
          </optgroup>
        </select>

        {isCustomMode && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. #services, https://example.com, or mailto:info@site.com"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-indigo-200 bg-indigo-50/20 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        )}
      </div>

      {helperText && (
        <span className="text-[11px] text-slate-400 block">{helperText}</span>
      )}
    </div>
  );
};
