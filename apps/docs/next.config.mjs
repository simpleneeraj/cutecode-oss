import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@cutecode/ui", "@cutecode/calendar", "@cutecode/calendar-pro"],
};

export default withMDX(nextConfig);
