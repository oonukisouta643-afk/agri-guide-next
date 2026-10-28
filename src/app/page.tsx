import { HeroDay } from "@/components/home/HeroDay";
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

// トップページ（/）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5、OLD版 index.html（旧サイト）の実際のセクション順序
// 2026年10月27日：AdminSection（/admin へのリンク）を外した。/admin はサイト内からリンクしない（ハンドブック第4章）。
// 2026年10月28日：ファーストビューを Hero から HeroDay（今の文言のまま、右に季節ごとの農家の一日）に替えた（大貫さんの判断）。
// セクション順序：HeroDay→StatsStrip→Story→How→SimCta→Field→ProduceShowcase→Tools→Regions→RoadmapSection→Contact
// 2026年8月20日：OLD版との突合で欠落していたセクション（StatsStrip・SimCta・AdminSection・
// ProduceShowcase・RoadmapSection等）を復元。
// 2026年8月20日：チーム紹介セクション・連携調整中の機関チップは引き続き非掲載
// （運営者個人・協力者の情報を最小化する方針のため、意図的な除外）。

export default function Home() {
  return (
    <>
      <HeroDay />
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
