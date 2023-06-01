import { type NextRequest } from 'next/server';

export type CommonProps = { slink: string; geo: NextRequest['geo'] };
