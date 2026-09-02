import type { MetadataRoute } from "next";

// F-08：SEO設定（sitemap.xml）
// dashboard・adminページ（Phase 6・内部管理用）は検索エンジンにインデックスさせないため含めない。

const BASE_URL = "https://fukushima-agri-guide.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/simulator", "/tools", "/farmers"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
