import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { getClientIP } from '@/lib/analytics';

export function middleware(request: NextRequest) {
  // Apply rate limiting to POST requests
  if (request.method === 'POST') {
    const ip = getClientIP(request);
    
    if (!rateLimiter.isAllowed(ip)) {
      const remainingTime = rateLimiter.getRemainingTime(ip);
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil(remainingTime / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(remainingTime / 1000).toString()
          }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/(.*)',
  ],
};