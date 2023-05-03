// import { env } from '~/env.mjs';

const getBaseUrl = (url: string) => {
  // if (env.NEXTAUTH_URL) return `https://${env.NEXTAUTH_URL}${url}`; // check
  console.log(process.env);
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${url}`;
  return `http://localhost:${process.env.PORT ?? 3000}${url}`;
};

export { getBaseUrl };
