import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Allow login page without auth
    if (pathname.startsWith('/admin/login')) {
      const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
      if (cookie === 'ok') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    if (cookie !== 'ok') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};


