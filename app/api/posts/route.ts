import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';
import {
  blogPostSchema,
  sanitizeInput,
  calculateReadingTime,
  generateSlug
} from '@/lib/validation';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';

    const skip = (page - 1) * limit;

    const db = await getDatabase();
    const posts = db.collection('posts');

    // Build query
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Get posts with pagination
    const [postList, total] = await Promise.all([
      posts
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      posts.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts: postList,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = extractTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const result = blogPostSchema.safeParse(body);
    if (!result.success) {
      const zodError = result.error as ZodError;
      return NextResponse.json(
        { error: 'Invalid input', details: zodError.issues },
        { status: 400 }
      );
    }

    const { title, content, tags } = result.data;
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedContent = sanitizeInput(content);
    const sanitizedTags = tags?.map(tag => sanitizeInput(tag)) || [];

    const slug = generateSlug(sanitizedTitle);
    const readingTime = calculateReadingTime(sanitizedContent);

    const db = await getDatabase();
    const posts = db.collection('posts');

    // Check if slug already exists
    const existingPost = await posts.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 409 }
      );
    }

    // Create post
    const newPost = {
      title: sanitizedTitle,
      content: sanitizedContent,
      slug,
      tags: sanitizedTags,
      readingTime,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: decoded.name,
      views: 0
    };

    const result_insert = await posts.insertOne(newPost);

    return NextResponse.json({
      message: 'Post created successfully',
      post: { ...newPost, _id: result_insert.insertedId }
    });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}