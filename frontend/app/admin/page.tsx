'use client';

import React from 'react';
import { AdminProvider } from '../../src/context/AdminStore';
import { DashboardLayout } from '../../src/components/admin/DashboardLayout';

export default function AdminPage() {
  const handleBackToSite = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <AdminProvider>
      <DashboardLayout onBackToSite={handleBackToSite} />
    </AdminProvider>
  );
}
