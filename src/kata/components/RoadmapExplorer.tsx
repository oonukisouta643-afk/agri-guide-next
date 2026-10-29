"use client";

// 道のりを、面積と単価を変えて計算し直す部品。グラフの直下に前提条件を必ず出す。
import { useState } from "react";
import type { CropRoadmap } from "../types";
import {
  calcRoadmap, NEW_PLANTING_COST_FLOOR, NEW_PLANTING_YIELD_RATIO, RENT_YEN_PER_TEN_A, ROADMAP_YEARS,
  TAKEOVER_COST_FIXED_SHARE, TAKEOVER_ONE_TIME_YEN_PER_TEN_A, TAKEOVER_YIELD_RATIO,
} from "../roadmap";
import { fmtMan, fmtNumber, fmtYen } from "../format";
import { RoadmapChart, RoadmapTable } from "./RoadmapChart";
import { KindBadge } from "./KindBadge";

const AREAS = [30, 60, 100];
const PRICE_DELTAS = [-20, -10, 0, 10, 20];
const pct = (r: number) => `${fmtNumber(r * 100)}%`;

export function RoadmapExplorer({ crop, defaultAreaA = 60 }: { crop: CropRoadmap; defaultAreaA?: number }) {
  const [areaA, setAreaA] = useState(defaultAreaA);
  const [priceDeltaPct, setPriceDeltaPct] = useState(0);
  const series = [
    { label: "新しく植える", points: calcRoadmap(crop, { areaA, route: "newPlanting", priceDeltaPct }) },
    { label: "先輩の園地を受け継ぐ", points: calcRoadmap(crop, { areaA, route: "takeover", priceDeltaPct }) },
  ];
  const ramp = NEW_PLANTING_YIELD_RATIO[crop.id] ?? [];
  const total = (i: number) => series[i].points.reduce((a, p) => a + p.income, 0);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          経営面積
          <select value={areaA} onChange={(e) => setAreaA(Number(e.target.value))} className="rounded border border-gray-300 px-2 py-1">
            {AREAS.map((a) => <option key={a} value={a}>{a}a</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          単価
          <select value={priceDeltaPct} onChange={(e) => setPriceDeltaPct(Number(e.target.value))} className="rounded border border-gray-300 px-2 py-1">
            {PRICE_DELTAS.map((d) => <option key={d} value={d}>{d === 0 ? "そのまま" : `${d > 0 ? "+" : ""}${d}%`}</option>)}
          </select>
        </label>
      </div>

      <p className="mb-1 flex items-center gap-2 text-xs text-gray-600"><KindBadge kind="estimate" />グラフと表の数字はすべて推計</p>
      <RoadmapChart series={series} title={`${crop.name}の道のり（${areaA}a、1〜${ROADMAP_YEARS}年目の農業所得）`} />

      <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-gray-800">
        <p className="font-bold">この計算の前提（推計。約束された数字ではありません）</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>経営面積 {areaA}a。単価 {priceDeltaPct === 0 ? "そのまま" : `${priceDeltaPct > 0 ? "+" : ""}${priceDeltaPct}%`}（単価を変えても経営費は変えていない）</li>
          <li>農業所得＝販売額−経営費−地代。補助金・国の支援・経営開始資金は入れていない。生活費・税金・借入の返済も入っていない</li>
          <li>新しく植える：成園に対する収量の割合を 1〜{ramp.length}年目に {ramp.map(pct).join("・")} と置いた（推測を含む）。経営費＝成園の経営費×（{NEW_PLANTING_COST_FLOOR}＋{fmtNumber(1 - NEW_PLANTING_COST_FLOOR, 1)}×収量の割合）。1年目に初期投資 {fmtYen(crop.initialInvestmentPerTenA.value ?? 0)}/10a</li>
          <li>先輩の園地を受け継ぐ：慣れるまでの収量の割合を {TAKEOVER_YIELD_RATIO.slice(0, 4).map(pct).join("・")}（4年目以降100%）と置いた（推測。根拠になる資料は見つからなかった。4年目に成園の収量（県の果樹農業振興計画の値）に届くのは楽観的な仮定）。経営費＝成園の経営費×（{TAKEOVER_COST_FIXED_SHARE}＋{fmtNumber(1 - TAKEOVER_COST_FIXED_SHARE, 1)}×収量の割合）。譲り受けの一時金 {fmtYen(TAKEOVER_ONE_TIME_YEN_PER_TEN_A)}/10a（賃貸で受け継ぐ場合。条件は園地ごとに違う）</li>
          <li>地代 {fmtYen(RENT_YEN_PER_TEN_A)}/10a/年。単価・経営費は長野県の経営指標で、福島の値ではない</li>
          <li>{ROADMAP_YEARS}年間の農業所得の合計：新しく植える {fmtMan(total(0))}、受け継ぐ {fmtMan(total(1))}</li>
        </ul>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-gray-700">グラフの数字を表で見る</summary>
        <div className="mt-2">
          <RoadmapTable series={series} />
        </div>
      </details>
    </div>
  );
}
