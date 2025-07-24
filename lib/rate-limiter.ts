import { RateLimit } from '@/types';

class RateLimiter {
  private store: Map<string, RateLimit> = new Map();
  private readonly windowMs: number = 60 * 1000; // 1 minute
  private readonly maxRequests: number = 5;

  isAllowed(ip: string): boolean {
    const now = Date.now();
    const key = ip;
    
    let record = this.store.get(key);
    
    // Clean up expired records
    if (record && now > record.resetTime) {
      this.store.delete(key);
      record = undefined;
    }
    
    if (!record) {
      // First request
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }
    
    if (record.count >= this.maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  }

  getRemainingTime(ip: string): number {
    const record = this.store.get(ip);
    if (!record) return 0;
    
    const now = Date.now();
    return Math.max(0, record.resetTime - now);
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);