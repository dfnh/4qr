import type { NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

export default function handler(req: NextRequest) {
  return new Response(JSON.stringify({ geo: req.geo }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
