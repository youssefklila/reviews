import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/tokenUtils'; // Assuming this path is resolvable from root

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authHeader = request.headers.get('Authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // If you also want to check for token in cookies:
  // if (!token) {
  //   token = request.cookies.get('auth_token')?.value || null;
  // }

  const isApiRoute = pathname.startsWith('/api/');
  const isAdminRoute = pathname.startsWith('/admin/'); // Non-API admin pages

  if (!token) {
    if (isApiRoute && pathname.startsWith('/api/user-info')) { // Only protect /api/user-info for now as per original intent for API
      return NextResponse.json({ message: 'Authentication required: No token provided for API.' }, { status: 401 });
    }
    if (isAdminRoute && !pathname.startsWith('/admin/login')) { // Avoid redirect loop for login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // For other routes, or if you want to allow public API access to non-user-info routes:
    // return NextResponse.next(); // Or handle differently
  } else {
    const decodedPayload = verifyToken(token);
    if (!decodedPayload) {
      if (isApiRoute && pathname.startsWith('/api/user-info')) {
        return NextResponse.json({ message: 'Authentication failed: Invalid or expired token for API.' }, { status: 403 });
      }
      if (isAdminRoute && !pathname.startsWith('/admin/login')) {
        // Redirect to login with an error query param
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'invalid_token');
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // Token is valid
      // Add user info to request headers if needed by downstream handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-payload', JSON.stringify(decodedPayload));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  // Default: if no token and not an API route, or other unhandled cases
  // The logic above should handle protected routes.
  // If a route is not matched by the new matcher config but somehow hits middleware,
  // or if it's a public API route that doesn't require a token.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/login (Login route, should be public)
     * - api/auth/logout (Logout route, might need auth but action itself is public-ish)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (root page, if it's public)
     * - /admin/login (the admin login page itself, should be public)
     * Public API routes generally don't need to be listed here if they don't require auth.
     */
    '/api/user-info/:path*', // Protected API route
    '/admin/:path*',         // All admin pages and any admin API routes under /admin/api/*
  ],
};
