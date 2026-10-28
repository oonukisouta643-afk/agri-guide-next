"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { calendarCrops, type Busy } from "@/data/tools/calendarData";

// Tool A：農業カレンダー
// 2026年10月28日に作り直した：果樹4品目の、月ごとの忙しさと福島での収穫時期。数字の出典は src/data/tools/calendarData.ts。
// 色だけで区別しないよう、記号（◎○△）と文字も出す。

const busyStyles: Record<Busy, { cls: string; mark: string; text: string }> = {
  high: { cls: "border-green-700 bg-green-600 text-white", mark: "◎", text: "とても忙しい" },
  mid: { cls: "border-green-400 bg-green-100 text-ink", mark: "○", text: "忙しい" },
  low: { cls: "border-green-100 bg-white text-muted", mark: "△", text: "少ない" },
};

export function CalendarTool() {
  const [cropKey, setCropKey] = useState(calendarCrops[0].key);
  const crop = calendarCrops.find((c) => c.key === cropKey) ?? calendarCrops[0];

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        果樹は、月によって忙しさが大きく変わります。品目を選ぶと、1年の忙しさの目安と、福島での収穫時期が分かります。
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {calendarCrops.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCropKey(c.key)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              c.key === cropKey
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
          {crop.emoji} {crop.label}（{crop.variety}）の1年の忙しさ
        </p>
        <div className="mt-3 grid grid-cols-6 gap-1 sm:grid-cols-12">
          {crop.months.map((b, i) => {
            const s = busyStyles[b];
            return (
              <div key={i} className={`rounded border p-1.5 text-center ${s.cls}`}>
                <div className="text-[10px] font-bold">{i + 1}月</div>
                <div className="text-sm" aria-label={s.text}>
                  {s.mark}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted">
          <span>◎ とても忙しい</span>
          <span>○ 忙しい</span>
          <span>△ 少ない</span>
        </div>

        <p className="mt-5 text-xs font-bold text-ink">福島での収穫時期</p>
        <ul className="mt-1 list-disc pl-5 text-sm text-ink">
          {crop.harvest.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <p className="mt-4 text-[11px] leading-relaxed text-muted">根拠：{crop.basis}</p>
      </Card>

      <WarningBox type="warn" className="mt-3">
        ⚠️ 目安です。他県の資料をもとに福島の時期に合わせたもので、推定を含みます。実際の忙しさは、園地の広さ・品種・天候で変わります。
      </WarningBox>

      <Link
        href="/simulator"
        className="mt-3 block w-full rounded bg-green-700 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
      >
        🌿 シミュレーターで詳しく計算する →
      </Link>
    </div>
  );
}
