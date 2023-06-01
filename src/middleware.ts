import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/s/:path*',
};

export function middleware(req: NextRequest) {
  const { nextUrl: url, geo } = req;

  const country = geo?.country || 'RU';
  const city = geo?.city || '';
  const region = geo?.region || '';
  const latitude = geo?.latitude || '';
  const longitude = geo?.longitude || '';

  url.searchParams.set('country', country);
  url.searchParams.set('city', city);
  url.searchParams.set('region', region);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);

  return NextResponse.rewrite(url);
}
