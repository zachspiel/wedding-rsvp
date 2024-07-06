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
    ],
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
