import type { Metadata } from "next";
import FarmDayHero from "@/components/home/FarmDayHero";

// / lab / farm-day　トップの「農家の一日」アニメーションの見本ページ（段階A）
// 出典：docs/INSTRUCTIONS_farm-day-hero.md（2026年10月26日）。部品は docs/src/FarmDayHero.tsx をそのまま写したもの。
// noindex、サイト内リンクなし。サイトマップ（src/app/sitemap.ts）は手で並べる作りなので、/lab/ は入らない。

export const metadata: Metadata = {
  title: "農家の一日（見本）",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FarmDayHero />;
}
