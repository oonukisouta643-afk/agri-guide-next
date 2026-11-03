import { Suspense } from "react";
import type { Metadata } from "next";
import { SimulatorApp } from "@/components/simulator/SimulatorApp";

// / simulator　就農シミュレーター
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2・§6（Phase 3・最優先機能）

export const metadata: Metadata = {
  title: "就農シミュレーター（無料・10問で補助金の目安）",
  alternates: { canonical: "/simulator" },
  description:
    "福島県北で農業を始めたい人向けの無料の就農シミュレーター。10問に答えると、使えそうな補助金の目安・地域・次のステップを表示します（一部は仮データ）。",
};

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="px-5 py-20 text-center text-muted">読み込み中...</div>}>
      <SimulatorApp />
    </Suspense>
  );
}
