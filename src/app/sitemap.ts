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
  // 2026年11月3日：lastModified を全ページ8月24日の固定から、ページごとに中身を最後に変えた日へ。
  // ページの中身（ページのファイル・使っているデータ）を変えたら、ここの日付も手で直す。
  const routes: { path: string; lastModified: string }[] = [
    { path: "", lastModified: "2026-11-03" },
    { path: "/simulator", lastModified: "2026-11-03" },
    { path: "/tools", lastModified: "2026-11-03" },
    { path: "/farmers", lastModified: "2026-11-03" },
    { path: "/subsidies", lastModified: "2026-11-03" },
    { path: "/privacy", lastModified: "2026-10-30" },
    { path: "/soudan", lastModified: "2026-11-03" },
  ];

  return routes.map(({ path: route, lastModified }) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(lastModified),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
