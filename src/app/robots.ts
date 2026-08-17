import type { MetadataRoute } from "next";

// F-08：SEO設定（robots.txt）
// /admin・/dashboardは行政向け提案資料・内部管理用ページのため、
// noindexメタタグに加えてクロール自体もブロックする（該当ページに外部リンクは張っていない）。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard"],
    },
    sitemap: "https://fukushima-agri-guide.jp/sitemap.xml",
  };
}
