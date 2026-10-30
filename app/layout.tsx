import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

// Google Fonts configuration
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// Viewport & theme color configuration
export const viewport: Viewport = {
  themeColor: '#FAFBFD',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

// Comprehensive SEO Metadata for NexorDive
export const metadata: Metadata = {
  metadataBase: new URL('https://nexordive.com'),
  title: {
    default: 'NexorDive — Deep Digital Solutions for Modern Businesses',
    template: '%s | NexorDive',
  },
  description:
    'NexorDive is an elite digital product agency engineering high-performance web applications, scalable software architectures, applied AI automation, and broadcast-grade streamer graphics for creators and ambitious businesses.',
  keywords: [
    'web development',
    'streamer graphics',
    'AI automation',
    'software solutions',
    'NexorDive',
    'Next.js agency',
    'React 19 engineering',
    'custom SaaS development',
    'Twitch stream overlays',
    'Kick broadcast assets',
    'YouTube Gaming packs',
    'VTuber branding',
    'digital marketing',
    'conversion rate optimization',
    'Figma UI/UX design systems',
    'edge serverless architecture',
  ],
  authors: [{ name: 'NexorDive Engineering Team', url: 'https://nexordive.com' }],
  creator: 'NexorDive',
  publisher: 'NexorDive',
  applicationName: 'NexorDive',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NexorDive — Deep Digital Solutions for Modern Businesses',
    description:
      'High-performance web applications, scalable software architectures, applied AI automation, and broadcast streamer assets engineered for modern market leaders.',
    url: 'https://nexordive.com',
    siteName: 'NexorDive',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NexorDive — Deep Digital Solutions for Modern Businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexorDive — Deep Digital Solutions for Modern Businesses',
    description:
      'High-performance web applications, scalable software architectures, applied AI automation, and broadcast streamer assets.',
    creator: '@nexordive',
    site: '@nexordive',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-[#FAFBFD] text-slate-800 antialiased selection:bg-indigo-500/20 selection:text-indigo-900`}
      >
        {children}
      </body>
    </html>
  );
}
