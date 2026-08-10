import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@swiss-trails/ui", "@swiss-trails/types"],
  images: {
    // Wikimedia URLs are already emitted as appropriately sized thumbnails.
    // Serving them directly avoids unnecessary Vercel image transforms.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "@swiss-trails/ui"],
  },
  async headers() {
    const scriptSrc = process.env.NODE_ENV === "development"
      ? "'self' 'unsafe-inline' 'unsafe-eval'"
      : "'self' 'unsafe-inline'";
    const contentSecurityPolicy = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://upload.wikimedia.org https://*.supabase.co https://*.mapbox.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://api.open-meteo.com https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ],
    }];
  },
};

export default nextConfig;
