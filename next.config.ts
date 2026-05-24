import type { NextConfig } from "next";

// Allow self-signed certs in development ONLY
// Never set NODE_TLS_REJECT_UNAUTHORIZED=0 in production
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  async rewrites() {
    // In development, proxy to local backend
    // In production, NEXT_PUBLIC_API_URL points directly to your production API
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/v1/:path*",
          destination: "https://localhost:62971/api/v1/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;