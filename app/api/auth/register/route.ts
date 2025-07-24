import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { hashPassword, generateToken } from '@/lib/auth';
import { registerSchema, sanitizeInput } from '@/lib/validation';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const zodError = result.error as ZodError;
      return NextResponse.json(
        { error: 'Invalid input', details: zodError.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    const db = await getDatabase();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result_insert = await users.insertOne(newUser);
    const user = {
      _id: result_insert.insertedId.toString(),
      name: sanitizedName,
      email: sanitizedEmail,
    };

    const token = generateToken(user);

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}