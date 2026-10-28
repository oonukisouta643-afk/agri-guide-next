"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FRUIT_YEAR, monthState } from "@/data/fruitYear";

// トップのファーストビュー（見本：動きのある版）
// src/components/sections/Hero.tsx と同じ形・同じ文言で、次の2つを足したもの。
// 1. 背景の写真に、ゆっくり寄っていく動き（動きを減らす設定のときは止める）
// 2. 「今月の果樹園」：今月の各果樹の様子（src/data/fruitYear.ts。推測を含む）。タッチすると下の「果樹の1年」へ
// 背景：農村風景の写真（Unsplash、フリー素材）。県北の写真ではないので、いずれ県北で撮った写真に差し替える。

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80";

export function HeroMotion({ ringId = "year-ring" }: { ringId?: string }) {
  // 今月はブラウザで決める（サーバーで描く最初の絵には出さない）
  const [month, setMonth] = useState<number | null>(null);
  useEffect(() => {
    setMonth(new Date().getMonth() + 1);
  }, []);

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-10 sm:py-28">
      <div
        className="hero-kenburns absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-green-900/60 to-green-900/80"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-content text-center">
        <h1 className="text-white">農業という生き方を、もっとリアルに。</h1>
        <p className="mt-4 text-white/90">
          農業に興味はある。でも、まだ踏み出せていない。そんなあなたへ——福島県北に住む移住経験者が「農家人生のリアル」を一緒に解き明かします。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button href="/simulator" size="md" className="w-full sm:w-auto">
            🌿 就農シミュレーターを試す（無料・3分）
          </Button>
          <Button href="/tools" variant="ghost" size="sm" className="text-white hover:bg-white/10">
            まず農業カレンダーで1年を見てみる
          </Button>
        </div>

        {/* 今月の果樹園 */}
        <a
          href={`#${ringId}`}
          className="mx-auto mt-10 block min-h-[150px] max-w-md rounded border border-white/30 bg-black/25 px-4 py-3 text-left text-white backdrop-blur-sm transition-colors hover:bg-black/35 sm:min-h-[112px]"
        >
          {/* 今月が決まるまで（JavaScript が動く前）は、固定の文を出す */}
          {month === null && <p className="text-sm font-bold">果樹の1年を見る ↓</p>}
          {month !== null && (
            <>
              <p className="text-sm font-bold">{month}月の果樹園（目安）</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {FRUIT_YEAR.map((f) => {
                  const s = monthState(f, month);
                  return (
                    <li
                      key={f.key}
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        s.harvest ? "bg-gold text-ink" : s.busy === 3 ? "bg-white text-green-700" : "bg-white/15 text-white"
                      }`}
                    >
                      {f.name}：{s.word}
                      {s.harvest && f.harvestGuess ? "（推測）" : ""}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-white/80">忙しさは代表的な品種での、他県などの資料からの目安（推測）。タッチで果樹の1年へ ↓</p>
            </>
          )}
        </a>
      </div>

      <style>{`
        @keyframes hero-kenburns { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.12) translate(-1.5%, -1%); } }
        .hero-kenburns { animation: hero-kenburns 28s ease-in-out infinite alternate; transform-origin: 60% 50%; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .hero-kenburns { animation: none; } }
      `}</style>
    </section>
  );
}
