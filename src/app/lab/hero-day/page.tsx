import type { Metadata } from "next";
import { HeroDay } from "@/components/home/HeroDay";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Story } from "@/components/sections/Story";

// /lab/hero-day　トップの見本（段階A）：今のファーストビューの右側（スマホではボタンの下）に、季節ごとの「農家の一日」を
// 写真の上に1行ずつ出す版（データは src/data/farmSeasons.ts の HERO_DAY_LINES）。下に今のトップの続き（StatsStrip・Story）を少しだけ置き、スクロールの感じも確かめられるようにした。
// noindex、サイト内リンクなし。サイトマップ（src/app/sitemap.ts）は手で並べる作りなので、/lab/ は入らない。

export const metadata: Metadata = {
  title: "トップの見本（季節ごとの農家の一日）",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <HeroDay />
      <StatsStrip />
      <Story />
    </>
  );
}
