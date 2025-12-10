import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    unoptimized: isDev, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7019',
        pathname: '/**',
      },
         {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '7019',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mustafaguler.me',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;