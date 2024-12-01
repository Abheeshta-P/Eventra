import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("src"), // Use ES module-compatible imports
    };
    return config;
  },
};

export default nextConfig;