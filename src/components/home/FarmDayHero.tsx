"use client";

/**
 * FarmDayHero — トップの「農家の一日」アニメーション（県北ふくしまAgri-Guide）
 *
 * - 依存なし（React だけ）。SVG をコードで描く。画像・動画ファイルは使わない。
 * - もも農家の一年を、季節ごとの 5 つの一日（春・初夏・夏・秋・冬）で見せる。一日が終わると次の季節に進む。
 *   一日は夜明け前から夜まで 6 つの時間帯。木（花・葉・実）、田んぼ、地面、人と機械が季節で変わる。
 * - 季節の時期は出典つき（SEASON_SOURCE）。時間帯と作業の順番は「例」。農家の方への聞き取りで確かめて更新する。
 * - prefers-reduced-motion のときは止まった絵（春の朝）を出す。画面外・タブ非表示のときは止める。
 * - docs/src/FarmDayHero.tsx をもとに、2026年10月27日の大貫さんの決定で、夏だけの一日を季節ごとの一日に作り変えた
 *   （調べた記録：docs/history/2026-10-27_農家の一日_作業の見直しと置き場所.md）。夏の文と FACTS は変えていない。
 */

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import YearRing from "./YearRing";

/* ------------------------------------------------------------------ */
/* 文言（時間帯と作業は「例」として表示する。事実として書かない）       */
/* ------------------------------------------------------------------ */

const TIME_LABELS = ["夜明け前", "朝", "昼まで", "午後", "夕方", "夜"] as const;

type Stage = "blossom" | "young" | "fruit" | "autumn" | "bare";
type Phase = { title: string; desc: string };
type Season = { key: string; name: string; months: string; theme: string; stage: Stage; note: string; phases: Phase[] };

// 時期の出典（記録の 2 章）
// - aff：農林水産省 広報誌 aff 2019年5・6月号（福島市飯坂町のもも農家）
// - 県 果樹情報：福島県農林水産部農業振興課（果樹研究所の観測。令和元年度第11号、令和2年度第2〜5号・第9号）
export const SEASONS: Season[] = [
  {
    key: "spring",
    name: "春",
    months: "4月",
    theme: "花の季節",
    stage: "blossom",
    note: "あかつきの満開は平年で4月20日ごろ。県は開花期から幼果期にかけて霜の対策を呼びかけ、事前の備えとして下草をこまめに短く刈ることを挙げています。病気の防除は花が散ってから（県 果樹情報）。",
    phases: [
      { title: "冷え込む朝は、霜の見回り", desc: "花は霜に弱い時期です。冷え込みそうな朝は、暗いうちに園地の様子を見に行くこともあります。" },
      { title: "花の咲き具合を見る", desc: "園地が一面ピンクになる季節。木ごとに、花の咲き具合を確かめます。" },
      { title: "授粉", desc: "授粉が必要な品種では、花に一つずつ花粉をつけていきます。" },
      { title: "下草を短く刈る", desc: "地面が温まりやすいように、木の下の草を短く刈っておきます。霜への備えの一つです。" },
      { title: "片付けと、明日の天気の確認", desc: "道具を片付け、翌朝の冷え込みの予報を確かめます。" },
      { title: "記録して休む", desc: "花の咲いた日や作業を記録して、休みます。" },
    ],
  },
  {
    key: "early-summer",
    name: "初夏",
    months: "5〜6月",
    theme: "摘果と袋かけ",
    stage: "young",
    note: "摘果は5月から、仕上げの摘果は実の核が固まり始める前（6月上旬〜中旬ごろ）まで。品種によって、そのあと袋かけ（aff、県 果樹情報）。",
    phases: [
      { title: "身支度をして園地へ", desc: "日が長くなる季節。明るくなったら、園地に向かいます。" },
      { title: "摘果", desc: "小さな実を一つずつ見て、残す実を選び、ほかを落とします。実の大きさと味を決める作業です。" },
      { title: "摘果の続き", desc: "1本の木にたくさんの実がつくので、根気のいる作業が続きます。" },
      { title: "袋かけ", desc: "袋が必要な品種では、残した実に一つずつ袋をかけていきます。" },
      { title: "通路の草刈り", desc: "草がよく伸びる季節。乗用の草刈機で、木の間の通路を刈ります。" },
      { title: "早めに休む", desc: "明日も一日、木の上を見上げる作業です。早めに休みます。" },
    ],
  },
  {
    key: "summer",
    name: "夏",
    months: "7〜9月上旬",
    theme: "収穫と出荷",
    stage: "fruit",
    note: "収穫は品種をずらしながら、平年で7月上旬（はつひめ）から9月上旬（ゆうぞら）まで続きます。あかつきは平年で8月2日〜10日ごろ（県 果樹情報）。",
    phases: [
      { title: "涼しいうちに収穫", desc: "気温が上がる前に、熟したももを一つずつ手で収穫し、コンテナに入れていきます。" },
      { title: "選果と箱詰め", desc: "作業場で、傷や大きさを見て選り分け、出荷用の箱に詰めます。" },
      { title: "出荷", desc: "出荷の締め切りに間に合うように、軽トラで集荷場へ運びます。締め切りは12時と現場の方から聞いています（出荷先・地域・時期で違います。確認中）。" },
      { title: "園地の手入れ", desc: "次に収穫する木の色づきを見たり、草刈りなどの手入れをしたりします。" },
      { title: "片付けと翌日の準備", desc: "道具や機械を片付け、翌朝の収穫の段取りをします。" },
      { title: "記録して、早めに休む", desc: "出荷した量や作業を記録し、早めに休みます。翌朝もまた早いからです。" },
    ],
  },
  {
    key: "autumn",
    name: "秋",
    months: "9〜10月",
    theme: "来年への手入れ",
    stage: "autumn",
    note: "秋肥は9月のできるだけ早い時期に。勢いの強い木の秋の剪定は9月中旬ごろが目安。県は秋の防除も呼びかけています（県 果樹情報。防除は令和元年の呼びかけ）。",
    phases: [
      { title: "園地の見回り", desc: "収穫が終わった園地を回って、木の様子を確かめます。" },
      { title: "秋肥", desc: "実をつけて疲れた木に、肥料をやります。来年の花と実のための準備です。" },
      { title: "秋の剪定", desc: "勢いの強い木では、伸びすぎた枝を整理します。" },
      { title: "秋の防除", desc: "来年に病気を持ち越さないよう、スピードスプレーヤーで薬をまきます。" },
      { title: "片付け", desc: "日が短くなってきました。暗くなる前に片付けます。" },
      { title: "一年を振り返る", desc: "今年の収穫や売り上げを振り返って、来年の計画を考えます。" },
    ],
  },
  {
    key: "winter",
    name: "冬",
    months: "1〜2月",
    theme: "剪定",
    stage: "bare",
    note: "剪定は2月下旬までに（aff）。木の形と、来年の実のつき方を決める仕事です。",
    phases: [
      { title: "明るくなるのを待つ", desc: "冬は日の出が遅い季節。道具の手入れをして、明るくなるのを待ちます。" },
      { title: "剪定", desc: "はしごに上り、枝を一本ずつ見て切ります。木の形と、来年の実のつき方を決める仕事です。" },
      { title: "剪定の続き", desc: "木ごとに形が違うので、同じ切り方はできません。量をこなして覚えていく技術です。" },
      { title: "切った枝の片付け", desc: "切った枝を集めて、園地の外に運び出します。" },
      { title: "日が暮れる前に終わる", desc: "日が短いので、早めに作業を切り上げます。" },
      { title: "来年の準備", desc: "品種の組み合わせや、資材の準備を考えます。" },
    ],
  },
];

