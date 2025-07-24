import { Analytics, ViewCount } from '@/types';

// In-memory analytics store
class AnalyticsStore {
  private views: Map<string, Set<string>> = new Map();
  private dailyViews: Map<string, Map<string, Set<string>>> = new Map();

  trackView(postId: string, ip: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize maps if they don't exist
    if (!this.views.has(postId)) {
      this.views.set(postId, new Set());
    }
    if (!this.dailyViews.has(postId)) {
      this.dailyViews.set(postId, new Map());
    }
    if (!this.dailyViews.get(postId)!.has(today)) {
      this.dailyViews.get(postId)!.set(today, new Set());
    }

    // Check if this IP has already viewed today
    const todayViews = this.dailyViews.get(postId)!.get(today)!;
    if (todayViews.has(ip)) {
      return false; // Already counted today
    }

    // Add to both total and daily views
    this.views.get(postId)!.add(ip);
    todayViews.add(ip);
    
    return true; // New view counted
  }

  getViewCount(postId: string): ViewCount {
    const totalViews = this.views.get(postId)?.size || 0;
    const dailyData: { [date: string]: number } = {};
    
    // Get last 7 days
    const dailyViews = this.dailyViews.get(postId);
    if (dailyViews) {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyData[dateStr] = dailyViews.get(dateStr)?.size || 0;
      }
    }

    return {
      total: totalViews,
      daily: dailyData
    };
  }

  getAllViewCounts(): { [postId: string]: ViewCount } {
    const result: { [postId: string]: ViewCount } = {};
    
    this.views.forEach((_, postId) => {
      result[postId] = this.getViewCount(postId);
    });

    return result;
  }
}

export const analyticsStore = new AnalyticsStore();

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  
  return '127.0.0.1'; // Fallback for development
}