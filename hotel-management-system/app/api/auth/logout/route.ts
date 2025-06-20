import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // For JWT authentication, logout is primarily a client-side operation
  // (clearing the token from storage).
  // Server-side, you might implement a token blacklist if you need to invalidate tokens before expiry.
  // For this basic implementation, we just acknowledge the logout request.

  return NextResponse.json(
    { message: 'Logged out successfully. Please clear your token on the client-side.' },
    { status: 200 }
  );
}

// You could also implement a GET handler if preferred for logout,
// but POST is common to prevent CSRF if any server-side state change were to occur.
// export async function GET(request: NextRequest) {
//   return NextResponse.json(
//     { message: 'Logged out successfully. Please clear your token on the client-side.' },
//     { status: 200 }
//   );
// }
