/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@extractus/article-extractor"],
  async redirects() {
    return [
      {
        source: "/arena",
        destination: "/chat",
        permanent: true,
      },
      {
        source: "/arena/:path*",
        destination: "/chat/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
