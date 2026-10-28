import type { Metadata } from "next";
import { HeroMotion } from "@/components/home/HeroMotion";
import YearRing from "@/components/home/YearRing";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Story } from "@/components/sections/Story";
import { How } from "@/components/sections/How";
import { SimCta } from "@/components/sections/SimCta";
import { Field } from "@/components/sections/Field";
import { ProduceShowcase } from "@/components/sections/ProduceShowcase";
import { Tools } from "@/components/sections/Tools";
import { Regions } from "@/components/sections/Regions";
import { RoadmapSection } from "@/components/sections/RoadmapSection";
import { Contact } from "@/components/sections/Contact";

// /lab/hero-motion　トップの見本（段階A）：今のファーストビューに動きと「今月の果樹園」を足し、
// その下に「果樹の1年」の輪を置いたもの。ほかのセクションは今のトップ（src/app/page.tsx）と同じ順。
// noindex、サイト内リンクなし。サイトマップ（src/app/sitemap.ts）は手で並べる作りなので、/lab/ は入らない。

export const metadata: Metadata = {
  title: "トップの見本（動きのある版）",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <HeroMotion ringId="year-ring" />
      <YearRing id="year-ring" />
      <StatsStrip />
      <Story />
      <How />
      <SimCta />
      <Field />
      <ProduceShowcase />
      <Tools />
      <Regions />
      <RoadmapSection />
      <Contact />
    </>
  );
}
