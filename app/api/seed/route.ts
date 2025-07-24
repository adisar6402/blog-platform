import { NextRequest, NextResponse } from 'next/server';
import { seedBlogPosts } from '@/lib/utils/seed';
import { initializeIndexes } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { count = 1000 } = await request.json();
    
    // Initialize database indexes
    await initializeIndexes();
    
    // Seed blog posts
    await seedBlogPosts(count);

    return NextResponse.json({
      message: `Database seeded with ${count} posts and indexes initialized`
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}