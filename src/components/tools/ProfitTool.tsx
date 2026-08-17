"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { profitCrops } from "@/data/tools/profitData";

// Tool G：品目別収益モデル
// 「桃/りんご/きゅうり/米/梨の5品目・年別棒グラフ・初期費用・黒字化年数」

export function ProfitTool() {
  const [selectedKey, setSelectedKey] = useState(profitCrops[0].key);
  const crop = profitCrops.find((c) => c.key === selectedKey) ?? profitCrops[0];
  const maxRevenue = Math.max(...profitCrops.flatMap((c) => c.yearlyRevenue));

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

      <Card className="mt-6">
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted">初期費用の目安</p>
            <p className="mt-1 font-serif text-lg font-bold text-green-700">{crop.initialCost}</p>
          </div>
          <div>
            <p className="text-xs text-muted">黒字化の目安</p>
            <p className="mt-1 font-serif text-lg font-bold text-green-700">{crop.breakEvenYears}</p>
          </div>
        </div>

        <p className="mt-6 mb-2 text-xs font-bold text-muted">年別収入イメージ（万円）</p>
        <div className="flex items-end gap-3" style={{ height: 160 }}>
          {crop.yearlyRevenue.map((rev, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-bold text-ink">{rev}</span>
              <div
                className="w-full rounded-t bg-green-700"
                style={{ height: `${Math.max(4, (rev / maxRevenue) * 130)}px` }}
              />
              <span className="text-xs text-muted">{i + 1}年目</span>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-3 text-xs text-muted">
        ※仮データです。実際の収益は経営規模・地域・気候等により大きく異なります。
      </p>
    </div>
  );
}
