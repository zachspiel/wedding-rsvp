import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/login/", "/guestList/", "/events/"],
    },
    sitemap: ["https://zachandsedona.com/sitemap.xml"],
  };
}
