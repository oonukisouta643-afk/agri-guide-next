"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

// トップのファーストビュー（見本：背景の動きの比べ）
// src/components/sections/Hero.tsx と同じ形・同じ文言で、背景の動きだけを variant で切り替える。
// - day：光で一日が流れる（約60秒）＋ 下の細い帯に時間帯と作業（例）
// - season：季節が巡る（写真が揃うまでは、同じ写真の色合いで仮に表す）
// - clouds：雲の影が流れる（本番では写真を空・木・地面の層に分けて揺らす）
// - zoom：ゆっくり寄る
// 動きを減らす設定のときは、どれも止まった絵（朝）にする。
// 背景：農村風景の写真（Unsplash、フリー素材）。県北の写真ではない。

export type HeroVariant = "day" | "season" | "clouds" | "zoom";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80";

// 一日の光（t：0〜1。0＝夜中）。色を重ねる強さ a
const DAY_KEYS: { t: number; c: [number, number, number]; a: number }[] = [
  { t: 0.0, c: [13, 19, 48], a: 0.62 },
  { t: 0.17, c: [40, 52, 96], a: 0.45 }, // 4時ごろ
  { t: 0.23, c: [255, 150, 90], a: 0.28 }, // 夜明け
  { t: 0.32, c: [255, 210, 150], a: 0.12 }, // 朝
  { t: 0.5, c: [255, 255, 255], a: 0.0 }, // 昼
  { t: 0.7, c: [255, 220, 170], a: 0.08 },
  { t: 0.76, c: [255, 120, 60], a: 0.3 }, // 夕方
  { t: 0.84, c: [60, 50, 100], a: 0.45 },
  { t: 1.0, c: [13, 19, 48], a: 0.62 },
];
function dayTint(t: number) {
  let i = 0;
  while (i < DAY_KEYS.length - 2 && t > DAY_KEYS[i + 1].t) i++;
  const a = DAY_KEYS[i];
  const b = DAY_KEYS[i + 1];
  const k = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  const m = (x: number, y: number) => Math.round(x + (y - x) * k);
  return `rgba(${m(a.c[0], b.c[0])}, ${m(a.c[1], b.c[1])}, ${m(a.c[2], b.c[2])}, ${(a.a + (b.a - a.a) * k).toFixed(3)})`;
}

// 時間帯と作業（例：収穫期のもも農家の一日。「農家の一日」の見本の夏の文と同じ流れ）。
// 時刻は出典がないので出さず、「夜明け前」「朝」などの言い方にする（h は光の変化に合わせた区切り）
const DAY_STEPS = [
  { h: 0, label: "夜中　休んでいる時間" },
  { h: 3.5, label: "夜明け前　涼しいうちに収穫" },
  { h: 7, label: "朝　選果と箱詰め" },
  { h: 10, label: "昼まで　集荷場へ出荷" },
  { h: 12.5, label: "午後　園地の手入れ" },
  { h: 16.5, label: "夕方　片付けと翌日の準備" },
  { h: 19.5, label: "夜　記録して、早めに休む" },
  { h: 23, label: "夜中　休んでいる時間" },
];

// 季節（色合いで仮に表す）。見出しが読みにくくならないよう、明るくする重ねは弱めにしている
const SEASONS = [
  { label: "4月　花の季節", tint: "rgba(255, 170, 200, 0.16)", filter: "saturate(1.05) hue-rotate(-12deg)" },
  { label: "5〜6月　摘果と袋かけ", tint: "rgba(120, 200, 110, 0.14)", filter: "saturate(1.25) hue-rotate(25deg)" },
  { label: "7〜9月上旬　収穫と出荷", tint: "rgba(255, 200, 120, 0.12)", filter: "saturate(1.1)" },
  { label: "9〜10月　来年への手入れ", tint: "rgba(230, 120, 40, 0.2)", filter: "saturate(1.15) sepia(0.25)" },
  { label: "1〜2月　剪定", tint: "rgba(220, 228, 235, 0.16)", filter: "grayscale(0.7)" },
];

const DAY_SECONDS = 60;
const SEASON_SECONDS = 8;

