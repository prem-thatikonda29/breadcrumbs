import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sign-in"],
      // Signed-in app surfaces; nothing here is useful to a crawler.
      disallow: ["/app", "/collections/", "/entries/", "/export", "/bookmarklet", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