// 季節ごとの月（下の「1年の輪」で、いま見ている季節の月を縁取る）
const SEASON_MONTHS: Record<string, number[]> = {
  spring: [4],
  "early-summer": [5, 6],
  summer: [7, 8, 9],
  autumn: [9, 10],
  winter: [1, 2],
};

const DATA_SOURCES = [
  "1年の輪の忙しさ：他県などの資料（ももは山口県、なしは農林水産省、りんごは農林水産省と鳥取県、ぶどうは滋賀・福岡・岩手の作業暦）の月別の労働時間や作業の時期を、福島の開花・収穫の時期に合わせた目安（推測）。",
  "収穫の時期：ももは福島県 果樹情報（平年。品種をずらした場合）。なし・ぶどう・りんごは福島の満開日や他県の資料からの推測。",
  "10aあたりの年間の労働時間：福島県果樹農業振興計画書（令和8年3月）。",
];

const SEASON_SOURCE = "季節の時期の出典：農林水産省 広報誌 aff 2019年5・6月号（福島市飯坂町のもも農家）、福島県 果樹情報（農業振興課。果樹研究所の観測、平年は1986〜2015年の平均）。";

export const FACTS = [
  { value: "10aあたり 年225時間", text: "ももの成園の年間の労働時間（あかつき）", source: "出典：福島県果樹農業振興計画書（令和8年3月）" },
  { value: "5月と8月", text: "ももで一番忙しい時期。5月は摘果、8月は収穫", source: "山口県の資料の月別労働時間を、福島の開花・収穫の時期に合わせた目安（推測を含む）" },
  { value: "1日 約14時間", text: "60aを1人で担う場合の、一番忙しい月の1日の作業時間の目安", source: "山口県の資料の月別労働時間からの試算。兼業なら、この時期は家族の手伝いや雇用が前提になる見込みです（いずれも推測）" },
] as const;

/* ------------------------------------------------------------------ */
/* 色と光（時刻 t: 0〜1 で連続的に補間）                                */
/* ------------------------------------------------------------------ */

type Key = { t: number; top: string; hor: string; tint: string; tintA: number; night: number };

const KEYS: Key[] = [
  { t: 0.0, top: "#1C2645", hor: "#38466A", tint: "#1C2645", tintA: 0.0, night: 0.52 },
  { t: 0.08, top: "#3D557E", hor: "#E7A07A", tint: "#FFB27A", tintA: 0.16, night: 0.26 },
  { t: 0.2, top: "#7DB0DC", hor: "#F2DDBD", tint: "#FFD9A8", tintA: 0.06, night: 0.0 },
  { t: 0.42, top: "#5C9FDD", hor: "#CFE5F3", tint: "#FFFFFF", tintA: 0.0, night: 0.0 },
  { t: 0.6, top: "#68A6DB", hor: "#E2E5D6", tint: "#FFE7B8", tintA: 0.05, night: 0.0 },
  { t: 0.74, top: "#6C84B6", hor: "#F0AE78", tint: "#FF9C58", tintA: 0.17, night: 0.04 },
  { t: 0.86, top: "#33406C", hor: "#D27C5E", tint: "#8A5A80", tintA: 0.2, night: 0.28 },
  { t: 0.93, top: "#1A2341", hor: "#33416A", tint: "#1A2341", tintA: 0.0, night: 0.5 },
  { t: 1.0, top: "#1C2645", hor: "#38466A", tint: "#1C2645", tintA: 0.0, night: 0.52 },
];

function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}
function mix(a: string, b: string, k: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k);
}
function lightAt(t: number) {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const k = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  const ease = k * k * (3 - 2 * k);
  return {
    top: mix(a.top, b.top, ease),
    hor: mix(a.hor, b.hor, ease),
    tint: mix(a.tint, b.tint, ease),
    tintA: a.tintA + (b.tintA - a.tintA) * ease,
    night: a.night + (b.night - a.night) * ease,
  };
}

/* ------------------------------------------------------------------ */
/* 描画の部品                                                          */
/* ------------------------------------------------------------------ */

