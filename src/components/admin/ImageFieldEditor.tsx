'use client';

import React, { useState, useRef } from 'react';
import { PRESET_PROJECT_ASSETS, compressAndEncodeImage, isValidUrl } from '../../services/contentRepository';
import { Image as ImageIcon, Upload, Folder, Check, AlertCircle, ChevronDown, ChevronUp, Link2 } from 'lucide-react';

interface ImageFieldEditorProps {
  label: string;
  imageSrc: string;
  imageAlt?: string;
  onChange: (src: string, alt?: string) => void;
  helperText?: string;
}

export const ImageFieldEditor: React.FC<ImageFieldEditorProps> = ({
  label,
  imageSrc,
  imageAlt = '',
  onChange,
  helperText,
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [customUrl, setCustomUrl] = useState(imageSrc.startsWith('http') || imageSrc.startsWith('/') ? imageSrc : '');
  const [altText, setAltText] = useState(imageAlt);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyPreset = (presetPath: string, presetLabel: string) => {
    onChange(presetPath, altText || presetLabel);
    setShowPresets(false);
  };

  const handleApplyUrl = () => {
    if (!isValidUrl(customUrl)) {
      setUploadError('Please enter a valid web image URL (starts with https:// or /assets/...)');
      return;
    }
    setUploadError(null);
    onChange(customUrl, altText);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    try {
      // Downscale and compress to compact format for smooth storage
      const dataUrl = await compressAndEncodeImage(file, 800, 0.75);
      onChange(dataUrl, altText || file.name.replace(/\.[^/.]+$/, ''));
    } catch (err: any) {
      setUploadError('Image could not be saved. Please try a smaller image file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAltChange = (newAlt: string) => {
    setAltText(newAlt);
    onChange(imageSrc, newAlt);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800">
          {label}
        </label>
      </div>

      {helperText && (
        <p className="text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {/* Main Image Preview & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-white border border-slate-200">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={altText || 'Current image'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/khyber/logo.png';
                }}
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-800 block truncate">
              {altText || 'Active Website Image'}
            </span>
            <span className="text-[11px] text-slate-500 block truncate">
              {imageSrc ? (imageSrc.startsWith('data:') ? 'Custom uploaded image' : imageSrc) : 'No image chosen'}
            </span>
          </div>
        </div>

        {/* Change Image Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Processing...' : 'Upload Image'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Folder className="w-3.5 h-3.5 text-slate-500" />
            <span>Library</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preset Library Picker Drawer */}
      {showPresets && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Choose from Website Assets</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1">
            {PRESET_PROJECT_ASSETS.map((asset) => {
              const isSelected = imageSrc === asset.path;
              return (
                <button
                  key={asset.path}
                  type="button"
                  onClick={() => handleApplyPreset(asset.path, asset.label)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="w-full h-16 rounded-lg bg-white overflow-hidden flex items-center justify-center border border-slate-100">
                    <img
                      src={asset.path}
                      alt={asset.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 truncate w-full text-center">
                    {asset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Collapsible More Options: Image Description (Alt) & URL */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium cursor-pointer"
        >
          {showMoreOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showMoreOptions ? 'Hide options' : 'More options (description & web link)'}</span>
        </button>

        {showMoreOptions && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Image description
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Brief description for accessibility and screen readers"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Or paste web image link (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  Apply Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
