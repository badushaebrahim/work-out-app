import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// We use `jose` instead of `jsonwebtoken` because Middleware runs on Edge Runtime
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
