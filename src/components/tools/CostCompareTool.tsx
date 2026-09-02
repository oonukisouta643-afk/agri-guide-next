"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { costPersonas } from "@/data/tools/costComparisonData";

// Tool C：コスト比較（東京 vs 福島県北）
// 「ペルソナ選択→支出カテゴリ別比較グラフ」

function Bar({ label, value, max, colorClass }: { label: string; value: number; max: number; colorClass: string }) {
  const widthPercent = Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 shrink-0 text-muted">{label}</span>
      <div className="h-4 flex-1 rounded-sm bg-green-50">
        <div className={`h-4 rounded-sm ${colorClass}`} style={{ width: `${widthPercent}%` }} />
      </div>
      <span className="w-16 shrink-0 text-right font-mono text-ink">{value.toFixed(1)}万円</span>
    </div>
  );
}

export function CostCompareTool() {
  const [personaId, setPersonaId] = useState(costPersonas[0].id);
  const persona = costPersonas.find((p) => p.id === personaId) ?? costPersonas[0];
  const max = Math.max(...persona.categories.flatMap((c) => [c.tokyo, c.fukushima]));

  const tokyoTotal = persona.categories.reduce((sum, c) => sum + c.tokyo, 0);
  const fukushimaTotal = persona.categories.reduce((sum, c) => sum + c.fukushima, 0);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {costPersonas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPersonaId(p.id)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              p.id === personaId
                ? "border-green-700 bg-green-700 text-white"
                : "border-green-200 bg-white text-ink hover:bg-green-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <p className="text-sm text-muted">{persona.description}</p>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold text-sky-900">東京・首都圏（月額）</p>
            <div className="space-y-2">
              {persona.categories.map((c) => (
                <Bar key={c.name} label={c.name} value={c.tokyo} max={max} colorClass="bg-sky-900" />
              ))}
            </div>
            <p className="mt-2 text-right text-sm font-bold text-ink">合計 {tokyoTotal.toFixed(1)}万円/月</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-green-700">福島県北（月額）</p>
            <div className="space-y-2">
              {persona.categories.map((c) => (
                <Bar key={c.name} label={c.name} value={c.fukushima} max={max} colorClass="bg-green-700" />
              ))}
            </div>
            <p className="mt-2 text-right text-sm font-bold text-ink">合計 {fukushimaTotal.toFixed(1)}万円/月</p>
          </div>
        </div>

        <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">
          月額で約{(tokyoTotal - fukushimaTotal).toFixed(1)}万円、年間で約
          {((tokyoTotal - fukushimaTotal) * 12).toFixed(0)}万円の生活コスト差の目安になります。
        </p>
      </Card>

      <p className="mt-3 text-xs text-muted">※仮データです。実際の生活費は住居・ライフスタイルにより異なります。</p>
    </div>
  );
}
