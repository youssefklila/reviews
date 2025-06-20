import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/tokenUtils';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization header missing or malformed' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Token not found in Authorization header' }, { status: 401 });
    }

    const decodedPayload = verifyToken(token);

    if (!decodedPayload) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 }); // 403 Forbidden as token was provided but invalid
    }

    // TODO: Optionally, fetch fresh user data from DB using userId from decodedPayload.id
    // This is useful if user roles/permissions change frequently.
    // For this example, the token payload is considered sufficient.

    return NextResponse.json({ user: decodedPayload }, { status: 200 });

  } catch (error) {
    console.error('User info error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
