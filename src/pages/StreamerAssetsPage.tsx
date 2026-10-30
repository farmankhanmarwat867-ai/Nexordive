'use client';

import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { StreamerAssets } from '../components/StreamerAssets';

interface StreamerAssetsPageProps {
  onNavigateHome: () => void;
  onOpenContactWithSummary: (summary: string) => void;
}

export const StreamerAssetsPage: React.FC<StreamerAssetsPageProps> = ({
  onNavigateHome,
  onOpenContactWithSummary,
}) => {
  return (
    <div className="flex-1">
      {/* Page Header Banner */}
      <PageHeader
        badge="Creators & Esports Hub"
        title="Broadcast-Ready Creator & Streamer Graphics"
        description="Elevate your livestream into an unforgettable visual spectacle. We engineer custom animated overlays, 60fps WebM stingers, interactive alerts, and visual identities across Twitch, Kick, YouTube, and VTubing."
        currentPage="Streamer Assets"
        onNavigateHome={onNavigateHome}
      />

      {/* Streamer Assets Showcase */}
      <StreamerAssets
        onInquirePackage={(packageName) =>
          onOpenContactWithSummary(`Streamer Pack Inquiry: ${packageName}`)
        }
      />
    </div>
  );
};
