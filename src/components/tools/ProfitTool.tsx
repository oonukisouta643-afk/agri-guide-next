"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { profitCrops } from "@/data/tools/profitData";

// Tool G：品目別収益モデル
// 「桃/りんご/きゅうり/米/梨の5品目・年別棒グラフ・初期費用・黒字化年数」
// 旧サイト（agri-tools.html 966-1027行）の「初期投資回収前の赤字年を含む純収支」表示を移植。
// 赤字年は赤色バーで視覚的に区別する（"あなたは最初の1〜2年赤字になる"という現実を隠さない）。

export function ProfitTool() {
  const [selectedKey, setSelectedKey] = useState(profitCrops[0].key);
  const crop = profitCrops.find((c) => c.key === selectedKey) ?? profitCrops[0];

  const years = crop.yearlyNet;
  const max = Math.max(...years, 50);
  const min = Math.min(...years, -10);
  const range = max - min || 1;

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
        <p className="text-sm font-bold text-ink">
          {crop.emoji} {crop.label}（{crop.scale}あたり）
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{crop.note}</p>

        <p className="mb-2.5 mt-6 text-xs font-bold text-muted">年別農業収入の推移（万円・仮データ）</p>
        <div className="flex items-end gap-2" style={{ height: 140 }}>
          {years.map((y, i) => {
            const h = Math.max(4, Math.round(((y - min) / range) * 110));
            const isNegative = y < 0;
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                <span className={`text-[10px] font-bold ${isNegative ? "text-red" : "text-green-700"}`}>
                  {y >= 0 ? "+" : ""}
                  {y}
                </span>
                <div
                  className={`w-full rounded-t ${isNegative ? "bg-red" : "bg-green-600"}`}
                  style={{ height: `${h}px` }}
                />
                <span className="text-[10px] text-muted">{i + 1}年目</span>
              </div>
            );
          })}
        </div>

        {years.some((y) => y < 0) && (
          <p className="mt-2 text-[11px] text-red">
            ⚠️ 赤字（マイナス）の年は、初期投資を年間収益がまだ回収できていない時期です。
          </p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded bg-green-50 p-2.5 text-center">
            <p className="text-[10px] text-muted">初期費用目安</p>
            <p className="text-sm font-bold text-ink">約{crop.initialCostManYen}万円</p>
            <p className="text-[9px] text-muted">※仮データ</p>
          </div>
          <div className="rounded bg-green-50 p-2.5 text-center">
            <p className="text-[10px] text-muted">黒字化の目安</p>
            <p className="text-sm font-bold text-ink">{crop.breakEvenYear}年目頃</p>
            <p className="text-[9px] text-muted">※仮データ</p>
          </div>
        </div>
      </Card>

      <WarningBox type="warn" className="mt-3">
        ⚠️ 全て全国平均値ベースの仮データです。実際の収益は品種・規模・経営能力により大きく異なります。2026年8月に農家ヒアリングデータで更新予定。
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
