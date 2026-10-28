"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { profitAreaA, profitCrops, type ProfitRoute } from "@/data/tools/profitData";

// Tool G：品目別収益モデル
// 2026年10月28日に作り直した：もも・なし・りんごの3品目、60a、1〜10年目の農業所得。
// 「新しく植える」と「先輩の園地を受け継ぐ」を切り替えて比べる。数字の出典は src/data/tools/profitData.ts。
// 赤字の年は赤で出す（最初の数年は赤字になりうる、という現実を隠さない）。

const routeLabels: Record<ProfitRoute, string> = {
  newPlanting: "新しく植える",
  takeover: "先輩の園地を受け継ぐ",
};

function toManYen(yen: number) {
  return Math.round(yen / 10000);
}

export function ProfitTool() {
  const [selectedKey, setSelectedKey] = useState(profitCrops[0].key);
  const [route, setRoute] = useState<ProfitRoute>("newPlanting");
  const crop = profitCrops.find((c) => c.key === selectedKey) ?? profitCrops[0];

  const years = crop.income[route].map(toManYen);
  const max = Math.max(...years, 50);
  const min = Math.min(...years, -10);
  const range = max - min || 1;
  const firstPlusYear = years.findIndex((y) => y > 0) + 1;
  const cumulative = toManYen(crop.income[route].reduce((a, b) => a + b, 0));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {profitCrops.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setSelectedKey(c.key)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              c.key === selectedKey
                ? "border-green-700 bg-green-700 text-white"
                : "border-green-200 bg-white text-ink hover:bg-green-50"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(routeLabels) as ProfitRoute[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoute(r)}
            className={`rounded border px-3 py-1.5 text-xs font-bold transition-colors ${
              r === route ? "border-green-700 bg-green-50 text-green-800" : "border-black/10 bg-white text-muted hover:bg-green-50"
            }`}
          >
            {routeLabels[r]}
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <p className="text-sm font-bold text-ink">
          {crop.emoji} {crop.label}（{crop.variety}）・{routeLabels[route]}・{profitAreaA}aの場合
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          成園の収量 {crop.yieldKgPer10a.toLocaleString()}kg/10a、単価 {crop.priceYenPerKg}円/kg
          {route === "newPlanting" && `、新植の初期投資 ${toManYen(crop.newPlantingCostYenPer10a)}万円/10a`}
          。経営開始資金や国の支援は含まない農業所得です。
        </p>

        <p className="mb-2.5 mt-6 text-xs font-bold text-muted">1〜10年目の農業所得（万円・試算）</p>
        <div className="flex items-end gap-1 sm:gap-2" style={{ height: 150 }}>
          {years.map((y, i) => {
            const h = Math.max(4, Math.round(((y - min) / range) * 110));
            const isNegative = y < 0;
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                <span className={`text-[9px] font-bold sm:text-[10px] ${isNegative ? "text-red" : "text-green-700"}`}>
                  {y > 0 ? "+" : ""}
                  {y}
                </span>
                <div className={`w-full rounded-t ${isNegative ? "bg-red" : "bg-green-600"}`} style={{ height: `${h}px` }} />
                <span className="text-[9px] text-muted sm:text-[10px]">{i + 1}年</span>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-ink">
          {firstPlusYear > 0
            ? `この試算では、農業所得がプラスになるのは${firstPlusYear}年目からです。`
            : "この試算では、10年目までに農業所得はプラスになりません。"}
        </p>
        {years.some((y) => y < 0) && (
          <p className="mt-1 text-[11px] text-red">赤字（マイナス）の年は、木が育ちきっておらず、収入が経営費に届かない時期です。</p>
        )}
        {crop.costNote && route === "newPlanting" && <p className="mt-1 text-[11px] text-muted">※ {crop.costNote}</p>}
        {route === "newPlanting" && cumulative < 0 && (
          <p className="mt-1 text-[11px] text-muted">
            ※ 10年間の農業所得の合計は約{cumulative}万円で、この試算では10年目までに初めの赤字を取り戻せません。
          </p>
        )}
        {route === "takeover" && (
          <p className="mt-1 text-[11px] text-muted">
            ※
            受け継ぐ場合の収量（1年目は成園の70%、2年目80%、3年目90%、4年目から100%）は推測で、根拠になる資料は見つかっていません。4年目に熟練者の水準に届くのは楽観的な仮定です。園地は借りる前提（地代 年15,000円/10a）、引き継ぎの一時金は0円としています（推測）。
          </p>
        )}
      </Card>

      <WarningBox type="warn" className="mt-3">
        ⚠️ 試算です。約束した数字ではありません。収量は福島県果樹農業振興計画、単価・経営費は長野県の作目別経営指標を仮に使っています（福島県の指標が見つからないため）。実際の収入は品種・園地・天候・販売先で大きく変わります。
      </WarningBox>

      <Link
        href="/simulator"
        className="mt-3 block w-full rounded bg-green-700 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
      >
        🌿 自分の条件でシミュレーターを試す
      </Link>
    </div>
  );
}
