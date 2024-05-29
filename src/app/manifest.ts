import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Patriz Wedding 2024",
    short_name: "Patriz Wedding 2024",
    description: "We're getting married! Patric and Cariza 2024.",
    start_url: "/",
    display: "browser",
    background_color: "#fff",
    theme_color: "#8e9386",
    icons: [
      {
        src: "/assets/images/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },

      {
        src: "/assets/images/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/assets/images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/images/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
    ],
  };
}
