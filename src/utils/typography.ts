import React from 'react';

export interface TextSizeOption {
  value: string;
  label: string;
  className: string;
  fontSize?: string;
  lineHeight?: string;
}

export const HEADLINE_SIZE_OPTIONS: TextSizeOption[] = [
  { value: 'default', label: 'Default Responsive', className: '', fontSize: undefined, lineHeight: undefined },
  { value: 'xs', label: 'XS — 18px', className: 'text-lg', fontSize: '1.125rem', lineHeight: '1.5rem' },
  { value: 'sm', label: 'SM — 24px', className: 'text-2xl', fontSize: '1.5rem', lineHeight: '2rem' },
  { value: 'md', label: 'MD — 30px', className: 'text-3xl', fontSize: '1.875rem', lineHeight: '2.25rem' },
  { value: 'lg', label: 'LG — 36px', className: 'text-4xl', fontSize: '2.25rem', lineHeight: '2.5rem' },
  { value: 'xl', label: 'XL — 44px', className: 'text-5xl', fontSize: '2.75rem', lineHeight: '1.1' },
  { value: '2xl', label: '2XL — 52px', className: 'text-5xl lg:text-6xl', fontSize: '3.25rem', lineHeight: '1.08' },
  { value: '3xl', label: '3XL — 64px', className: 'text-6xl lg:text-7xl', fontSize: '4rem', lineHeight: '1.05' },
  { value: '4xl', label: '4XL — 76px', className: 'text-7xl lg:text-8xl', fontSize: '4.75rem', lineHeight: '1.04' },
  { value: '5xl', label: '5XL — 92px', className: 'text-8xl lg:text-9xl', fontSize: '5.75rem', lineHeight: '1' },
];

export const PARAGRAPH_SIZE_OPTIONS: TextSizeOption[] = [
  { value: 'default', label: 'Default Responsive', className: '', fontSize: undefined, lineHeight: undefined },
  { value: 'xs', label: 'XS — 12px', className: 'text-xs', fontSize: '0.75rem', lineHeight: '1rem' },
  { value: 'sm', label: 'SM — 14px', className: 'text-sm', fontSize: '0.875rem', lineHeight: '1.25rem' },
  { value: 'base', label: 'Base — 16px', className: 'text-base', fontSize: '1rem', lineHeight: '1.5rem' },
  { value: 'lg', label: 'MD — 18px', className: 'text-lg', fontSize: '1.125rem', lineHeight: '1.75rem' },
  { value: 'xl', label: 'LG — 20px', className: 'text-xl', fontSize: '1.25rem', lineHeight: '1.75rem' },
  { value: '2xl', label: 'XL — 24px', className: 'text-2xl', fontSize: '1.5rem', lineHeight: '2rem' },
];

export function getHeadlineSizeClass(size?: string, fallbackClass: string = ''): string {
  if (!size || size === 'default') return fallbackClass;
  const match = HEADLINE_SIZE_OPTIONS.find((opt) => opt.value === size);
  return match?.className || fallbackClass;
}

export function getHeadlineStyle(size?: string): React.CSSProperties {
  if (!size || size === 'default') return {};
  const match = HEADLINE_SIZE_OPTIONS.find((opt) => opt.value === size);
  if (!match || !match.fontSize) return {};
  return {
    fontSize: match.fontSize,
    lineHeight: match.lineHeight || '1.1',
  };
}

export function getParagraphSizeClass(size?: string, fallbackClass: string = ''): string {
  if (!size || size === 'default') return fallbackClass;
  const match = PARAGRAPH_SIZE_OPTIONS.find((opt) => opt.value === size);
  return match?.className || fallbackClass;
}

export function getParagraphStyle(size?: string): React.CSSProperties {
  if (!size || size === 'default') return {};
  const match = PARAGRAPH_SIZE_OPTIONS.find((opt) => opt.value === size);
  if (!match || !match.fontSize) return {};
  return {
    fontSize: match.fontSize,
    lineHeight: match.lineHeight || '1.6',
  };
}
