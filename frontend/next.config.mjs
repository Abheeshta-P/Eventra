const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"), // Resolve `@` to `src` directory
    };
    return config;
  },
};

module.exports = nextConfig;
