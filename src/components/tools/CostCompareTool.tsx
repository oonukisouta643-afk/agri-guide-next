"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import {
  costPersonas,
  computeIncomeComparison,
  COST_INCOME_MIN,
  COST_INCOME_MAX,
  COST_INCOME_DEFAULT,
} from "@/data/tools/costComparisonData";

// Tool C：コスト比較（東京 vs 福島県北）
// 「ペルソナ選択→支出カテゴリ別比較グラフ」＋
// 旧サイト（agri-tools.html 206-306, 706-795行）の手取り月収スライダー・
// 動的モデルケース・8行の家計内訳テーブル・出典クレジットを移植。

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

function leftColorClass(left: number): string {
  if (left > 5) return "text-green-700";
  if (left > 0) return "text-gold";
  return "text-red";
}

function TableRow({
  label,
  tokyo,
  fukushima,
  bold,
  highlight,
}: {
  label: string;
  tokyo: React.ReactNode;
  fukushima: React.ReactNode;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <tr className={`border-b border-black/5 ${highlight ? "bg-green-50" : ""}`}>
      <td className={`px-3 py-2 ${bold ? "font-bold text-ink" : "text-ink"}`}>{label}</td>
      <td className={`px-3 py-2 text-right text-red ${bold ? "font-bold" : ""}`}>{tokyo}</td>
      <td className={`px-3 py-2 text-right text-green-700 ${bold ? "font-bold" : ""}`}>{fukushima}</td>
    </tr>
  );
}

