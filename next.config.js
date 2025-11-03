/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [{
      source: "/api/web/v1/:path*",
      destination: "http://localhost:8001/api/web/v1/:path*",
    }, ];
  },
}

module.exports = nextConfig;