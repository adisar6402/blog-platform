import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, Shield, BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'BlogPlatform - Production-Ready Blog',
  description: 'A scalable blog platform built with Next.js, MongoDB, and modern web technologies.',
  openGraph: {
    title: 'BlogPlatform - Production-Ready Blog',
    description: 'A scalable blog platform built with Next.js, MongoDB, and modern web technologies.',
    url: 'https://blog-platform-2025.vercel.app',
    siteName: 'BlogPlatform',
    images: [
      {
        url: 'https://blog-platform-2025.vercel.app/og-image.png', // Replace with real image later
        width: 1200,
        height: 630,
        alt: 'BlogPlatform Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlogPlatform - Production-Ready Blog',
    description: 'A scalable blog platform built with Next.js, MongoDB, and modern web technologies.',
    images: ['https://blog-platform-2025.vercel.app/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Blog Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A production-ready blog platform built with Next.js, MongoDB, and modern web technologies. 
            Features authentication, analytics, and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Blog Posts
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Start Writing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Enterprise Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Rich Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Full Markdown support with syntax highlighting and rich formatting options.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>High Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built for scale with MongoDB indexing and in-memory caching for lightning-fast performance.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  JWT authentication, rate limiting, input sanitization, and protection against common attacks.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track page views, unique visitors, and engagement metrics with real-time analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Publishing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our platform and start sharing your ideas with the world.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}