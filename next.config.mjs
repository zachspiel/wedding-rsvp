import withPlaiceholder from "@plaiceholder/next";

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
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/tiptap",
      "@react-email/components",
      "@supabase/supabase-js",
      "@tiptap/react",
      "embla-carousel-react",
      "react-countdown",
      "framer-motion",
    ],
  },
};

export default withPlaiceholder(nextConfig);
