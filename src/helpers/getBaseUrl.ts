const getBaseUrl = (url: string) => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${url}`;
  return `http://localhost:${process.env.PORT ?? 3000}${url}`;
};

export { getBaseUrl };
