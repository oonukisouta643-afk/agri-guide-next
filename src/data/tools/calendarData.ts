import type { CropKey } from "@/lib/simulator/types";

// Tool A：農業カレンダー
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool A：農業カレンダー」
// 「品目から住む場所を考える」4ステップ：①品目選択 → ②産地確認 → ③カレンダー表示 → ④安定化提案
//
// 月別の作業内容・産地・安定化提案は要件定義書に具体的な記載がなかったため、
// 一般的な栽培知識を参考にClaudeが作成した目安コンテンツ。品種・地域差があるため、
// 実際の就農準備では地域の農業普及所等への確認が必要（ページ内に注記あり）。

export type MonthlyTask = {
  month: number;
  task: string;
  phase: "定植・管理" | "収穫" | "剪定・準備" | "閑散期";
};

export type CalendarCrop = {
  key: CropKey;
  label: string;
  emoji: string;
  productionAreas: string[];
  monthlyTasks: MonthlyTask[];
  stabilizationTip: string;
};

export const calendarCrops: CalendarCrop[] = [
  {
    key: "momo",
    label: "桃",
    emoji: "🍑",
    productionAreas: ["伊達市", "桑折町", "国見町"],
    monthlyTasks: [
      { month: 3, task: "剪定・防除開始", phase: "剪定・準備" },
      { month: 4, task: "開花・摘蕾", phase: "定植・管理" },
      { month: 6, task: "摘果", phase: "定植・管理" },
      { month: 7, task: "収穫最盛期", phase: "収穫" },
      { month: 8, task: "収穫終盤", phase: "収穫" },
      { month: 11, task: "剪定準備", phase: "閑散期" },
    ],
    stabilizationTip: "収穫期が7〜8月に集中するため、直売所・ふるさと納税等の複数販路を組み合わせて収益を安定化させる農家が多い。",
  },
  {
    key: "apple",
    label: "りんご",
    emoji: "🍎",
    productionAreas: ["二本松市", "国見町", "伊達市"],
    monthlyTasks: [
      { month: 3, task: "剪定", phase: "剪定・準備" },
      { month: 5, task: "受粉・摘果", phase: "定植・管理" },
      { month: 9, task: "早生種の収穫開始", phase: "収穫" },
      { month: 11, task: "収穫最盛期", phase: "収穫" },
      { month: 12, task: "貯蔵・出荷調整", phase: "収穫" },
    ],
    stabilizationTip: "品種を早生・中生・晩生で組み合わせることで収穫時期を分散させ、労働負荷と収入時期を平準化できる。",
  },
  {
    key: "nashi",
    label: "梨",
    emoji: "🍐",
    productionAreas: ["伊達市", "国見町"],
    monthlyTasks: [
      { month: 3, task: "受粉作業", phase: "定植・管理" },
      { month: 5, task: "摘果", phase: "定植・管理" },
      { month: 8, task: "収穫開始", phase: "収穫" },
      { month: 9, task: "収穫最盛期", phase: "収穫" },
      { month: 12, task: "剪定", phase: "剪定・準備" },
    ],
    stabilizationTip: "袋かけの有無で高付加価値化する農家もあり、直売中心なら手間をかけたブランド化が収益向上につながりやすい。",
  },
  {
    key: "saku",
    label: "さくらんぼ",
    emoji: "🍒",
    productionAreas: ["桑折町", "国見町"],
    monthlyTasks: [
      { month: 3, task: "防除・防霜対策", phase: "剪定・準備" },
      { month: 4, task: "開花・受粉", phase: "定植・管理" },
      { month: 6, task: "収穫（短期集中）", phase: "収穫" },
      { month: 7, task: "お礼肥・夏季剪定", phase: "剪定・準備" },
    ],
    stabilizationTip: "収穫期間が2〜3週間と短いため、観光農園（サクランボ狩り）を組み合わせて収益源を分散する農家が多い。",
  },
  {
    key: "kyu",
    label: "きゅうり",
    emoji: "🥒",
    productionAreas: ["二本松市", "大玉村", "伊達地域全体"],
    monthlyTasks: [
      { month: 2, task: "育苗・定植準備", phase: "剪定・準備" },
      { month: 4, task: "定植", phase: "定植・管理" },
      { month: 6, task: "収穫開始（〜9月頃まで）", phase: "収穫" },
      { month: 9, task: "収穫終盤", phase: "収穫" },
    ],
    stabilizationTip: "果樹に比べて収穫までの期間が短く、就農1年目から収入が立てやすい品目とされる。ハウス栽培なら収穫期をさらに延長できる。",
  },
  {
    key: "rice",
    label: "米",
    emoji: "🌾",
    productionAreas: ["大玉村", "本宮市", "県北全域"],
    monthlyTasks: [
      { month: 4, task: "育苗・田植え準備", phase: "定植・管理" },
      { month: 5, task: "田植え", phase: "定植・管理" },
      { month: 9, task: "収穫（稲刈り）", phase: "収穫" },
      { month: 11, task: "乾燥・出荷調整", phase: "収穫" },
    ],
    stabilizationTip: "他の品目に比べ作業の機械化が進んでおり、兼業や他品目との組み合わせがしやすい。直販・ブランド米化で単価を上げる工夫も。",
  },
];
