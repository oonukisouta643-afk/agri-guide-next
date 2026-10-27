"use client";

import { useState } from "react";
import { HeroLive, type HeroVariant } from "@/components/home/HeroLive";

// 背景の動きを切り替えて見比べる（見本ページ専用）
const OPTIONS: { v: HeroVariant; label: string; note: string }[] = [
  { v: "day", label: "光で一日が流れる＋作業の帯", note: "約60秒で、夜中 → 夜明け → 朝 → 昼 → 夕方 → 夜。下の細い帯に時間帯と作業（例）。" },
  { v: "season", label: "季節が巡る", note: "8秒ごとに季節が変わる。写真が揃うまでは、同じ写真の色合いで仮に表しています。" },
  { v: "clouds", label: "雲の影が流れる", note: "畑の上を雲の影がゆっくり流れる。本番では写真を空・木・地面に分けて、木や草をわずかに揺らします。" },
  { v: "zoom", label: "ゆっくり寄る", note: "約28秒かけて写真にゆっくり寄り、戻る。" },
];

export function HeroBgCompare() {
  const [v, setV] = useState<HeroVariant>("day");
  const opt = OPTIONS.find((o) => o.v === v) ?? OPTIONS[0];
  return (
    <>
      <div className="border-b border-green-200 bg-green-50 px-5 py-3 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-2">
          <p className="text-sm font-bold text-ink">見本：トップの背景の動きを見比べる（このバーは見本だけのものです）</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="背景の動きを選ぶ">
            {OPTIONS.map((o) => (
              <button
                key={o.v}
                type="button"
                aria-pressed={o.v === v}
                onClick={() => setV(o.v)}
                className={`min-h-[40px] rounded-full border px-4 py-1.5 text-sm font-bold ${
                  o.v === v ? "border-green-700 bg-green-700 text-white" : "border-green-200 bg-white text-ink hover:bg-green-50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">{opt.note}</p>
        </div>
      </div>
      {/* key で切り替えのたびに作り直す（時間を最初から） */}
      <HeroLive key={v} variant={v} />
    </>
  );
}
