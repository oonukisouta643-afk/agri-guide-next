// Tool G：品目別収益モデル
// 2026年10月28日に作り直した。それまでの5品目の数字（旧サイトから移植、出典なし）は外した。
// 出典：県北ふくしまAgri-Guide「福島県59市町村 就農の地域データ」（2026年10月16日版）の
// 08_果樹の試算_前提.csv・09_果樹の試算_60aの10年.csv（docs/data/open/）。
// ・成園の収量：福島県果樹農業振興計画（令和4年 https://www.pref.fukushima.lg.jp/uploaded/attachment/501307.pdf
//   ／令和8年3月 https://www.pref.fukushima.lg.jp/uploaded/attachment/737680.pdf ）
// ・単価・経営費：長野県 作目別経営指標一覧 https://www.pref.nagano.lg.jp/nogi/keiei/documents/r4keieishihyoulist.pdf
//   （福島県の指標が見つからないため、仮に使っている）
// ・農業所得（円、60a）は 09 CSV の値をそのまま使う。経営開始資金・国の支援は含まない。

export type ProfitRoute = "newPlanting" | "takeover";

export type ProfitCrop = {
  key: string;
  label: string;
  emoji: string;
  variety: string;
  /** 成園の収量（kg/10a） */
  yieldKgPer10a: number;
  /** 単価（円/kg、長野県の指標） */
  priceYenPerKg: number;
  /** 新しく植えるときの初期投資（円/10a） */
  newPlantingCostYenPer10a: number;
  /** 初期投資の注記（推測を含む場合など） */
  costNote?: string;
  /** 1〜10年目の農業所得（円、60a） */
  income: Record<ProfitRoute, number[]>;
};

export const profitAreaA = 60;

export const profitCrops: ProfitCrop[] = [
  {
    key: "momo",
    label: "もも",
    emoji: "🍑",
    variety: "あかつき",
    yieldKgPer10a: 2600,
    priceYenPerKg: 539,
    newPlantingCostYenPer10a: 200000,
    costNote: "ももの初期投資20万円/10aは推測（福島県のもも改植支援の上限22万円、国の改植17万円などを参考）",
    income: {
      newPlanting: [-1648000, -1648000, -1361616, -788848, 22573, 1215840, 2409106, 3125066, 3125066, 3125066],
      takeover: [1381546, 1962720, 2543893, 3125066, 3125066, 3125066, 3125066, 3125066, 3125066, 3125066],
    },
  },
  {
    key: "nashi",
    label: "なし",
    emoji: "🍐",
    variety: "幸水",
    yieldKgPer10a: 3500,
    priceYenPerKg: 358,
    newPlantingCostYenPer10a: 1350000,
    income: {
      newPlanting: [-2007706, -2007706, -1946839, -1672937, -1429468, -881665, -607763, -120826, 274810, 579145],
      takeover: [-260899, 171283, 603466, 1035648, 1035648, 1035648, 1035648, 1035648, 1035648, 1035648],
    },
  },
  {
    key: "ringo",
    label: "りんご",
    emoji: "🍎",
    variety: "ふじ（普通）",
    yieldKgPer10a: 4000,
    priceYenPerKg: 290,
    newPlantingCostYenPer10a: 700000,
    income: {
      newPlanting: [-1734811, -1734811, -1453822, -1453822, -954284, -485968, -17652, 450664, 918980, 1387296],
      takeover: [121702, 543566, 965431, 1387296, 1387296, 1387296, 1387296, 1387296, 1387296, 1387296],
    },
  },
];
