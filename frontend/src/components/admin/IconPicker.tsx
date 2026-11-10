import React, { useState } from 'react';
import { ICON_MAP } from '../common/DynamicIcon';
import { Search, X, Check } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  label = 'Select Icon',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const iconNames = Object.keys(ICON_MAP);
  const filtered = iconNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const CurrentIcon = ICON_MAP[value] || ICON_MAP['Sparkles'];

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      {/* Button to toggle icon picker */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm hover:border-indigo-500 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CurrentIcon className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-semibold">{value || 'Sparkles'}</span>
        </div>
        <span className="text-xs text-slate-400">Change</span>
      </button>

      {/* Dropdown modal */}
      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 right-0 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 mr-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1">
            {filtered.map((name) => {
              const IconComp = ICON_MAP[name];
              const isSelected = value === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                  title={name}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="text-[9px] font-mono truncate w-full text-center">
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