/** もも（開心自然形：低く横に広がる）。x,y は根元、s は遠近の倍率、v は木ごとのばらつき（0〜1） */
const LEAF = ["#466F36", "#4B763A", "#527E40", "#42683A", "#57804A"];
// 実の位置（根元からの相対。s 倍する）
const FRUIT: [number, number][] = [
  [-22, 24],
  [-11, 21],
  [1, 23],
  [12, 21],
  [23, 25],
];
// 季節ごとの葉（花）の色。bare は葉を描かない
const CANOPY: Record<Exclude<Stage, "bare">, { leaf: string[]; hi: string; opacity: number }> = {
  blossom: { leaf: ["#F2B8C6", "#EFA9BA", "#F5C6D2", "#EBA0B3", "#F7D0DA"], hi: "#FFF1F4", opacity: 1 },
  young: { leaf: ["#5E9440", "#669C45", "#6FA44C", "#5A8E3E", "#74A852"], hi: "#9CC774", opacity: 1 },
  fruit: { leaf: LEAF, hi: "#6C9852", opacity: 1 },
  autumn: { leaf: ["#C9A13E", "#B98A35", "#D4AE4A", "#A97B30", "#8E8A3C"], hi: "#E6C66A", opacity: 0.78 },
};
function PeachTree({ x, y, s, v, stage }: { x: number; y: number; s: number; v: number; stage: Stage }) {
  const a = (v * 7) % 1;
  const b = (v * 13) % 1;
  const lean = (a - 0.5) * 6;
  const pal = stage === "bare" ? null : CANOPY[stage];
  const c1 = pal ? pal.leaf[Math.floor(v * 5) % 5] : "";
  const c2 = pal ? pal.leaf[Math.floor(a * 5) % 5] : "";
  const c3 = pal ? pal.leaf[Math.floor(b * 5) % 5] : "";
  return (
    <g>
      <path
        d={`M${x - 2 * s} ${y} L${x - 1 * s} ${y - (11 + a * 3) * s} M${x - 1 * s} ${y - 12 * s} L${x - (11 + b * 4) * s} ${y - 24 * s} M${x - 1 * s} ${y - 12 * s} L${x + (10 + a * 4) * s} ${y - 25 * s} M${x - 1 * s} ${y - 12 * s} L${x + lean * s} ${y - 27 * s}`}
        stroke="#5A4535"
        strokeWidth={3 * s}
        strokeLinecap="round"
        fill="none"
      />
      {/* 冬：葉のない枝先（剪定前の細い枝） */}
      {stage === "bare" && (
        <path
          d={`M${x - (11 + b * 4) * s} ${y - 24 * s} l${-6 * s} ${-9 * s} M${x - (11 + b * 4) * s} ${y - 24 * s} l${3 * s} ${-11 * s} M${x + (10 + a * 4) * s} ${y - 25 * s} l${7 * s} ${-8 * s} M${x + (10 + a * 4) * s} ${y - 25 * s} l${-2 * s} ${-12 * s} M${x + lean * s} ${y - 27 * s} l${-4 * s} ${-10 * s} M${x + lean * s} ${y - 27 * s} l${5 * s} ${-9 * s}`}
          stroke="#6A5444"
          strokeWidth={1.4 * s}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {pal && (
        <g opacity={pal.opacity}>
          <ellipse cx={x - (14 + b * 4) * s} cy={y - (29 + a * 3) * s} rx={(17 + a * 5) * s} ry={(9 + b * 2) * s} fill={c1} />
          <ellipse cx={x + (14 + a * 4) * s} cy={y - (30 + b * 3) * s} rx={(18 + b * 5) * s} ry={(9.5 + a * 2) * s} fill={c2} />
          <ellipse cx={x + lean * s} cy={y - (36 + a * 2) * s} rx={(15 + b * 4) * s} ry={(8.5 + a * 2) * s} fill={c3} />
          <ellipse cx={x + (b - 0.5) * 20 * s} cy={y - 27 * s} rx={(10 + a * 4) * s} ry={5 * s} fill={c2} opacity={0.9} />
          <ellipse cx={x + (a - 0.5) * 10 * s} cy={y - 38 * s} rx={8 * s} ry={3.6 * s} fill={pal.hi} opacity={0.55} />
        </g>
      )}
      {/* 初夏：小さな青い実と、袋をかけた実 */}
      {stage === "young" && s > 0.7 && (
        <g>
          {FRUIT.map(([fx, fy], i) => {
            const cx = x + (fx + ((i % 2 ? a : b) - 0.5) * 4) * s;
            const cy = y - (fy + (i % 2 ? b : a) * 2) * s;
            return i % 2 === 0 ? (
              <rect key={i} x={cx - 2 * s} y={cy - 2.6 * s} width={4 * s} height={5.4 * s} rx={0.6 * s} fill="#F1E7C2" stroke="#D8CB9C" strokeWidth={0.4 * s} />
            ) : (
              <circle key={i} cx={cx} cy={cy} r={1.5 * s} fill="#9DBB5E" />
            );
          })}
        </g>
      )}
      {/* もも（収穫期の実。樹冠の下側に、1本に5個） */}
      {stage === "fruit" && s > 0.7 && (
        <g>
          {FRUIT.map(([fx, fy], i) => {
            const cx = x + (fx + ((i % 2 ? a : b) - 0.5) * 4) * s;
            const cy = y - (fy + (i % 2 ? b : a) * 2) * s;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={2.6 * s} fill="#E3876F" />
                <circle cx={cx - 0.8 * s} cy={cy - 0.8 * s} r={0.9 * s} fill="#F6C6AE" />
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}

/** 人（小さな後ろ姿・横向きのシルエット） */
function Person({ x, y, s, opacity }: { x: number; y: number; s: number; opacity: number }) {
  return (
    <g opacity={opacity} style={{ transition: "opacity .6s ease" }}>
      <ellipse cx={x} cy={y} rx={6 * s} ry={1.6 * s} fill="#1E2A1A" opacity={0.25} />
      <rect x={x - 3.2 * s} y={y - 9 * s} width={2.6 * s} height={9 * s} rx={1 * s} fill="#2F3438" />
      <rect x={x + 0.6 * s} y={y - 9 * s} width={2.6 * s} height={9 * s} rx={1 * s} fill="#2F3438" />
      <rect x={x - 4 * s} y={y - 20 * s} width={8 * s} height={12 * s} rx={2.5 * s} fill="#3F5F7A" />
      <circle cx={x} cy={y - 23.5 * s} r={3.4 * s} fill="#D8B597" />
      <path d={`M${x - 4.6 * s} ${y - 24.5 * s} Q${x} ${y - 30 * s} ${x + 4.6 * s} ${y - 24.5 * s} Z`} fill="#E6E2D6" />
    </g>
  );
}

/** 収穫用のコンテナ（黄色の樹脂製） */
function Crates({ x, y, s, n, opacity }: { x: number; y: number; s: number; n: number; opacity: number }) {
  const items = Array.from({ length: n }, (_, i) => i);
  return (
    <g opacity={opacity} style={{ transition: "opacity .6s ease" }}>
      {items.map((i) => (
        <g key={i}>
          <rect x={x + (i % 3) * 13 * s} y={y - 8 * s - Math.floor(i / 3) * 8 * s} width={12 * s} height={7.5 * s} rx={1 * s} fill="#E7B935" />
          <rect x={x + (i % 3) * 13 * s + 1.5 * s} y={y - 6 * s - Math.floor(i / 3) * 8 * s} width={9 * s} height={1.2 * s} fill="#C99A22" />
        </g>
      ))}
    </g>
  );
}

/** 軽トラ（横向き。白） */
function KeiTruck({ x, y, s, loaded, dir }: { x: number; y: number; s: number; loaded: boolean; dir: 1 | -1 }) {
  // dir: 1 = 右向き, -1 = 左向き
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
      <ellipse cx={0} cy={1} rx={50} ry={3} fill="#1E2A1A" opacity={0.2} />
      <rect x={-46} y={-20} width={60} height={12} rx={1.5} fill="#EDEDE8" />
      <rect x={-46} y={-26} width={60} height={6} rx={1} fill="#E2E2DC" />
      <path d="M14 -8 L14 -33 L32 -33 L44 -18 L46 -8 Z" fill="#F2F2EE" />
      <path d="M18 -30 L31 -30 L40 -19 L18 -19 Z" fill="#9CB9C9" />
      <rect x={44} y={-14} width={3} height={4} rx={1} fill="#F6E7A8" />
      <rect x={-46} y={-9} width={93} height={3} fill="#B9B9B2" />
      <circle cx={-28} cy={-4} r={6} fill="#2A2A2A" />
      <circle cx={-28} cy={-4} r={2.4} fill="#8D8D88" />
      <circle cx={30} cy={-4} r={6} fill="#2A2A2A" />
      <circle cx={30} cy={-4} r={2.4} fill="#8D8D88" />
      {loaded && (
        <g>
          <rect x={-42} y={-35} width={14} height={9} rx={1} fill="#E7B935" />
          <rect x={-27} y={-35} width={14} height={9} rx={1} fill="#E7B935" />
          <rect x={-12} y={-35} width={14} height={9} rx={1} fill="#E7B935" />
          <rect x={-35} y={-44} width={14} height={9} rx={1} fill="#E2B230" />
          <rect x={-20} y={-44} width={14} height={9} rx={1} fill="#E2B230" />
        </g>
      )}
    </g>
  );
}

/** トラクター（田んぼの脇に止めてある） */
function Tractor({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={1} rx={34} ry={3} fill="#1E2A1A" opacity={0.2} />
      <rect x={-26} y={-24} width={34} height={12} rx={2} fill="#C8452F" />
      <path d="M-2 -24 L-2 -44 L16 -44 L16 -24 Z" fill="none" stroke="#3A3A3A" strokeWidth={2} />
      <rect x={-4} y={-46} width={22} height={3} rx={1} fill="#C8452F" />
      <rect x={8} y={-24} width={16} height={10} rx={2} fill="#B83C28" />
      <circle cx={-16} cy={-10} r={10} fill="#2A2A2A" />
      <circle cx={-16} cy={-10} r={4} fill="#8B8B86" />
      <circle cx={18} cy={-6} r={6} fill="#2A2A2A" />
      <circle cx={18} cy={-6} r={2.4} fill="#8B8B86" />
    </g>
  );
}

/** スピードスプレーヤー（果樹園の防除に使う車両） */
function SpeedSprayer({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={1} rx={36} ry={3} fill="#1E2A1A" opacity={0.2} />
      <rect x={-30} y={-18} width={56} height={11} rx={4} fill="#D9692C" />
      <ellipse cx={-4} cy={-21} rx={22} ry={8} fill="#E8E4D8" />
      <rect x={22} y={-24} width={8} height={17} rx={2} fill="#6B6B66" />
      <circle cx={26} cy={-15} r={5} fill="#4B4B47" />
      <circle cx={-18} cy={-5} r={5} fill="#2A2A2A" />
      <circle cx={12} cy={-5} r={5} fill="#2A2A2A" />
    </g>
  );
}

/** 乗用の草刈機（午後に園地の通路を走る） */
function Mower({ x, y, s, opacity }: { x: number; y: number; s: number; opacity: number }) {
  return (
    <g opacity={opacity} style={{ transition: "opacity .6s ease" }} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={1} rx={22} ry={2.6} fill="#1E2A1A" opacity={0.2} />
      <rect x={-18} y={-12} width={34} height={8} rx={3} fill="#3E7A4A" />
      <rect x={-6} y={-20} width={10} height={8} rx={2} fill="#2F2F2F" />
      <rect x={-2} y={-34} width={8} height={12} rx={2.5} fill="#3F5F7A" />
      <circle cx={2} cy={-37} r={3.6} fill="#D8B597" />
      <path d="M-2.6 -38 Q2 -43.5 6.6 -38 Z" fill="#E6E2D6" />
      <circle cx={-12} cy={-3} r={4} fill="#2A2A2A" />
      <circle cx={11} cy={-3} r={4} fill="#2A2A2A" />
    </g>
  );
}

/** 脚立と、その上で剪定する人（冬） */
function LadderPruner({ x, y, s, opacity }: { x: number; y: number; s: number; opacity: number }) {
  return (
    <g opacity={opacity} style={{ transition: "opacity .6s ease" }} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={1} rx={14} ry={2} fill="#1E2A1A" opacity={0.25} />
      <path d="M-9 0 L-2 -34 M9 0 L2 -34" stroke="#B8B6AE" strokeWidth={1.6} fill="none" />
      {[-6, -13, -20, -27].map((h) => (
        <path key={h} d={`M${-8 + (h / -34) * 6} ${h} L${8 - (h / -34) * 6} ${h}`} stroke="#B8B6AE" strokeWidth={1.2} />
      ))}
      <rect x={-3.2} y={-43} width={2.6} height={9} rx={1} fill="#2F3438" />
      <rect x={0.6} y={-43} width={2.6} height={9} rx={1} fill="#2F3438" />
      <rect x={-4} y={-54} width={8} height={12} rx={2.5} fill="#5A4A3A" />
      <path d="M3 -51 L10 -58" stroke="#5A4A3A" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={0} cy={-57.5} r={3.4} fill="#D8B597" />
      <path d="M-4.2 -58.5 Q0 -63.5 4.2 -58.5 Z" fill="#3A3A3A" />
    </g>
  );
}

/** 切った枝の山（冬） */
function BranchPile({ x, y, s, opacity }: { x: number; y: number; s: number; opacity: number }) {
  return (
    <g opacity={opacity} style={{ transition: "opacity .6s ease" }} transform={`translate(${x} ${y}) scale(${s})`} stroke="#6A5444" strokeWidth={1.2} strokeLinecap="round">
      {[-14, -9, -4, 1, 6, 11].map((dx, i) => (
        <path key={dx} d={`M${dx - 6} ${-1 - (i % 3)} L${dx + 8} ${-6 - (i % 2) * 3}`} />
      ))}
      <path d="M-12 -4 L12 -8 M-8 -8 L10 -3" />
    </g>
  );
}

/** 肥料の袋（秋） */
function FertBags({ x, y, s, opacity }: { x: number; y: number; s: number; opacity: number }) {
  return (
    <g opacity={opacity} style={{ transition: "opacity .6s ease" }} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={-7} width={11} height={7} rx={1.5} fill="#E9E4D4" />
      <rect x={12} y={-7} width={11} height={7} rx={1.5} fill="#E2DCC8" />
      <rect x={6} y={-13} width={11} height={6.5} rx={1.5} fill="#ECE7D8" />
      <rect x={2} y={-5} width={7} height={1.4} fill="#6E9446" />
    </g>
  );
}

/** 手持ちの明かり（春の霜の見回り。夜の暗さの上に描く） */
function Lantern({ x, y, s, opacity }: { x: number; y: number; s: number; opacity: number }) {
  return (
    <g opacity={opacity} style={{ transition: "opacity .6s ease" }}>
      <circle cx={x} cy={y} r={34 * s} fill="#FFE6A3" opacity={0.18} />
      <circle cx={x} cy={y} r={12 * s} fill="#FFE6A3" opacity={0.35} />
      <circle cx={x} cy={y} r={2.4 * s} fill="#FFF3C8" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 季節ごとの景色の色                                                 */
/* ------------------------------------------------------------------ */

type Look = {
  paddy: string; // 田んぼに重ねる色
  paddyA: number;
  ground: string; // 園地の地面に重ねる色
  groundA: number;
  snow: number; // 山と地面の雪（0〜1）
  dayLight: number; // 日の長さ（冬は短く、夏は長く。太陽の高さに掛ける）
};
const LOOKS: Record<string, Look> = {
  spring: { paddy: "#8E7A5C", paddyA: 0.72, ground: "#A9C46A", groundA: 0.25, snow: 0.25, dayLight: 0.9 },
  "early-summer": { paddy: "#8FB6B4", paddyA: 0.55, ground: "#7FA851", groundA: 0, snow: 0, dayLight: 1 },
  summer: { paddy: "#7CA64E", paddyA: 0, ground: "#6E9446", groundA: 0, snow: 0, dayLight: 1 },
  autumn: { paddy: "#C9A94A", paddyA: 0.72, ground: "#9C9A5A", groundA: 0.35, snow: 0, dayLight: 0.85 },
  winter: { paddy: "#E9ECEE", paddyA: 0.82, ground: "#EEF1F2", groundA: 0.78, snow: 1, dayLight: 0.62 },
};

/* ------------------------------------------------------------------ */
/* 景色の固定部分（毎フレーム作り直さない）                            */
/* ------------------------------------------------------------------ */

const PADDY_FAR_ROWS: [number, number][] = [
  [304, 316],
  [318, 334],
  [336, 356],
  [358, 384],
];
const PADDY_GREENS = ["#86AE55", "#7CA64E", "#8DB65C", "#7FA851", "#91B860"];

function farPaddies() {
  const out: { d: string; fill: string }[] = [];
  PADDY_FAR_ROWS.forEach(([y0, y1], r) => {
    const w = 120 + r * 50;
    let x = -((r * 37) % w);
    let k = r;
    while (x < 1440) {
      const skew = (x - 720) * 0.04;
      out.push({
        d: `M${x + skew} ${y0} L${x + w + skew} ${y0} L${x + w + skew * 1.4} ${y1} L${x + skew * 1.4} ${y1} Z`,
        fill: PADDY_GREENS[k % PADDY_GREENS.length],
      });
      x += w + 4;
      k++;
    }
  });
  return out;
}

const NEAR_PADDIES = [
  { d: "M0 410 L470 410 L430 470 L0 470 Z", fill: "#82AB52" },
  { d: "M478 410 L760 410 L748 470 L438 470 Z", fill: "#8AB35A" },
  { d: "M0 476 L426 476 L372 560 L0 560 Z", fill: "#7BA44C" },
  { d: "M434 476 L746 476 L732 560 L380 560 Z", fill: "#86AF56" },
  { d: "M0 566 L368 566 L318 640 L0 640 Z", fill: "#80A950" },
  { d: "M376 566 L730 566 L718 640 L326 640 Z", fill: "#8BB45C" },
];

// 園地は主役なので、手前ほど大きく、画面の下まで寄せる（2026年10月27日に構図を直した）
const ORCHARD_ROWS = [
  { y: 444, s: 0.8, x0: 785, gap: 78 },
  { y: 494, s: 1.15, x0: 770, gap: 112 },
  { y: 562, s: 1.65, x0: 750, gap: 158 },
  { y: 640, s: 2.3, x0: 730, gap: 215 },
];
// 手前の列（人や草刈機より前に描く木）の境目
const FRONT_ROW_Y = 610;

function orchardTrees() {
  const out: { x: number; y: number; s: number; v: number; key: string }[] = [];
  ORCHARD_ROWS.forEach((row, r) => {
    let x = row.x0 + (r % 2) * row.gap * 0.5;
    let i = 0;
    while (x < 1520) {
      const v = (Math.sin((r + 1) * 12.9898 + (i + 1) * 78.233) * 43758.5453) % 1;
      const vv = v < 0 ? v + 1 : v;
      out.push({ x: x + (vv - 0.5) * row.gap * 0.12, y: row.y + (vv - 0.5) * 4 * row.s, s: row.s * (0.92 + vv * 0.16), v: vv, key: `${r}-${i}` });
      x += row.gap;
      i++;
    }
  });
  return out;
}

const POLES = [60, 250, 440, 630, 820, 1010, 1200, 1390];
const HOUSES = [
  { x: 120, w: 34 },
  { x: 395, w: 28 },
  { x: 610, w: 38 },
  { x: 1180, w: 32 },
  { x: 1320, w: 26 },
];

/* ------------------------------------------------------------------ */
/* 動かない層（一度だけ作る）                                          */
/* ------------------------------------------------------------------ */

type Tree = { x: number; y: number; s: number; v: number; key: string };

const FarPaddiesLayer = memo(function FarPaddiesLayer({ rice, look }: { rice: string; look: Look }) {
  const far = farPaddies();
  return (
    <g>
      <rect x="0" y="300" width="1440" height="340" fill="#7EA350" />
      {far.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill={p.fill} />
          <path d={p.d} fill={`url(#${rice})`} />
        </g>
      ))}
      {/* 季節の田んぼ（春は田起こしの土、初夏は水を張った田、秋は実った稲、冬は雪） */}
      <rect x="0" y="300" width="1440" height="92" fill={look.paddy} opacity={look.paddyA} style={{ transition: "opacity 1s ease, fill 1s ease" }} />
    </g>
  );
});

const MidLayer = memo(function MidLayer({ sprayerParked }: { sprayerParked: boolean }) {
  return (
    <g>
      {/* 電柱と電線 */}
      <g stroke="#4A4A46" fill="none">
        {POLES.slice(0, -1).map((x, i) => (
          <path key={i} d={`M${x} 336 Q${(x + POLES[i + 1]) / 2} 348 ${POLES[i + 1]} 336`} strokeWidth={0.8} />
        ))}
        {POLES.map((x) => (
          <g key={x}>
            <path d={`M${x} 392 L${x} 332`} strokeWidth={2.4} />
            <path d={`M${x - 7} 337 L${x + 7} 337`} strokeWidth={1.6} />
          </g>
        ))}
      </g>
      {/* 作業場（トタン屋根） */}
      <rect x="898" y="350" width="104" height="44" fill="#D9D4C9" />
      <path d="M890 352 L950 330 L1010 352 Z" fill="#5E7889" />
      <path d="M890 352 L1010 352" stroke="#4C6474" strokeWidth={2} />
      <rect x="912" y="364" width="40" height="30" fill="#A9AAA6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M912 ${368 + i * 6} L952 ${368 + i * 6}`} stroke="#8F908C" strokeWidth={1} />
      ))}
      <rect x="966" y="364" width="22" height="14" fill="#56616A" />
      {sprayerParked && <SpeedSprayer x={1052} y={392} s={0.9} />}
      <Tractor x={640} y={384} s={0.9} />
      {/* 農道 */}
      <rect x="0" y="392" width="1440" height="14" fill="#9C9A92" />
      <path d="M0 393 L1440 393" stroke="#B9B6AC" strokeWidth={1} />
      <path d="M0 405 L1440 405" stroke="#85837C" strokeWidth={1} />
    </g>
  );
});

const NearLayer = memo(function NearLayer({ riceNear, look }: { riceNear: string; look: Look }) {
  return (
    <g>
      {NEAR_PADDIES.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill={p.fill} />
          <path d={p.d} fill={`url(#${riceNear})`} />
          <path d={p.d} fill={look.paddy} opacity={look.paddyA} />
        </g>
      ))}
      <path d="M760 406 L700 640" stroke="#B9B48A" strokeWidth={6} />
      <path d="M752 406 L1440 406 L1440 640 L700 640 Z" fill="#6E9446" />
      <path d="M752 406 L1440 406 L1440 640 L700 640 Z" fill={`url(#${riceNear})`} opacity={0.5} />
      <path d="M752 406 L1440 406 L1440 640 L700 640 Z" fill={look.ground} opacity={look.groundA} />
    </g>
  );
});

const TreesLayer = memo(function TreesLayer({ trees, stage }: { trees: Tree[]; stage: Stage }) {
  return (
    <g>
      {trees.map((tr) => (
        <PeachTree key={tr.key} x={tr.x} y={tr.y} s={tr.s} v={tr.v} stage={stage} />
      ))}
    </g>
  );
});

function Shadows({ trees, dx, opacity }: { trees: Tree[]; dx: number; opacity: number }) {
  return (
    <g fill="#1E2A1A" opacity={opacity}>
      {trees.map((tr) => (
        <ellipse key={tr.key} cx={tr.x + dx * tr.s} cy={tr.y + 2 * tr.s} rx={30 * tr.s} ry={5 * tr.s} />
      ))}
    </g>
  );
}

const Caption = memo(function Caption({ season, idx, onPickSeason, onPick }: { season: number; idx: number; onPickSeason: (i: number) => void; onPick: (i: number) => void }) {
  const se = SEASONS[season];
  const ph = se.phases[idx];
  return (
    <>
      <div style={S.phaseRow} role="group" aria-label="季節を選ぶ">
        {SEASONS.map((x, i) => (
          <button key={x.key} type="button" aria-current={i === season ? "true" : undefined} onClick={() => onPickSeason(i)} style={i === season ? { ...S.pill, ...S.seasonOn } : S.pill}>
            {x.name}
            <span style={S.pillSub}>{x.months}</span>
          </button>
        ))}
      </div>
      <div style={S.phaseRow} role="group" aria-label="時間帯を選ぶ">
        {TIME_LABELS.map((label, i) => (
          <button key={label} type="button" aria-current={i === idx ? "true" : undefined} onClick={() => onPick(i)} style={i === idx ? { ...S.pill, ...S.pillOn } : S.pill}>
            {label}
          </button>
        ))}
      </div>
      <div style={S.caption}>
        <p style={S.capLabel}>
          {se.name}（{se.months}）{se.theme}　｜　{TIME_LABELS[idx]}（例）
        </p>
        <h2 style={S.capTitle}>{ph.title}</h2>
        <p style={S.capText}>{ph.desc}</p>
        <p style={S.seasonNote}>{se.note}</p>
      </div>
      <p style={S.note}>
        時間帯と作業の順番は例です。地域・品種・天候・年によって違います。農家の方への聞き取りで確かめて、更新していきます。{SEASON_SOURCE}
      </p>
      <h2 style={S.factsTitle}>来る前に知っておきたい数字（もも）</h2>
      <div className="fdh-facts" style={S.facts}>
        {FACTS.map((f) => (
          <div key={f.value} style={S.fact}>
            <p style={S.factValue}>{f.value}</p>
            <p style={S.factText}>{f.text}</p>
            <p style={S.factSource}>{f.source}</p>
          </div>
        ))}
      </div>
    </>
  );
});

/* ------------------------------------------------------------------ */
/* 本体                                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_SECONDS_PER_DAY = 24; // 5つの季節で一周 2 分
const START_T = 0.22; // 春の朝。サーバーで描く最初の絵と、動きを減らす設定のときの止まった絵

export default function FarmDayHero({ secondsPerDay = DEFAULT_SECONDS_PER_DAY }: { secondsPerDay?: number }) {
  // clock：始まりからの日数（整数部分で季節、小数部分 t で時刻）
  const [clock, setClock] = useState(START_T);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  // 幅が狭いとき（1024px以下。紹介の枠を絵の下に回す境目と同じ）は、絵の右側（園地と作業場）を切り出す
  const [narrow, setNarrow] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { sky: `fdh-sky-${uid}`, glow: `fdh-glow-${uid}`, rice: `fdh-rice-${uid}`, riceNear: `fdh-rice-near-${uid}` };

  // 動きを減らす設定のときは止めたまま
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPlaying(!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // 画面外では止める
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 時間を進める（約30fps。タブを離れていた間の時間は足さない）
  useEffect(() => {
    if (!playing || !visible) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      if (dt >= 33) {
        last = now;
        if (!document.hidden) setClock((p) => (p + Math.min(dt, 100) / 1000 / secondsPerDay) % SEASONS.length);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, secondsPerDay]);

  const trees = useMemo(orchardTrees, []);
  const backTrees = useMemo(() => trees.filter((tr) => tr.y < FRONT_ROW_Y), [trees]);
  const frontTrees = useMemo(() => trees.filter((tr) => tr.y >= FRONT_ROW_Y), [trees]);

  const season = Math.floor(clock) % SEASONS.length;
  const t = clock - Math.floor(clock);
  const se = SEASONS[season];
  const look = LOOKS[se.key];
  const L = lightAt(t);
  const idx = Math.min(5, Math.floor(t * 6));
  const frac = t * 6 - idx;

  // 太陽：t=0.06 で東（左）から昇り、t=0.88 で西（右）に沈む。冬は低く、夏は高い
  const arc = Math.min(1, Math.max(0, (t - 0.06) / 0.82));
  const sunUp = t > 0.05 && t < 0.89;
  const sunX = 160 + arc * 1120;
  const sunY = 300 - Math.sin(arc * Math.PI) * 240 * look.dayLight;
  const lowSun = 1 - Math.sin(arc * Math.PI); // 地平線に近いほど 1
  const shadowDx = sunUp ? (720 - sunX) / 40 : 0;
  const shadowOp = sunUp ? 0.22 * (1 - L.night) : 0.06;

  // 遠景は空の色に溶ける（空気遠近）
  const farMtn = mix("#5E7A86", L.hor, 0.45);
  const nearMtn = mix("#4E6B5C", L.hor, 0.25);
  const treeLine = mix("#3E5A3A", L.hor, 0.12);

  // 動くもの（季節と時間帯で決める）
  const k = se.key;
  const summer = k === "summer";
  let truckX = 850;
  let truckDir: 1 | -1 = 1;
  let truckLoaded = false;
  let truckOp = 1;
  if (summer) {
    if (idx === 1 && frac > 0.6) truckLoaded = true;
    if (idx === 2) {
      truckLoaded = true;
      truckDir = -1;
      truckX = 850 - frac * 1150;
    }
    if (idx === 3) truckOp = 0;
    if (idx === 4) {
      truckDir = 1;
      truckX = Math.min(850, -200 + frac * 1.8 * 1050);
    }
  }
  const mowing = (summer && idx === 3) || (k === "early-summer" && idx === 4) || (k === "spring" && idx === 3);
  const mowerX = mowing ? 1520 - frac * 780 : 1520;
  const spraying = k === "autumn" && idx === 3;
  const sprayerX = spraying ? 1560 - frac * 860 : 1560;
  const pruning = k === "winter" && (idx === 1 || idx === 2);
  const pile = k === "winter" && idx >= 2 && idx <= 4;
  // 手前で作業する人（夏の収穫、春の授粉、初夏の摘果・袋かけ、秋の秋肥・剪定、冬の枝の片付け）
  const worker =
    (summer && idx === 0 && t > 0.03) ||
    (k === "spring" && (idx === 0 || idx === 1 || idx === 2)) ||
    (k === "early-summer" && idx >= 1 && idx <= 3) ||
    (k === "autumn" && (idx === 0 || idx === 1 || idx === 2)) ||
    (k === "winter" && idx === 3);
  const shedWorker = (summer && idx === 1 && frac > 0.08) || idx === 4 || ((k === "winter" || k === "early-summer") && idx === 0);
  const frostPatrol = k === "spring" && idx === 0 && t < 0.12;
  const lit = t < 0.1 || t > 0.8;

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const pick = useCallback((i: number) => {
    setClock((c) => Math.floor(c) + (i + 0.5) / 6);
    setPlaying(false);
  }, []);
  const pickSeason = useCallback((i: number) => {
    // 時刻はそのままで、季節だけ替える
    setClock((c) => i + (c - Math.floor(c)));
  }, []);

  return (
    <section ref={rootRef} aria-label="農家の一日" style={S.section}>
      <div style={S.sceneWrap}>
        <svg viewBox="0 0 1440 640" preserveAspectRatio={narrow ? "xMaxYMax slice" : "xMidYMax slice"} width="100%" height="100%" role="img" aria-label={`もも農家の${se.name}（${se.months}）の一日。${se.theme}。果樹園と田んぼの景色が、時間と季節で移り変わるイラスト`} style={{ display: "block" }}>
          <defs>
            <linearGradient id={ids.sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={L.top} />
              <stop offset="1" stopColor={L.hor} />
            </linearGradient>
            <radialGradient id={ids.glow}>
              <stop offset="0" stopColor="#FFE7B0" stopOpacity={0.9} />
              <stop offset="1" stopColor="#FFB070" stopOpacity={0} />
            </radialGradient>
            <pattern id={ids.rice} width="5" height="4" patternUnits="userSpaceOnUse">
              <path d="M0 3.5 L5 3.5" stroke="#5E8A3A" strokeWidth={0.8} opacity={0.35} />
            </pattern>
            <pattern id={ids.riceNear} width="9" height="7" patternUnits="userSpaceOnUse">
              <path d="M0 6 L9 6" stroke="#557F33" strokeWidth={1.2} opacity={0.35} />
            </pattern>
          </defs>

          {/* 空と太陽 */}
          <rect x="0" y="0" width="1440" height="320" fill={`url(#${ids.sky})`} />
          {sunUp && (
            <g>
              <circle cx={sunX} cy={sunY} r={90 + lowSun * 70} fill={`url(#${ids.glow})`} opacity={0.55 + lowSun * 0.3} />
              <circle cx={sunX} cy={sunY} r={22} fill={mix("#FFF4D6", "#FFB061", lowSun * 0.8)} />
            </g>
          )}

          {/* 山（遠い山並みの稜線）と地平線の木立・家 */}
          <path d="M0 262 L90 236 L170 214 L240 222 L330 190 L420 212 L500 200 L590 226 L700 206 L790 230 L880 214 L980 236 L1080 210 L1170 228 L1270 204 L1360 226 L1440 216 L1440 320 L0 320 Z" fill={farMtn} />
          {/* 山の雪（冬は濃く、春は少し残る） */}
          <path d="M150 220 L170 214 L190 218 L178 226 Z M300 200 L330 190 L362 200 L340 208 L318 206 Z M1050 216 L1080 210 L1108 216 L1086 222 Z M1240 210 L1270 204 L1300 210 L1278 216 Z" fill="#F4F6F7" opacity={look.snow * 0.9} style={{ transition: "opacity 1s ease" }} />
          <path d="M0 286 C 140 262, 280 276, 420 266 C 560 256, 700 280, 860 270 C 1010 260, 1160 282, 1300 268 C 1360 262, 1410 266, 1440 264 L1440 320 L0 320 Z" fill={nearMtn} />
          <path d="M0 302 C 60 292, 110 298, 170 292 C 230 287, 290 298, 360 293 C 440 288, 500 297, 580 291 C 660 286, 740 298, 830 293 C 920 288, 1000 297, 1090 291 C 1180 286, 1260 297, 1350 292 L1440 294 L1440 310 L0 310 Z" fill={treeLine} />
          {HOUSES.map((h) => (
            <g key={h.x}>
              <rect x={h.x} y={293} width={h.w} height={10} fill="#D9D3C6" />
              <path d={`M${h.x - 3} ${294} L${h.x + h.w / 2} ${286} L${h.x + h.w + 3} ${294} Z`} fill="#4E5862" />
            </g>
          ))}

          <FarPaddiesLayer rice={ids.rice} look={look} />
          <MidLayer sprayerParked={!spraying} />
          <Crates x={968} y={392} s={1} n={5} opacity={summer && idx === 1 && frac < 0.6 ? 1 : 0} />
          <g opacity={truckOp} style={{ transition: "opacity .6s ease" }}>
            <KeiTruck x={truckX} y={402} s={0.95} loaded={truckLoaded} dir={truckDir} />
          </g>

          <NearLayer riceNear={ids.riceNear} look={look} />
          <Shadows trees={backTrees} dx={shadowDx} opacity={shadowOp} />
          <TreesLayer trees={backTrees} stage={se.stage} />
          <Person x={930} y={394} s={1.1} opacity={shedWorker ? 1 : 0} />
          <Shadows trees={frontTrees} dx={shadowDx} opacity={shadowOp} />
          <TreesLayer trees={frontTrees} stage={se.stage} />
          {/* 主役の人と機械は、手前の列の木より前に描く（木に隠れないように） */}
          {/* 防除：スピードスプレーヤーが園地の通路を走る（秋の午後） */}
          <g opacity={spraying ? 1 : 0} style={{ transition: "opacity .6s ease" }}>
            <ellipse cx={sprayerX - 20} cy={590} rx={120} ry={40} fill="#F2F4F2" opacity={0.3} />
            <SpeedSprayer x={sprayerX} y={634} s={2} />
          </g>
          <Mower x={mowerX} y={636} s={2} opacity={mowing ? 1 : 0} />
          <LadderPruner x={985} y={636} s={2.1} opacity={pruning ? 1 : 0} />
          <BranchPile x={1150} y={634} s={2.4} opacity={pile ? 1 : 0} />
          <Person x={940} y={636} s={2.1} opacity={worker ? 1 : 0} />
          <Crates x={968} y={638} s={2.1} n={6} opacity={summer && idx === 0 ? 1 : 0} />
          <FertBags x={975} y={638} s={2.1} opacity={k === "autumn" && idx === 1 ? 1 : 0} />

          {/* 光：朝夕の色かぶりと夜の暗さ */}
          <rect x="0" y="280" width="1440" height="360" fill={L.tint} opacity={L.tintA * 0.8} />
          <rect x="0" y="0" width="1440" height="640" fill="#0D1330" opacity={L.night * 0.9} />
          {/* 星と月・夜の明かり（暗さの上に描く） */}
          <g opacity={Math.max(0, Math.min(1, L.night * 2 - 0.2))}>
            {[ [140, 60], [300, 120], [520, 48], [700, 96], [890, 40], [1040, 110], [1230, 70], [1380, 130] ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1.1} fill="#F4F1E1" />
            ))}
            <circle cx={1000} cy={92} r={14} fill="#EEEAD2" />
          </g>
          <Lantern x={956} y={596} s={2} opacity={frostPatrol ? 1 : 0} />
          <g opacity={lit ? 1 : 0} style={{ transition: "opacity .8s ease" }}>
            <rect x="966" y="364" width="22" height="14" fill="#F5D27A" />
            {HOUSES.map((h) => (
              <rect key={h.x} x={h.x + h.w / 2 - 3} y={296} width={6} height={4} fill="#F3CF7A" />
            ))}
          </g>
        </svg>

        <button type="button" onClick={togglePlay} aria-label={playing ? "アニメーションを一時停止" : "アニメーションを再生"} style={{ ...S.pill, ...S.pausePos }}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d={playing ? "M3 2h3v10H3zM8 2h3v10H8z" : "M3 2l9 5-9 5z"} fill="currentColor" />
          </svg>
          {playing ? "一時停止" : "再生"}
        </button>
      </div>

      <div className="fdh-card" style={S.card}>
        <p style={S.eyebrow}>県北ふくしまAgri-Guide</p>
        <h1 style={S.h1}>
          たとえば、
          <br />
          もも農家の一年。
        </h1>
        <p style={S.lead}>就農する前に、仕事と暮らしのリズムを知っておくために。春の花から、摘果、収穫、秋の手入れ、冬の剪定まで。福島のもも農家の季節ごとの一日を描いています。</p>
        <p style={S.nowSeason} aria-live="polite">
          いま：{se.name}（{se.months}）の一日 — {se.theme}
        </p>
        <div style={S.ctaRow}>
          <a href="/simulator" style={S.ctaPrimary}>
            就農シミュレーターを試す
          </a>
          <a href="/subsidies" style={S.ctaSecondary}>
            支援制度を見る
          </a>
        </div>
      </div>

      <div style={S.below}>
        <div style={S.progressTrack} aria-hidden="true">
          <div style={{ ...S.progressFill, width: `${Math.max(1, t * 100)}%` }} />
        </div>
        <Caption season={season} idx={idx} onPickSeason={pickSeason} onPick={pick} />
        <YearRing activeMonths={SEASON_MONTHS[se.key]} />
        <div style={S.sources}>
          <h2 style={{ ...S.factsTitle, fontSize: 18, margin: 0 }}>データの出典</h2>
          <ul style={S.sourceList}>
            {DATA_SOURCES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 幅が狭いときの配置（Tailwind に置き換える場合は、同じ意味のクラスにする） */}
      <style>{`
        @media (min-width: 1025px) { .fdh-card { position: absolute; top: 40px; left: 40px; max-width: 500px; } }
        @media (max-width: 1024px) { .fdh-card { position: relative; margin: 12px 16px 0; } }
        @media (max-width: 760px) { .fdh-facts { grid-template-columns: minmax(0, 1fr) !important; } }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* スタイル（サイトの Tailwind のトークンに置き換えてよい）            */
/* ------------------------------------------------------------------ */

const INK = "#2B2A26";
const SUB = "#4A463D";
const MUTED = "#6B655A";
const PAPER = "#FFFDF8";
const LINE = "#E4DCCB";
const GREEN = "#2F4A2E";
const BRICK = "#8A3A24";

const S: Record<string, CSSProperties> = {
  section: { position: "relative", background: "#FBF8F1", color: INK },
  sceneWrap: { position: "relative", height: "clamp(360px, 46vw, 640px)", overflow: "hidden", background: "#7EA350" },
  pausePos: { position: "absolute", top: 16, right: 16 },
  card: { background: PAPER, border: `1px solid ${LINE}`, borderRadius: 16, padding: "28px 28px 24px", boxShadow: "0 6px 18px rgba(43,42,38,0.12)", display: "flex", flexDirection: "column", gap: 14 },
  eyebrow: { margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#6E5F45" },
  h1: { margin: 0, fontWeight: 700, fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: 1.25 },
  lead: { margin: 0, fontSize: 16, lineHeight: 1.8, color: SUB },
  ctaRow: { display: "flex", flexWrap: "wrap", gap: 10 },
  ctaPrimary: { display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 20px", borderRadius: 999, background: BRICK, color: "#FFFFFF", fontWeight: 700, fontSize: 15, textDecoration: "none" },
  ctaSecondary: { display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 20px", borderRadius: 999, border: `1.5px solid ${BRICK}`, color: BRICK, fontWeight: 700, fontSize: 15, textDecoration: "none", background: PAPER },
  below: { maxWidth: 1200, margin: "0 auto", padding: "28px 16px 56px", display: "flex", flexDirection: "column", gap: 16 },
  progressTrack: { height: 6, borderRadius: 3, background: LINE, overflow: "hidden" },
  progressFill: { height: "100%", background: GREEN },
  phaseRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  pill: { display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44, padding: "8px 14px", borderRadius: 999, border: "1.5px solid #CFC6B3", background: PAPER, color: SUB, fontSize: 14, fontWeight: 700, cursor: "pointer" },
  pillOn: { background: GREEN, borderColor: GREEN, color: "#FFFFFF" },
  seasonOn: { background: BRICK, borderColor: BRICK, color: "#FFFFFF" },
  pillSub: { fontSize: 12, fontWeight: 400, opacity: 0.85 },
  seasonNote: { margin: "4px 0 0", fontSize: 14, lineHeight: 1.7, color: SUB, borderTop: `1px dashed ${LINE}`, paddingTop: 10 },
  nowSeason: { margin: 0, fontSize: 14, fontWeight: 700, color: GREEN },
  sources: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 },
  sourceList: { margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.7, color: MUTED },
  caption: { background: PAPER, border: `1px solid ${LINE}`, borderRadius: 16, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 8 },
  capLabel: { margin: 0, fontSize: 13, fontWeight: 700, color: "#6E5F45" },
  capTitle: { margin: 0, fontSize: 24, fontWeight: 700 },
  capText: { margin: 0, fontSize: 16, lineHeight: 1.8, color: SUB },
  note: { margin: 0, fontSize: 13, lineHeight: 1.7, color: MUTED },
  factsTitle: { margin: "16px 0 0", fontSize: 22, fontWeight: 700 },
  facts: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 },
  fact: { background: PAPER, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 6 },
  factValue: { margin: 0, fontSize: 30, fontWeight: 700, color: GREEN },
  factText: { margin: 0, fontSize: 15, lineHeight: 1.7 },
  factSource: { margin: 0, fontSize: 12, lineHeight: 1.6, color: MUTED },
};
