// 表示用の書き方。秘匿・データなし・未取得を 0 として扱わない。
import type { DataKind, Sourced } from "./types";

export const KIND_LABEL: Record<DataKind, string> = {
  official: "公式統計",
  estimate: "推計",
  field: "現地の聞き取り",
  placeholder: "仮データ",
};

export const KIND_DESCRIPTION: Record<DataKind, string> = {
  official: "国・県の公表値そのまま",
  estimate: "公式の値を組み合わせた計算。資料がなく推測で置いた値もここに入れ、「推測」と書いている",
  field: "農家さんへの聞き取り（いまは入っていない。差し込み口だけ）",
  placeholder: "まだ調べていない・取れていない値",
};

/** 値がないときの文言 */
export function missingText(s: Sourced<unknown>): string {
  if (s.suppressed) return "非公表";
  if (s.unavailable) return "データなし";
  return "未取得";
}

export const fmtNumber = (n: number, digits = 0) =>
  n.toLocaleString("ja-JP", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtPercent = (ratio: number, digits = 1) => `${fmtNumber(ratio * 100, digits)}%`;

/** 千万円 → 億円（1桁の小数。千万円の整数を10で割るだけなので丸めは起きない） */
export const fmtOkuFromSenman = (senman: number) => `${fmtNumber(senman / 10, 1)}億円`;

/** 円 → 万円（四捨五入） */
export const fmtMan = (yen: number) => `${fmtNumber(Math.round(yen / 10000))}万円`;

export const fmtYen = (yen: number) => `${fmtNumber(Math.round(yen))}円`;
