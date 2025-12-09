import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'localhost',
        port: '7019', 
        pathname: '/**', 
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7019',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '159.69.196.46',
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