// 就農シミュレーター：状態管理の型定義
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6／agri-simulator-v4.html（旧版）のS状態オブジェクト

export type AgeKey = "20s" | "30s" | "40s" | "50p";
export type FamilyKey = "single" | "couple" | "kids";
export type LocKey = "tokyo" | "other" | "tohoku" | "inside";

// 旧版Q5（興味品目）の3グループ15択に対応。
// 🌳果樹・果物：momo/apple/nashi/grape/saku/kaki
// 🥬野菜・畑作：kyu/tomato/rice/organic/flower/any（「まだわからない」）
// 🐄畜産：dairy/beef/chicken
export type CropKey =
  | "momo"
  | "apple"
  | "nashi"
  | "grape"
  | "saku"
  | "kaki"
  | "kyu"
  | "tomato"
  | "rice"
  | "organic"
  | "flower"
  | "any"
  | "dairy"
  | "beef"
  | "chicken";

export type ExpKey = "none" | "garden" | "part" | "train";
// 旧版Q6は self(新規)／inherit(農家から引き継ぐ)／hire(法人就職)／idk の4択。
export type TypeKey = "self" | "inherit" | "hire" | "idk";
// 旧版Q7は small/mid/large/unknown（まだわからない）の4択。
export type ScaleKey = "small" | "mid" | "large" | "unknown";
export type CapKey = "u100" | "100to300" | "300to500" | "o500";
export type WorryKey = "money" | "info" | "skill" | "life";
export type TimingKey = "w1y" | "w3y" | "o3y" | "info";
export type WindowKey = "fukunou" | "kenpo" | "iju" | "city" | "any";

// Sオブジェクト（要件定義書§6の状態管理仕様＋旧版S状態オブジェクト準拠）
// income：Q8「目標年収」スライダーの値（100〜800万円）。旧版はデフォルト300万円で
// 常に数値を持つ状態管理だったため、それに合わせてnull非許容・デフォルト300とする。
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
  income: number;
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
  income: 300,
};

export const TOTAL_QUESTIONS = 10;
