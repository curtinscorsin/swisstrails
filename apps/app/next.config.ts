import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@swiss-trails/ui"],
  images: {
    // Wikimedia URLs are already emitted as appropriately sized thumbnails.
    // Serving them directly avoids unnecessary Vercel image transforms.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "@swiss-trails/ui"],
  },
};

export default nextConfig;
