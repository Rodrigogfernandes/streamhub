/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['image.tmdb.org', 'cdn.maze.co', 'localhost'],
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://backend:3000/api/:path*' },
    ];
  },
};

module.exports = nextConfig;
