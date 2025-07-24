import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema, sanitizeInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    const db = await getDatabase();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email: sanitizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userForToken = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    const token = generateToken(userForToken);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userForToken
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}