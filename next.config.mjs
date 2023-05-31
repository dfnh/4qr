await import('./src/env.mjs');
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['authjs.dev'],
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(config);
