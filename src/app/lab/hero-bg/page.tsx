import type { Metadata } from "next";
import { HeroBgCompare } from "./HeroBgCompare";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Story } from "@/components/sections/Story";

// /lab/hero-bg　トップの背景の動きを見比べる見本（段階A）
// 今のファーストビュー（src/components/sections/Hero.tsx）と同じ形・文言で、背景の動きだけを切り替える。
// 下に今のトップの続き（StatsStrip・Story）を少しだけ置き、スクロールの感じも確かめられるようにした。
// noindex、サイト内リンクなし。サイトマップ（src/app/sitemap.ts）は手で並べる作りなので、/lab/ は入らない。

export const metadata: Metadata = {
  title: "トップの背景の動き（見本）",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <HeroBgCompare />
      <StatsStrip />
      <Story />
    </>
  );
}
