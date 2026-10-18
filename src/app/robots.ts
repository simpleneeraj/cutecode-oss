import { BASE_URL } from "@/utils/common";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/edit/", "/remix/", "/s/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
