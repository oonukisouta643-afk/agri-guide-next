import { Suspense } from "react";
import type { Metadata } from "next";
import { SimulatorApp } from "@/components/simulator/SimulatorApp";

// / simulator　就農シミュレーター
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2・§6（Phase 3・最優先機能）

export const metadata: Metadata = {
  title: "就農シミュレーター",
  description:
    "10問に答えるだけで、補助金の目安・おすすめの地域・次のステップが分かる無料の就農シミュレーターです。",
};

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="px-5 py-20 text-center text-muted">読み込み中...</div>}>
      <SimulatorApp />
    </Suspense>
  );
}
