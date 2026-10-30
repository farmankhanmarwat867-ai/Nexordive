import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NexorDive Admin Dashboard — Executive Console',
  description: 'Manage leads, portfolio items, pricing packages, and SEO settings for NexorDive.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased">
      {children}
    </div>
  );
}
