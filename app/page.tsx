'use client';

import React from 'react';
import { Navbar } from '../src/components/Navbar';
import { Hero } from '../src/components/Hero';
import { Services } from '../src/components/Services';
import { StreamerAssets } from '../src/components/StreamerAssets';
import { Pricing } from '../src/components/Pricing';
import { Contact } from '../src/components/Contact';
import { Footer } from '../src/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-800 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Services */}
        <Services />

        {/* 4. Streamer Assets Hub */}
        <StreamerAssets />

        {/* 5. Pricing */}
        <Pricing />

        {/* 6. Contact */}
        <Contact />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