export function CostCompareTool() {
  const [income, setIncome] = useState(COST_INCOME_DEFAULT);
  const result = computeIncomeComparison(income);

  const [personaId, setPersonaId] = useState(costPersonas[0].id);
  const persona = costPersonas.find((p) => p.id === personaId) ?? costPersonas[0];
  const max = Math.max(...persona.categories.flatMap((c) => [c.tokyo, c.fukushima]));

  const tokyoTotal = persona.categories.reduce((sum, c) => sum + c.tokyo, 0);
  const fukushimaTotal = persona.categories.reduce((sum, c) => sum + c.fukushima, 0);

  return (
    <div>
      {/* ── モデルケース：手取り月収スライダー ── */}
      <div className="rounded border border-[rgba(26,72,120,.12)] bg-gradient-to-br from-[#F0F7FF] to-[#E5EEF8] p-4">
        <p className="mb-2 text-xs font-bold text-sky-900">👤 モデルケース</p>
        <p className="mb-1 text-sm font-bold text-ink">{result.personaName}</p>
        <p className="text-xs leading-relaxed text-muted">{result.personaDesc}</p>

        <div className="mt-3">
          <p className="mb-1.5 text-xs font-bold text-ink">東京での手取り月収を変えてみる</p>
          <p className="font-mono text-xl font-bold text-sky-900">{income}万円</p>
          <input
            type="range"
            min={COST_INCOME_MIN}
            max={COST_INCOME_MAX}
            step={1}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="mt-0.5 flex justify-between text-[10px] text-muted">
            <span>{COST_INCOME_MIN}万円</span>
            <span>{COST_INCOME_MAX}万円</span>
          </div>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <Card>
          <p className="mb-2 text-xs font-bold text-muted">🗼 東京（現状）</p>
          <p className="text-xs text-red">月間支出</p>
          <p className="font-mono text-xl font-bold text-red">{result.tokyo.total.toFixed(1)}万円</p>
          <p className="mt-1 text-[10px] text-muted">手取りから差し引き後</p>
          <p className={`mt-1.5 font-mono text-sm font-bold ${leftColorClass(result.tokyo.left)}`}>
            残 {result.tokyo.left >= 0 ? "+" : ""}
            {result.tokyo.left.toFixed(1)}万円/月
          </p>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <p className="mb-2 text-xs font-bold text-green-700">🌿 福島県北（就農研修中）</p>
          <p className="text-xs text-green-700">補助金込み手取り</p>
          <p className="font-mono text-xl font-bold text-green-700">{result.fukushima.subsidy.toFixed(1)}万円</p>
          <p className="mt-1 text-[10px] text-muted">就農準備資金含む</p>
          <p className={`mt-1.5 font-mono text-sm font-bold ${leftColorClass(result.fukushima.left)}`}>
            残 {result.fukushima.left >= 0 ? "+" : ""}
            {result.fukushima.left.toFixed(1)}万円/月
          </p>
        </Card>
      </div>

      {/* コメント */}
      <Card className="mt-3 border-l-[3px] border-green-400">
        <p className="text-sm leading-relaxed text-ink">{result.comment}</p>
      </Card>

      {/* 詳細テーブル */}
      <div className="mt-3 overflow-hidden rounded border border-black/5">
        <div className="bg-green-50 px-3.5 py-2 text-xs font-bold text-green-800">📊 月間家計の内訳</div>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8F8F8]">
              <th className="border-b border-black/5 px-3 py-2 text-left font-bold text-muted">項目</th>
              <th className="border-b border-black/5 px-3 py-2 text-right font-bold text-red">🗼 東京</th>
              <th className="border-b border-black/5 px-3 py-2 text-right font-bold text-green-700">🌿 福島県北</th>
            </tr>
          </thead>
          <tbody>
            <TableRow label="家賃" tokyo={`約${result.tokyo.rent}万円`} fukushima={`約${result.fukushima.rent.toFixed(1)}万円`} />
            <TableRow label="食費" tokyo={`約${result.tokyo.food.toFixed(1)}万円`} fukushima={`約${result.fukushima.food.toFixed(1)}万円`} />
            <TableRow label="光熱費" tokyo={`約${result.tokyo.util.toFixed(1)}万円`} fukushima={`約${result.fukushima.util.toFixed(1)}万円`} />
            <TableRow
              label="交通費"
              tokyo={`約${result.tokyo.trans.toFixed(1)}万円`}
              fukushima={
                <>
                  約{result.fukushima.trans.toFixed(1)}万円
                  <br />
                  <span className="text-[10px] text-muted">（車維持費含む）</span>
                </>
              }
            />
            <TableRow label="通信費" tokyo={`約${result.tokyo.comm.toFixed(1)}万円`} fukushima={`約${result.fukushima.comm.toFixed(1)}万円`} />
            <TableRow label="娯楽・交際費" tokyo={`約${result.tokyo.enter.toFixed(1)}万円`} fukushima={`約${result.fukushima.enter.toFixed(1)}万円`} />
            <TableRow
              label="月間支出 計"
              tokyo={`約${result.tokyo.total.toFixed(1)}万円`}
              fukushima={`約${result.fukushima.total.toFixed(1)}万円`}
              bold
            />
            <TableRow
              label="就農準備資金"
              tokyo="なし"
              fukushima={
                <>
                  +{result.fukushima.subsidy.toFixed(1)}万円/月
                  <br />
                  <span className="text-[10px]">(年150万円)</span>
                </>
              }
              highlight
            />
            <TableRow
              label="月末に残るお金"
              tokyo={
                <span className={leftColorClass(result.tokyo.left)}>
                  {result.tokyo.left >= 0 ? "+" : ""}
                  {result.tokyo.left.toFixed(1)}万円
                </span>
              }
              fukushima={
                <span className={leftColorClass(result.fukushima.left)}>
                  {result.fukushima.left >= 0 ? "+" : ""}
                  {result.fukushima.left.toFixed(1)}万円（補助金のみ）
                </span>
              }
              bold
              highlight
            />
          </tbody>
        </table>
      </div>

      <WarningBox type="warn" className="mt-2.5">
        ⚠️ 東京の家賃は手取りから推算。福島県北の家賃はSUUMO 2024年12月データ（福島市周辺4〜5万円）。食費・光熱費は総務省家計調査2024年・単身世帯データを参照。農業収入は含まず。
      </WarningBox>

      <Link
        href="/simulator"
        className="mt-2.5 block w-full rounded bg-green-700 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
      >
        🌿 自分の条件でシミュレーターを試す
      </Link>

      {/* ── 世帯タイプ別カテゴリ比較 ── */}
      <div className="mt-10 border-t border-black/5 pt-6">
        <p className="mb-3 text-sm font-bold text-ink">世帯タイプ別の生活コスト比較</p>
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
              <p className="mb-2 text-xs font-bold text-sky-900">🗼 東京・首都圏（月額）</p>
              <div className="space-y-2">
                {persona.categories.map((c) => (
                  <Bar key={c.name} label={c.name} value={c.tokyo} max={max} colorClass="bg-sky-900" />
                ))}
              </div>
              <p className="mt-2 text-right text-sm font-bold text-ink">合計 {tokyoTotal.toFixed(1)}万円/月</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-green-700">🌿 福島県北（月額）</p>
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
    </div>
  );
}
