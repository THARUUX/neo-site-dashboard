// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['drive.google.com', 'search.google.com', 'search.brave.com'],
  },
};

export default nextConfig;
