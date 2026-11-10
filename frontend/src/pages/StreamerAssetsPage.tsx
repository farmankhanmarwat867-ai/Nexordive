'use client';

import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StreamerAssets } from '../components/StreamerAssets';

interface StreamerAssetsPageProps {
  onNavigateHome?: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const StreamerAssetsPage: React.FC<StreamerAssetsPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1 bg-[#F8FAFC]">
      {/* 1. Page Header with exactly one H1 */}
      <PageHeader
        badge="Dedicated to Creators & Esports"
        title="Streamer Assets & Broadcast Engine"
        description="Elevate your broadcast into an unforgettable visual spectacle. We craft broadcast-grade overlays, animated 60fps stingers, interactive chat alerts, and bespoke branding for top-tier creators across Twitch, Kick, and YouTube Gaming."
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Streamer Assets' },
        ]}
        actions={[
          {
            label: 'Inquire Custom Broadcast Suite',
            onClick: () =>
              onOpenContactWithSummary('Inquiry: Custom Streamer Overlay & Broadcast Suite'),
          },
        ]}
      />

      {/* 2. Streamer Assets Showcase */}
      <StreamerAssets
        onInquirePackage={(packageName) =>
          onOpenContactWithSummary(`Streamer Pack Inquiry: ${packageName}`)
        }
      />
    </div>
  );
};
