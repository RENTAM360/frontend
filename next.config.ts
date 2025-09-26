import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.gidaah.com",
      },
      {
        protocol: "http",
        hostname: "api.gidaah.com",
      },
      {
        protocol: 'http',
        hostname: 'api.rentam360.com',
        pathname: '/api/v1/dev/media/view/**',
      },
      {
        protocol: 'https',
        hostname: 'api.rentam360.com',
        pathname: '/api/v1/dev/media/view/**',
      }
    ],
  },
};

export default nextConfig;
