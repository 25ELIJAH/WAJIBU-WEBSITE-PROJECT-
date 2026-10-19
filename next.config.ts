import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Legacy page scripts mutate the DOM directly, so StrictMode double-mounting is disabled.
  reactStrictMode: false,
  poweredByHeader: false,
  // Admin photo uploads are posted through server actions (5 MB images + form overhead).
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  trailingSlash: false,
  async redirects() {
    // Old static-site URLs (about.html, ...) -> clean routes
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...["about", "services", "insights", "impact", "contact", "privacy", "terms"].map((p) => ({
        source: `/${p}.html`,
        destination: `/${p}`,
        permanent: true,
      })),
      { source: "/index", destination: "/", permanent: true },
    ];
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/:path*", headers: security },
      { source: "/images/:path*", headers: immutable },
      { source: "/:file(.*\.ico)", headers: immutable },
    ];
  },
};

export default nextConfig;
