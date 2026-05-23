// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/v1/:path*",
//         destination: "https://localhost:62971/api/v1/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;



import type { NextConfig } from "next";

// Allow self-signed certs in development for server-side fetches
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://localhost:62971/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;