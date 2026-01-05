import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
