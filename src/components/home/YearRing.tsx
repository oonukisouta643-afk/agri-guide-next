"use client";

/**
 * YearRing — 果樹の「1年の輪」（県北ふくしまAgri-Guide）
 *
 * - 12か月を輪にして、月ごとの忙しさを輪の太さと色で、収穫の時期を外側の印で見せる。
 * - 月をタッチ（またはキーボードで選ぶ）と、その月の様子を出す。ページは移らない。ほかのページへは下のリンクから。
 * - 最初は今月を選んだ状態にする（今月はブラウザで決めるので、サーバーで描く最初の絵は選択なし）。
 * - activeMonths（ほかの部品で見せている季節の月）を太い縁取りで示す。
 * - 値は src/data/fruitYear.ts（推測を含む）。
 */

import { useEffect, useRef, useState } from "react";
import { BUSY_WORD, FRUIT_YEAR, monthState, type Busy } from "@/data/fruitYear";

const FILL: Record<Busy, string> = { 1: "var(--g3)", 2: "var(--g5)", 3: "var(--g6)" };
const C = 160; // 中心
const R_IN = 74;

function arc(i: number, rOut: number) {
  const p = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
  };
  const a0 = -90 + i * 30 + 1.2;
  const a1 = -90 + (i + 1) * 30 - 1.2;
  return `M${p(R_IN, a0)} L${p(rOut, a0)} A${rOut} ${rOut} 0 0 1 ${p(rOut, a1)} L${p(R_IN, a1)} A${R_IN} ${R_IN} 0 0 0 ${p(R_IN, a0)} Z`;
}
function at(i: number, r: number) {
  const a = ((-90 + i * 30 + 15) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

export default function YearRing({ activeMonths = [], id }: { activeMonths?: readonly number[]; id?: string }) {
  const [fk, setFk] = useState(FRUIT_YEAR[0].key);
  const [sel, setSel] = useState<number | null>(null); // 0〜11
  const segRefs = useRef<(SVGGElement | null)[]>([]);
  const f = FRUIT_YEAR.find((x) => x.key === fk) ?? FRUIT_YEAR[0];
  const peak = f.busy
    .map((b, i) => (b === 3 ? i + 1 : 0))
    .filter(Boolean)
    .join("・");

  // 最初は今月を選ぶ
  useEffect(() => {
    setSel(new Date().getMonth());
  }, []);

  const pick = (i: number) => {
    setSel(i);
    segRefs.current[i]?.focus();
  };

  return (
    <section id={id} aria-label="果樹の1年" className="scroll-mt-16 px-5 py-14 sm:px-10 sm:py-[72px]">
      <div className="mx-auto grid max-w-5xl items-center gap-8 rounded-lg border border-green-200 bg-white p-5 shadow-sm sm:p-8 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="果樹を選ぶ">
            {FRUIT_YEAR.map((x) => (
              <button
                key={x.key}
                type="button"
                aria-pressed={x.key === fk}
                onClick={() => setFk(x.key)}
                className={`min-h-[40px] rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
                  x.key === fk ? "border-green-700 bg-green-700 text-white" : "border-green-200 bg-white text-ink hover:bg-green-50"
                }`}
              >
                {x.name}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 320 320" className="block w-full max-w-[340px]" role="group" aria-label={`${f.name}の1年。月を選ぶと、その月の様子が出ます`}>
            {f.busy.map((b, i) => {
              const m = i + 1;
              const active = activeMonths.includes(m);
              const chosen = sel === i;
              const lab = at(i, R_IN + 12);
              const mark = at(i, R_IN + 14 + 3 * 14 + 14);
              const isHarvest = f.harvest.includes(m);
              return (
                <g
                  key={m}
                  ref={(el) => {
                    segRefs.current[i] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={chosen}
                  aria-label={`${m}月：${BUSY_WORD[b]}${isHarvest ? "、収穫の時期" : ""}`}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pick(i);
                    }
                  }}
                  className="cursor-pointer outline-none [&:focus-visible>path]:stroke-[var(--ink)] [&:focus-visible>path]:[stroke-width:5px]"
                >
                  <path
                    d={arc(i, R_IN + 14 + b * 14)}
                    fill={FILL[b]}
                    stroke={chosen ? "var(--ink)" : active ? "var(--gold)" : "#FFFFFF"}
                    strokeWidth={chosen || active ? 3 : 1.5}
                    style={{ transition: "fill .4s ease" }}
                  />
                  <text x={lab.x} y={lab.y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={b === 3 ? "#FFFFFF" : "var(--ink)"}>
                    {m}
                  </text>
                  {isHarvest && (
                    <g>
                      <circle cx={mark.x} cy={mark.y} r={10} fill="var(--gold)" />
                      <text x={mark.x} y={mark.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
                        収
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {/* 真ん中の木 */}
            <circle cx={C} cy={C} r={R_IN - 6} fill="var(--g1)" />
            <path d={`M${C} ${C + 30} L${C} ${C + 6} M${C} ${C + 12} L${C - 14} ${C - 2} M${C} ${C + 10} L${C + 15} ${C - 3}`} stroke="#5A4535" strokeWidth={4} strokeLinecap="round" fill="none" />
            <ellipse cx={C - 13} cy={C - 8} rx={17} ry={11} fill="var(--g5)" />
            <ellipse cx={C + 14} cy={C - 9} rx={18} ry={11} fill="var(--g6)" />
            <ellipse cx={C} cy={C - 18} rx={16} ry={10} fill="var(--g5)" opacity={0.85} />
            <text x={C} y={C + 46} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ink)">
              {f.name}
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs font-bold lowercase tracking-widest text-green-700">果樹の1年</p>
          <h2 className="text-ink">いつ忙しくて、いつ収穫できる？</h2>
          <p className="text-ink">
            {f.name}で一番忙しいのは<strong>{peak}月</strong>（{f.busyBasis}の場合）。収穫は<strong>{f.harvestText}</strong>。
          </p>
          <div className="rounded bg-green-50 px-4 py-3" aria-live="polite">
            {sel === null ? (
              <p className="text-sm text-muted">輪の月をタッチすると、その月の様子が出ます。</p>
            ) : (
              <p className="text-ink">
                <strong>{sel + 1}月</strong>：{BUSY_WORD[f.busy[sel]]}（{f.busyBasis}の場合）
                {monthState(f, sel + 1).harvest ? "。収穫の時期です" : ""}
                {monthState(f, sel + 1).harvest && f.harvestGuess ? "（推測）" : ""}
                {monthState(f, sel + 1).harvest && f.key === "peach" && f.busy[sel] === 1 ? "（晩生の品種）" : ""}
              </p>
            )}
          </div>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <li className="flex items-center gap-1">
              <span className="inline-block h-3.5 w-3.5 rounded-sm" style={{ background: FILL[1] }} />
              少ない
            </li>
            <li className="flex items-center gap-1">
              <span className="inline-block h-3.5 w-3.5 rounded-sm" style={{ background: FILL[2] }} />
              忙しい
            </li>
            <li className="flex items-center gap-1">
              <span className="inline-block h-3.5 w-3.5 rounded-sm" style={{ background: FILL[3] }} />
              とても忙しい
            </li>
            <li className="flex items-center gap-1">
              <span className="inline-block h-3.5 w-3.5 rounded-full" style={{ background: "var(--gold)" }} />
              収穫の時期
            </li>
          </ul>
          <p className="text-sm text-ink">
            10aあたりの年間の労働時間は <strong>{f.hours}</strong>（福島県果樹農業振興計画書、令和8年3月）。
          </p>
          <div className="flex flex-col gap-1.5">
            <a href="/tools#calendar" className="font-bold text-green-700 hover:underline">
              月ごとの作業を見る（農業カレンダー）→
            </a>
            {f.inProfitTool && (
              <a href="/tools#profit" className="font-bold text-green-700 hover:underline">
                品目ごとの収益を見る（品目別収益モデル）→
              </a>
            )}
            <a href="/simulator" className="font-bold text-green-700 hover:underline">
              自分の場合を試す（就農シミュレーター）→
            </a>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            忙しさは他県などの資料（労働時間や作業の時期）を福島の時期に合わせた目安（推測）。収穫の時期は、ももは福島県 果樹情報の平年、もも以外は推測。農業カレンダーと品目別収益モデルの中身は仮データで、ぶどうはまだ載っていません。
          </p>
        </div>
      </div>
    </section>
  );
}
