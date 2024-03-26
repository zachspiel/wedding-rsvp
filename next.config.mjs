// @ts-check
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
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "@supabase/supabase-js"],
  },
};

export default withPlaiceholder(nextConfig);
