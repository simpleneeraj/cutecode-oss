const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = require("@next/mdx")();

const isDev = process.env.NODE_ENV === "development";

const rumRegion = process.env.NEXT_PUBLIC_RUM_REGION;
const rumSources = rumRegion
  ? [
      process.env.NEXT_PUBLIC_RUM_ENDPOINT || `https://dataplane.rum.${rumRegion}.amazonaws.com`,
      `https://cognito-identity.${rumRegion}.amazonaws.com`,
    ]
  : [];

function contentSecurityPolicy(frameAncestors) {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://raw.githubusercontent.com",
    "font-src 'self' data:",
    ["connect-src 'self' data: blob: https://raw.githubusercontent.com", ...rumSources, ...(isDev ? ["ws:"] : [])].join(" "),
    "worker-src 'self' blob:",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

const baseSecurityHeaders = [
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
];

/** @type {import('next').NextConfig} */

const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { serverSourceMaps: false },
  transpilePackages: ["highlight.js", "@cutecode/ui"],
  serverExternalPackages: ["better-auth", "drizzle-orm", "pg", "shiki", "@aws-sdk/client-ses", "@aws-sdk/client-ssm"],
  async headers() {
    return [
      {
        source: "/((?!embed/).*)",
        headers: [
          ...baseSecurityHeaders,
          { key: "Content-Security-Policy", value: contentSecurityPolicy("'none'") },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/embed/:path*",
        headers: [...baseSecurityHeaders, { key: "Content-Security-Policy", value: contentSecurityPolicy("*") }],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(withMDX(nextConfig));
