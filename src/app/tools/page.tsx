import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolTabs } from "@/components/tools/ToolTabs";

// / tools　農業ツール集
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2

export const metadata: Metadata = {
  title: "就農の準備ツール（農業カレンダー・果樹の収益モデルなど）",
  alternates: { canonical: "/tools" },
  description:
    "福島県北で就農を考える人向けの無料ツール。農業カレンダー、補助金クイズ、農業適性チェック、就農タイムライン、果樹（もも・なし・りんご）の品目別収益モデルの5つです。",
};

export default function ToolsPage() {
  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <SectionHeader eye="tools" title="農業ツール集" lead="就農をもっとリアルに体感できる、5つの無料ツールです。" />
      <div className="mx-auto mt-10 max-w-5xl">
        <ToolTabs />
      </div>
    </div>
  );
}
