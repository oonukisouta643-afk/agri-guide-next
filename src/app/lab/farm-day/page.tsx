import type { Metadata } from "next";
import FarmDayHero from "@/components/home/FarmDayHero";

// / lab / farm-day　トップの「農家の一日」アニメーションの見本ページ（段階A）
// 出典：docs/INSTRUCTIONS_farm-day-hero.md（2026年10月26日）。部品は docs/src/FarmDayHero.tsx をもとに、
// 2026年10月27日の大貫さんの決定で構図・タイトル・リード文、FACTS の出典の書き方を直したもの。
// noindex、サイト内リンクなし。サイトマップ（src/app/sitemap.ts）は手で並べる作りなので、/lab/ は入らない。

export const metadata: Metadata = {
  title: "農家の一日（見本）",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FarmDayHero />;
}
