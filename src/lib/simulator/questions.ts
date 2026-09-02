// 就農シミュレーター：Q1〜Q10 質問定義
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6

export type Option = { value: string; label: string };

export type SingleQuestion = {
  step: number;
  kind: "single";
  key: "age" | "loc" | "family" | "exp" | "type" | "scale" | "cap" | "window";
  title: string;
  options: Option[];
};

export type MultiQuestion = {
  step: number;
  kind: "multi";
  key: "crops";
  title: string;
  options: Option[];
};

// Q9のみ「不安」「就農時期」の2択を同時に選ぶ特殊フォーマット
export type DualQuestion = {
  step: number;
  kind: "dual";
  title: string;
  worryOptions: Option[];
  timingOptions: Option[];
};

export type Question = SingleQuestion | MultiQuestion | DualQuestion;

export const questions: Question[] = [
  {
    step: 1,
    kind: "single",
    key: "age",
    title: "年代を教えてください",
    options: [
      { value: "20s", label: "20代" },
      { value: "30s", label: "30代" },
      { value: "40s", label: "40代" },
      { value: "50p", label: "50代以上" },
    ],
  },
  {
    step: 2,
    kind: "single",
    key: "family",
    title: "家族構成を教えてください",
    options: [
      { value: "single", label: "単身" },
      { value: "couple", label: "夫婦2人" },
      { value: "kids", label: "子育て世帯" },
    ],
  },
  {
    step: 3,
    kind: "single",
    key: "loc",
    title: "現在の居住地は？",
    options: [
      { value: "tokyo", label: "東京・首都圏" },
      { value: "other", label: "その他都市部" },
      { value: "tohoku", label: "東北地方" },
      { value: "inside", label: "すでに福島県内" },
    ],
  },
  {
    step: 4,
    kind: "multi",
    key: "crops",
    title: "興味ある品目（複数選択可）",
    options: [
      { value: "momo", label: "桃🍑" },
      { value: "apple", label: "りんご🍎" },
      { value: "nashi", label: "梨🍐" },
      { value: "saku", label: "さくらんぼ🍒" },
      { value: "kyu", label: "きゅうり🥒" },
      { value: "rice", label: "米🌾" },
      { value: "any", label: "まだ決まっていない" },
    ],
  },
  {
    step: 5,
    kind: "single",
    key: "exp",
    title: "農業経験は？",
    options: [
      { value: "none", label: "なし" },
      { value: "garden", label: "家庭菜園程度" },
      { value: "part", label: "農業バイト経験あり" },
      { value: "train", label: "研修経験あり" },
    ],
  },
  {
    step: 6,
    kind: "single",
    key: "type",
    title: "就農形態のイメージ",
    options: [
      { value: "self", label: "自分で経営したい" },
      { value: "hire", label: "農業法人に就職" },
      { value: "idk", label: "まだわからない" },
    ],
  },
  {
    step: 7,
    kind: "single",
    key: "scale",
    title: "農地・規模のイメージ",
    options: [
      { value: "small", label: "0.5反以下でスタート" },
      { value: "mid", label: "1〜3反" },
      { value: "large", label: "3反以上" },
    ],
  },
  {
    step: 8,
    kind: "single",
    key: "cap",
    title: "用意できる自己資金",
    options: [
      { value: "u100", label: "100万円未満" },
      { value: "100to300", label: "100〜300万円" },
      { value: "300to500", label: "300〜500万円" },
      { value: "o500", label: "500万円以上" },
    ],
  },
  {
    step: 9,
    kind: "dual",
    title: "不安なこと・就農時期",
    worryOptions: [
      { value: "money", label: "資金" },
      { value: "info", label: "情報" },
      { value: "skill", label: "技術" },
      { value: "life", label: "生活・子育て" },
    ],
    timingOptions: [
      { value: "w1y", label: "1年以内" },
      { value: "w3y", label: "1〜3年" },
      { value: "o3y", label: "3年以上" },
      { value: "info", label: "まず情報収集" },
    ],
  },
  {
    step: 10,
    kind: "single",
    key: "window",
    title: "今一番知りたいこと",
    options: [
      { value: "fukunou", label: "就農手順・補助金" },
      { value: "kenpo", label: "福島県北の農地・JA" },
      { value: "iju", label: "移住・生活環境" },
      { value: "city", label: "市町村施策" },
      { value: "any", label: "まだわからない" },
    ],
  },
];
