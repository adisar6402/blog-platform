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
    const forDashboard = searchParams.get('dashboard') === 'true';

    const skip = (page - 1) * limit;

    const db = await getDatabase();
    const posts = db.collection('posts');

    let query: any = {};

    // Check if user is authenticated
    const token = extractTokenFromRequest(request);
    const decoded = token ? verifyToken(token) : null;

    if (forDashboard && decoded) {
      // Show all posts by the logged-in user on the dashboard
      query.author = decoded.name;
    } else {
      // Public view: only published posts
      query.published = true;
      if (search) query.$text = { $search: search };
      if (tag) query.tags = { $in: [tag.toLowerCase()] };
    }

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
    const token = extractTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const result = blogPostSchema.safeParse(body);

    if (!result.success) {
      const zodError = result.error as ZodError;
      return NextResponse.json({ error: 'Invalid input', details: zodError.issues }, { status: 400 });
    }

    const { title, content, tags } = result.data;

    const sanitizedTitle = sanitizeInput(title);
    const sanitizedContent = sanitizeInput(content);
    const sanitizedTags = (tags || []).map(t => sanitizeInput(t.toLowerCase()));

    const db = await getDatabase();
    const posts = db.collection('posts');

    // Slug generation & conflict handling
    let baseSlug = generateSlug(sanitizedTitle);
    let slug = baseSlug;
    let count = 1;

    while (await posts.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const readingTime = calculateReadingTime(sanitizedContent);

    const newPost = {
      title: sanitizedTitle,
      content: sanitizedContent,
      tags: sanitizedTags,
      slug,
      readingTime,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: decoded.name,
      views: 0,
      published: true // ensures public visibility
    };

    const inserted = await posts.insertOne(newPost);

    return NextResponse.json({
      message: 'Post created successfully',
      post: { ...newPost, _id: inserted.insertedId }
    });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}