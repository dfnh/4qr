import { env } from '~/env.mjs';

const getBaseUrl = (url: string) => {
  if (env.NEXT_PUBLIC_SITE_DOMAIN) return `https://${env.NEXT_PUBLIC_SITE_DOMAIN}${url}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${url}`;
  return `http://localhost:${process.env.PORT ?? 3000}${url}`;
};

export { getBaseUrl };
