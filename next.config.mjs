import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qaobgjglyovmcaiiagyx.supabase.co",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
    imageSizes: [16, 32, 48, 64],
    deviceSizes: [96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  experimental: {
    optimizePackageImports: [
      "@hello-pangea/dnd",
      "@mantine/carousel",
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/tiptap",
      "@react-email/components",
      "@supabase/ssr",
      "@supabase/supabase-js",
      "@tiptap/react",
      "dayjs",
      "embla-carousel-react",
      "framer-motion",
    ],
  },
};

export default bundleAnalyzer(nextConfig);
