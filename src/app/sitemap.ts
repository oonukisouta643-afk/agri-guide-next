import type { MetadataRoute } from "next";

// F-08：SEO設定（sitemap.xml）
// dashboard・adminページ（Phase 6・内部管理用）は検索エンジンにインデックスさせないため含めない。
//
// 2026年8月24日：/subsidies（補助金一覧ページ）が抜けていたのを追加。
// このファイルは8/17時点で書かれたもので、当時はまだ/subsidiesページが存在しなかったため
// 追加漏れになっていた。Search Consoleでサイトのページが1件もインデックスされていない状態が
// 確認されたため、まず判明していたこの漏れを修正する。

const BASE_URL = "https://www.fukushima-agri-guide.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  // 2026年10月28日：/privacy（プライバシーポリシー）を追加。
  // 2026年10月30日：/soudan（地域とのつながりがない方の就農相談）を追加。
  const routes = ["", "/simulator", "/tools", "/farmers", "/subsidies", "/privacy", "/soudan"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date("2026-08-24"),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
