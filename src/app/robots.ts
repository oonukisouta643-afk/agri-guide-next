import type { MetadataRoute } from "next";

// F-08：SEO設定（robots.txt）
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://fukushima-agri-guide.jp/sitemap.xml",
  };
}
