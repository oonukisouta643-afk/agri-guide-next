import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolTabs } from "@/components/tools/ToolTabs";

// / tools　農業ツール集
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2

export const metadata: Metadata = {
  title: "農業ツール集",
  description:
    "農業カレンダー・補助金クイズ・品目別収益モデルなど、就農をリアルに体感できる5つの無料ツール集です。",
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
