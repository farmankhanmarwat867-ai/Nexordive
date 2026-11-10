import React from 'react';
import { Type } from 'lucide-react';
import { HEADLINE_SIZE_OPTIONS, PARAGRAPH_SIZE_OPTIONS } from '../../../utils/typography';

interface FontSizeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  type?: 'headline' | 'paragraph';
  label?: string;
  className?: string;
}

export const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  value = 'default',
  onChange,
  type = 'headline',
  label = 'Size',
  className = '',
}) => {
  const options = type === 'headline' ? HEADLINE_SIZE_OPTIONS : PARAGRAPH_SIZE_OPTIONS;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
        <Type className="w-3 h-3 text-slate-400" />
        <span>{label}:</span>
      </span>
      <select
        value={value || 'default'}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs transition-colors"
        title="Manage manual text font size"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
