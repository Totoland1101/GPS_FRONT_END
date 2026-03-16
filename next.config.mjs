/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
