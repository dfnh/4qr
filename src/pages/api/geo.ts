import { NextResponse, type NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

export default function handler(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get('ip') == 'true';

  const res: { [key: string]: string } = { ...req.geo };
  if (ip) {
    res.ip = req.ip || '';
  }

  return NextResponse.json(res, {
    status: 200,
    headers: { 'Cache-Control': 'max-age=0, s-maxage=60' },
  });
}
