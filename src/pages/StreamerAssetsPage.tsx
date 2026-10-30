'use client';

import React from 'react';
import { StreamerAssets } from '../components/StreamerAssets';

interface StreamerAssetsPageProps {
  onNavigateHome?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const StreamerAssetsPage: React.FC<StreamerAssetsPageProps> = ({
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC] pt-12 sm:pt-16">
      {/* Streamer Assets Showcase */}
      <StreamerAssets
        onInquirePackage={(packageName) =>
          onOpenContactWithSummary(`Streamer Pack Inquiry: ${packageName}`)
        }
      />
    </div>
  );
};
