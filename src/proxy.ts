import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('adminAuth');
  const isAuth = authCookie && authCookie.value === 'true';

  const pathname = request.nextUrl.pathname;

  // If visiting /admin/login and already authenticated, redirect to /admin
  if (pathname === '/admin/login' && isAuth) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If visiting /admin/* (except login) and not authenticated, redirect to /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
