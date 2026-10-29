// 道のりの計算：何年目にどのくらいの所得になりそうか（果樹）
// 出典：要件定義書 v0.2 第6章「道のりの計算」。計算のしかたと定数は、
// 県北ふくしまAgri-Guide「福島県59市町村 就農の地域データ」（2026年10月16日版）の 08_果樹の試算_前提.csv と同じ。
// 所得の年次推移はデータとして持たず、ここで計算する（前提を変えれば誰でも再計算できるように）。
// 定数を変えたら `npm run kata:validate` を流す（08 の値・09 の計算結果と照らし合わせる）。
// 補助金・国の支援・経営開始資金は入れない。
//
// このファイルは Node の型の取り除き（`node scripts/kata/validate.mjs`）でも読むので、
// 型の import は `import type` だけにし、enum などは使わない。

import type { CropId, CropRoadmap, YearPoint } from "./types";

/** 計算する年数（立ち上がりの割合を10年目まで置いている） */
export const ROADMAP_YEARS = 10;

/**
 * 新しく植える場合の、成園に対する収量の割合（1〜10年目）。
 * - もも：推測（岡山県 2021 の「定植後5年間ほどは収穫量が少ない」と5年間の累計から置いた）
 * - なし：1〜8年目は福島県の実測（幸水・慣行）を成園3,500kgで割った値、9・10年目は推測
 * - りんご：1〜4年目は岩手県の1年生苗の収量を4,000kgで割った値（栽培法が同じかは未確認）、5年目以降は推測
 * ぶどうは前提を確かめてから足す（公開用データにも入れていない）。
 */
export const NEW_PLANTING_YIELD_RATIO: Partial<Record<CropId, readonly number[]>> = {
  momo: [0, 0, 0.06, 0.18, 0.35, 0.6, 0.85, 1, 1, 1],
  nashi: [0, 0, 0.02, 0.11, 0.19, 0.37, 0.46, 0.62, 0.75, 0.85],
  ringo: [0, 0, 0.09, 0.09, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
};

/**
 * 先輩の園地（成園）を受け継ぐ場合の、慣れるまでの収量の割合（1〜10年目、全品目）。
 * 推測（根拠になる資料は見つからなかった）。4年目に成園の収量（県の果樹農業振興計画の値）に届くのは楽観的な仮定。
 */
export const TAKEOVER_YIELD_RATIO: readonly number[] = [0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1, 1];

/** 地代（円/10a/年）。福島市農業委員会の樹園地の賃借料 平均15,981円/10a（平成27年の契約）を丸めた値 */
export const RENT_YEN_PER_TEN_A = 15000;

/**
 * 新しく植える場合、収穫がなくてもかかる経営費の割合（成園の経営費に対する割合）。推測。
 * 経営費（新植）＝成園の経営費×（0.3＋0.7×収量の割合）
 */
export const NEW_PLANTING_COST_FLOOR = 0.3;

/**
 * 受け継ぐ場合、経営費のうち収量に比例しない割合。
 * 香川県のもも経営指標（令和6年度）で、経営費の約半分が出荷・販売の手数料だったことから。
 * 経営費（継承）＝成園の経営費×（0.5＋0.5×収量の割合）
 */
export const TAKEOVER_COST_FIXED_SHARE = 0.5;

/** 受け継ぐときの樹体・設備の一時金（円/10a）。推測：賃貸で受け継ぐ場合はゼロ */
export const TAKEOVER_ONE_TIME_YEN_PER_TEN_A = 0;

export type RoadmapRoute = "newPlanting" | "takeover";

export type RoadmapOptions = {
  /** 経営面積（a） */
  areaA: number;
  route: RoadmapRoute;
  /** 単価の増減（%）。経営費は変えない */
  priceDeltaPct?: number;
  /** 年数（1〜ROADMAP_YEARS） */
  years?: number;
};

/** 計算に使う値がそろっているか（そろっていなければ null と理由） */
export function roadmapInputs(crop: CropRoadmap) {
  const y = crop.perTenA.yieldKg.value;
  const p = crop.perTenA.unitPriceYenPerKg.value;
  const c = crop.perTenA.costYen.value;
  const inv = crop.initialInvestmentPerTenA.value;
  const ramp = NEW_PLANTING_YIELD_RATIO[crop.id];
  if (y === null || p === null || c === null || inv === null || !ramp) return null;
  return { yieldKg: y, unitPrice: p, cost: c, initialInvestment: inv, ramp };
}

export function calcRoadmap(crop: CropRoadmap, opts: RoadmapOptions): YearPoint[] {
  const inputs = roadmapInputs(crop);
  if (!inputs) throw new Error(`${crop.id}: 道のりの計算に必要な値がそろっていない`);
  const years = opts.years ?? ROADMAP_YEARS;
  if (!Number.isInteger(years) || years < 1 || years > ROADMAP_YEARS) {
    throw new Error(`years は 1〜${ROADMAP_YEARS} の整数`);
  }
  if (!(opts.areaA > 0)) throw new Error("areaA は 0 より大きい数");

  const scale = opts.areaA / 10; // 10aあたり → 経営面積
  const price = inputs.unitPrice * (1 + (opts.priceDeltaPct ?? 0) / 100);
  const ratios = opts.route === "newPlanting" ? inputs.ramp : TAKEOVER_YIELD_RATIO;

  const points: YearPoint[] = [];
  for (let i = 0; i < years; i++) {
    const r = ratios[i];
    const yieldKg = inputs.yieldKg * r * scale;
    const revenue = yieldKg * price;
    const costShare =
      opts.route === "newPlanting"
        ? NEW_PLANTING_COST_FLOOR + (1 - NEW_PLANTING_COST_FLOOR) * r
        : TAKEOVER_COST_FIXED_SHARE + (1 - TAKEOVER_COST_FIXED_SHARE) * r;
    const cost = inputs.cost * costShare * scale;
    const rent = RENT_YEN_PER_TEN_A * scale;
    const income = revenue - cost - rent;
    const oneTimeCost =
      i === 0
        ? (opts.route === "newPlanting" ? inputs.initialInvestment : TAKEOVER_ONE_TIME_YEN_PER_TEN_A) * scale
        : 0;
    points.push({
      year: i + 1,
      yieldRatio: r,
      yieldKg,
      revenue,
      cost,
      rent,
      income,
      oneTimeCost,
      cashBeforeSupport: income - oneTimeCost,
    });
  }
  return points;
}