export function HeroLive({ variant }: { variant: HeroVariant }) {
  const [t, setT] = useState(0.32); // 朝（サーバーで描く最初の絵と、動きを減らす設定のときの絵）
  const [season, setSeason] = useState(2);
  const [seasonClock, setSeasonClock] = useState(0); // 季節：経過秒数から決める
  const [reduce, setReduce] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // 動きを減らす設定になったら、止まった絵（朝・夏）に戻す
  useEffect(() => {
    if (!reduce) return;
    setT(0.32);
    setSeason(2);
  }, [reduce]);

  // 時間を進める（一日と季節のときだけ。4回/秒。止めている間・タブが見えていない間の時間は足さない）
  useEffect(() => {
    if (reduce || paused || (variant !== "day" && variant !== "season")) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(now - last, 500) / 1000;
      last = now;
      if (document.hidden) return;
      if (variant === "day") setT((p) => (p + dt / DAY_SECONDS) % 1);
      if (variant === "season") setSeasonClock((p) => p + dt);
    }, 250);
    return () => window.clearInterval(id);
  }, [variant, reduce, paused]);

  useEffect(() => {
    if (variant === "season") setSeason((2 + Math.floor(seasonClock / SEASON_SECONDS)) % SEASONS.length);
  }, [seasonClock, variant]);

  // 一日は夜明け前（収穫）から始める
  useEffect(() => {
    if (variant === "day" && !reduce) setT(0.16);
  }, [variant, reduce]);

  const hour = t * 24;
  const step = [...DAY_STEPS].reverse().find((s) => hour >= s.h) ?? DAY_STEPS[0];
  const se = SEASONS[season];
  const moving = !reduce; // CSS の動きは、止めるときは一時停止（animation-play-state）にする
  const playState = paused ? "paused" : "running";

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-10 sm:py-28">
      <div
        className={`absolute inset-0 bg-cover bg-center ${moving && variant === "zoom" ? "hl-zoom" : ""} ${moving && variant === "clouds" ? "hl-breathe" : ""}`}
        style={{
          backgroundImage: `url('${HERO_IMAGE_URL}')`,
          animationPlayState: playState,
          filter: variant === "season" ? se.filter : undefined,
          transition: "filter 2s ease",
        }}
        aria-hidden="true"
      />
      {/* 一日の光・季節の色 */}
      {variant === "day" && <div className="absolute inset-0" style={{ background: dayTint(t), transition: "background .25s linear" }} aria-hidden="true" />}
      {variant === "season" && <div className="absolute inset-0" style={{ background: se.tint, transition: "background 2s ease" }} aria-hidden="true" />}
      {/* 雲の影 */}
      {variant === "clouds" && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className={`hl-cloud ${moving ? "hl-cloud-move" : ""}`} style={{ top: "35%", animationDuration: "48s", animationPlayState: playState }} />
          <div className={`hl-cloud ${moving ? "hl-cloud-move" : ""}`} style={{ top: "60%", width: "70%", animationDuration: "64s", animationDelay: "-24s", animationPlayState: playState }} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-green-900/60 to-green-900/80" aria-hidden="true" />

      {/* 一時停止（自動で動き続けるものには止める手段を置く）。動きを減らす設定のときは出さない */}
      {!reduce && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "背景の動きを再生" : "背景の動きを一時停止"}
          className="absolute right-3 top-3 z-10 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/40 bg-black/30 px-3 text-xs font-bold text-white hover:bg-black/45"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d={paused ? "M3 2l9 5-9 5z" : "M3 2h3v10H3zM8 2h3v10H8z"} fill="currentColor" />
          </svg>
          {paused ? "再生" : "一時停止"}
        </button>
      )}

      <div className="relative mx-auto max-w-content text-center">
        <p className="sr-only">背景は、農村の写真に動きをつけたイメージです。</p>
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

      {/* 下の細い帯（一日：時間帯と作業、季節：いまの季節）。変わる文は読み上げない */}
      {(variant === "day" || variant === "season") && (
        <div className="absolute inset-x-0 bottom-0 px-5 pb-3 sm:px-10" aria-hidden="true">
          {variant === "day" && (
            <div className="mx-auto h-0.5 max-w-3xl overflow-hidden rounded bg-white/25">
              <div className="h-full bg-white/80" style={{ width: `${Math.max(1, t * 100)}%` }} />
            </div>
          )}
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-white/85 sm:text-sm">
            {variant === "day" ? (
              <>
                {step.label}
                <span className="ml-2 text-white/60">（収穫期のもも農家の一日の例）</span>
              </>
            ) : (
              <>
                {se.label}
                <span className="ml-2 text-white/60">（写真が揃うまで、色合いで仮に表しています）</span>
              </>
            )}
          </p>
        </div>
      )}

      <style>{`
        @keyframes hl-zoom { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.12) translate(-1.5%, -1%); } }
        .hl-zoom { animation: hl-zoom 28s ease-in-out infinite alternate; transform-origin: 60% 50%; }
        @keyframes hl-breathe { from { transform: scale(1.02); } to { transform: scale(1.05); } }
        .hl-breathe { animation: hl-breathe 18s ease-in-out infinite alternate; }
        .hl-cloud { position: absolute; left: -60%; width: 60%; height: 45%; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(0,0,0,0.35), rgba(0,0,0,0)); filter: blur(10px); }
        @keyframes hl-cloud { from { transform: translateX(0); } to { transform: translateX(270%); } }
        .hl-cloud-move { animation-name: hl-cloud; animation-timing-function: linear; animation-iteration-count: infinite; }
        @media (prefers-reduced-motion: reduce) { .hl-zoom, .hl-breathe, .hl-cloud-move { animation: none; } }
      `}</style>
    </section>
  );
}
