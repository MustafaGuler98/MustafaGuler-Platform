import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const BACKEND_URL = process.env.INTERNAL_API_URL || 'http://localhost:5281';

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5281',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mustafaguler.me',
        pathname: '/**',
      }
    ],
  },
  // Proxy API requests to backend (enables same-origin cookies)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
      {
        source: '/music-status.json',
        destination: `${BACKEND_URL}/live-status/music-status.json`,
      },
    ];
  },
};

export default nextConfig;