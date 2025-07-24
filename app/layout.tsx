// ✅ Removed 'use client'

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://blogplatform.vercel.app'),
  title: 'BlogPlatform - Production-Ready Blog',
  description: 'A scalable blog platform built with Next.js, MongoDB, and modern web technologies.',
  keywords: ['blog', 'nextjs', 'mongodb', 'react', 'typescript', 'tailwind'],
  authors: [{ name: 'BlogPlatform Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/og-image.png',
    siteName: 'BlogPlatform',
    title: 'BlogPlatform - Production-Ready Blog',
    description: 'A scalable blog platform built with Next.js, MongoDB, and modern web technologies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlogPlatform Open Graph Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlogPlatform - Production-Ready Blog',
    description: 'A scalable blog platform built with Next.js, MongoDB, and modern web technologies.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-white">
            {children}
          </main>
        </AuthProvider>

        {/* ✅ Console log must run only in browser */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('%c Abdulrahman Adisa Amuda — Developer of BlogPlatform ', 'color: white; background: #2563EB; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 14px;');
              window.Abdulrahman = () => {
                console.info('%c👋 Hey there! This platform was proudly built by Abdulrahman Adisa Amuda using Next.js, MongoDB, and love for clean code.', 'color: #22c55e; font-size: 13px;');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}