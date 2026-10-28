"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { HERO_DAY_LINES, HERO_SEASON_ORDER, HERO_SEASON_SOURCE_SHORT, SEASONS } from "@/data/farmSeasons";

// トップのファーストビュー（見本：右側に、季節ごとの「農家の一日」を1行ずつ出す版）
// 左は今の Hero（src/components/sections/Hero.tsx）と同じ文言。右（スマホではボタンの下）に、
// 季節の見出し → その季節の一日を上から1行ずつ → 数秒止まる → 消えて次の季節（夏→秋→冬→春→初夏→夏…）。
// 枠や白い背景は使わず、写真の上に白い文字で出す（右側に黒っぽいグラデーションと文字の影）。
// 一時停止のボタンあり。動きを減らす設定のときは夏の一日を全部出して止める。タブが見えていない間は進めない。
// 行のデータは src/data/farmSeasons.ts の HERO_DAY_LINES（夏は peachFarmerDay の仮データを短くしたもの、ほかは時間帯だけの例）。
// 背景：農村風景の写真（Unsplash、フリー素材）。県北の写真ではない。

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80";

const HEAD_MS = 1000; // 見出しを出してから最初の行までの間
const LINE_MS = 1300; // 1行ごとの間
const HOLD_MS = 4000; // 全部出したあと止まっている長さ
const OUT_MS = 700; // 消えている時間

type Stage = "lines" | "hold" | "out";

const SEASON_META = Object.fromEntries(SEASONS.map((s) => [s.key, s]));

export function HeroDay() {
  // 初期値は固定（サーバーで描く最初の絵と合わせる）：夏・0行・行を出している途中
  const [order, setOrder] = useState(0);
  const [shown, setShown] = useState(0);
  const [stage, setStage] = useState<Stage>("lines");
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [tick, setTick] = useState(0); // タブが隠れている間の待ち直し用

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduce(mq.matches);
      if (mq.matches) {
        setOrder(0);
        setShown(HERO_DAY_LINES.summer.length);
        setStage("hold");
      }
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const key = HERO_SEASON_ORDER[order];
  const lines = HERO_DAY_LINES[key];

  useEffect(() => {
    if (reduce || paused) return;
    const delay = stage === "lines" ? (shown === 0 ? HEAD_MS : LINE_MS) : stage === "hold" ? HOLD_MS : OUT_MS;
    const id = window.setTimeout(() => {
      if (document.hidden) {
        setTick((t) => t + 1); // 進めずに待ち直す
        return;
      }
      if (stage === "lines") {
        const next = shown + 1;
        setShown(next);
        if (next >= lines.length) setStage("hold");
      } else if (stage === "hold") {
        setStage("out");
      } else {
        setOrder((o) => (o + 1) % HERO_SEASON_ORDER.length);
        setShown(0);
        setStage("lines");
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [reduce, paused, stage, shown, lines.length, tick]);

  const meta = SEASON_META[key];
  const summerSummary = HERO_DAY_LINES.summer.map((l) => `${l.label} ${l.text}`).join("、");
  const shadow = { textShadow: "0 1px 3px rgba(0,0,0,0.75)" };

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-10 sm:py-20">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-green-900/60 to-green-900/80" aria-hidden="true" />
      {/* 右側の文字を読みやすくする黒っぽいグラデーション（PC） */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-black/55 to-transparent lg:block" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        {/* 左：今のトップと同じ文言 */}
        <div className="mx-auto max-w-content text-center">
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
        </div>

        {/* 右（スマホではボタンの下）：季節ごとの農家の一日 */}
        <div className="mx-auto w-full max-w-sm text-white lg:max-w-none" style={shadow} data-hero-day>
          <div className="flex items-start justify-between gap-3">
            <p
              className="min-w-0 text-sm font-bold tracking-wide transition-opacity duration-700"
              style={{ opacity: stage === "out" ? 0 : 1 }}
              aria-hidden="true"
              data-hero-day-heading
            >
              <span className="text-lg">{meta.name}</span>
              <span className="ml-2 text-white/85">{meta.months}</span>
              <span className="ml-2">{meta.theme}</span>
            </p>
            {!reduce && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "農家の一日の動きを再生" : "農家の一日の動きを一時停止"}
                aria-pressed={paused}
                className="inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-full border border-white/50 px-3 text-xs font-bold text-white hover:bg-white/10"
                style={{ textShadow: "none" }}
                data-hero-day-pause
              >
                <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true">
                  <path d={paused ? "M3 2l9 5-9 5z" : "M3 2h3v10H3zM8 2h3v10H8z"} fill="currentColor" />
                </svg>
                {paused ? "再生" : "一時停止"}
              </button>
            )}
          </div>

          {/* 一日の行（9行分の高さをとっておき、季節が変わっても下が動かないようにする） */}
          <ol
            className="mt-3 min-h-[15.75rem] space-y-1 transition-opacity duration-700"
            style={{ opacity: stage === "out" ? 0 : 1 }}
            aria-hidden="true"
            data-hero-day-lines
          >
            {lines.map((l, k) => {
              const visible = k < shown;
              return (
                <li
                  key={`${key}-${k}`}
                  className="flex gap-3 text-sm leading-6 transition-all duration-700"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(6px)" }}
                  data-visible={visible ? "1" : "0"}
                >
                  <span className="w-[4.5em] shrink-0 font-mono text-xs leading-6 text-white/80">{l.label}</span>
                  <span className="min-w-0">{l.text}</span>
                </li>
              );
            })}
          </ol>

          <p className="sr-only">
            桃農家の夏（収穫期）の一日の例：{summerSummary}。季節によって一日の流れは変わります。
          </p>

          <p className="mt-3 text-[11px] leading-relaxed text-white/75">
            時刻と作業は例です（夏の時刻は仮データ。農家さん・品種・天候で変わります）。{HERO_SEASON_SOURCE_SHORT}
          </p>
        </div>
      </div>
    </section>
  );
}
