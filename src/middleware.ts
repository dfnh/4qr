import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/s/:path*',
};

export function middleware(req: NextRequest) {
  const { nextUrl: url, geo } = req;

  const country = geo?.country || 'RU';
  const city = geo?.city || 'Moscow';
  const region = geo?.region || 'MOS';

  url.searchParams.set('country', country);
  url.searchParams.set('city', city);
  url.searchParams.set('city', region);

  return NextResponse.rewrite(url);
}
