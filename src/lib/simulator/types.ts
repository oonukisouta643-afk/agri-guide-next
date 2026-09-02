// 就農シミュレーター：状態管理の型定義
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6

export type AgeKey = "20s" | "30s" | "40s" | "50p";
export type FamilyKey = "single" | "couple" | "kids";
export type LocKey = "tokyo" | "other" | "tohoku" | "inside";
export type CropKey = "momo" | "apple" | "nashi" | "saku" | "kyu" | "rice" | "any";
export type ExpKey = "none" | "garden" | "part" | "train";
export type TypeKey = "self" | "hire" | "idk";
export type ScaleKey = "small" | "mid" | "large";
export type CapKey = "u100" | "100to300" | "300to500" | "o500";
export type WorryKey = "money" | "info" | "skill" | "life";
export type TimingKey = "w1y" | "w3y" | "o3y" | "info";
export type WindowKey = "fukunou" | "kenpo" | "iju" | "city" | "any";

// Sオブジェクト（要件定義書§6の状態管理仕様通り）
// income は結果画面で参考表示する推定値のためのプレースホルダー。
// 要件定義書に算出ロジックの明記がないため、Phase 3時点では未使用（null固定）。
export type SimulatorState = {
  age: AgeKey | null;
  family: FamilyKey | null;
  loc: LocKey | null;
  exp: ExpKey | null;
  crops: CropKey[];
  type: TypeKey | null;
  scale: ScaleKey | null;
  cap: CapKey | null;
  worry: WorryKey | null;
  timing: TimingKey | null;
  window: WindowKey | null;
  income: number | null;
};

export const initialSimulatorState: SimulatorState = {
  age: null,
  family: null,
  loc: null,
  exp: null,
  crops: [],
  type: null,
  scale: null,
  cap: null,
  worry: null,
  timing: null,
  window: null,
  income: null,
};

export const TOTAL_QUESTIONS = 10;
