// 就農シミュレーター：Q1〜Q10 質問定義
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6／agri-simulator-v4.html（旧版）の質問内容を移植

export type Option = { value: string; label: string; icon?: string; sub?: string };

export type SingleQuestion = {
  step: number;
  kind: "single";
  key: "age" | "loc" | "family" | "exp" | "type" | "scale" | "window";
  title: string;
  subtitle?: string;
  options: Option[];
  /** 旧版Q3にあったSNS情報収集バー（LINE/Instagram/X/YouTube） */
  hintBand?: boolean;
};

export type OptionGroup = { icon: string; label: string; options: Option[] };

export type MultiQuestion = {
  step: number;
  kind: "multi";
  key: "crops";
  title: string;
  subtitle?: string;
  groups: OptionGroup[];
};

// Q8は「目標年収スライダー」と「自己資金の選択」を1画面にまとめた旧版の特殊フォーマット
export type CapIncomeQuestion = {
  step: number;
  kind: "capIncome";
  key: "cap";
  title: string;
  subtitle?: string;
  incomeLabel: string;
  incomeMin: number;
  incomeMax: number;
  incomeStep: number;
  capLabel: string;
  options: Option[];
};

// Q9のみ「不安」「就農時期」の2択を同時に選ぶ特殊フォーマット
export type DualQuestion = {
  step: number;
  kind: "dual";
  title: string;
  subtitle?: string;
  worryLabel: string;
  worryOptions: Option[];
  timingLabel: string;
  timingOptions: Option[];
};

export type Question = SingleQuestion | MultiQuestion | CapIncomeQuestion | DualQuestion;

export const questions: Question[] = [
  {
    step: 1,
    kind: "single",
    key: "age",
    title: "あなたは今、何歳ですか？",
    subtitle: "年齢によって受け取れる補助金の種類と金額が変わります。",
    options: [
      { value: "20s", label: "20代", icon: "🌱" },
      { value: "30s", label: "30代", icon: "🌿" },
      { value: "40s", label: "40代", icon: "🍂" },
      { value: "50p", label: "50代以上", icon: "🌾" },
    ],
  },
  {
    step: 2,
    kind: "single",
    key: "family",
    title: "一緒に移住する家族はいますか？",
    subtitle: "家族構成で移住支援金が変わります（単身60万円・家族100万円）。",
    options: [
      { value: "single", label: "単身", icon: "🧍" },
      { value: "couple", label: "夫婦2人", icon: "👫" },
      { value: "kids", label: "子育て世帯", icon: "👨‍👩‍👧" },
    ],
  },
  {
    step: 3,
    kind: "single",
    key: "loc",
    title: "今どこに住んでいますか？",
    subtitle: "東京圏からの移住だとふくしま移住支援金の対象になりやすいです。",
    hintBand: true,
    options: [
      { value: "tokyo", label: "東京・首都圏", icon: "🗼" },
      { value: "other", label: "その他の都市部", icon: "🏙️" },
      { value: "tohoku", label: "東北地方", icon: "🏔️" },
      { value: "inside", label: "福島県内", icon: "🌿" },
    ],
  },
  {
    step: 4,
    kind: "multi",
    key: "crops",
    title: "作ってみたい農産物はありますか？",
    subtitle: "複数選んでOK。まだ決まっていなければ「まだわからない」で大丈夫です。",
    groups: [
      {
        icon: "🌳",
        label: "果樹・果物",
        options: [
          { value: "momo", label: "桃", icon: "🍑" },
          { value: "apple", label: "りんご", icon: "🍎" },
          { value: "nashi", label: "梨", icon: "🍐" },
          { value: "grape", label: "ぶどう", icon: "🍇" },
          { value: "saku", label: "さくらんぼ", icon: "🍒" },
          { value: "kaki", label: "あんぽ柿", icon: "🟠" },
        ],
      },
      {
        icon: "🥬",
        label: "野菜・畑作",
        options: [
          { value: "kyu", label: "きゅうり", icon: "🥒" },
          { value: "tomato", label: "トマト", icon: "🍅" },
          { value: "rice", label: "米・野菜", icon: "🌾" },
          { value: "organic", label: "有機農業", icon: "🌿" },
          { value: "flower", label: "花き", icon: "🌷" },
          { value: "any", label: "まだわからない", icon: "🤔" },
        ],
      },
      {
        icon: "🐄",
        label: "畜産",
        options: [
          { value: "dairy", label: "酪農", icon: "🐄" },
          { value: "beef", label: "肉用牛", icon: "🥩" },
          { value: "chicken", label: "養鶏", icon: "🐔" },
        ],
      },
    ],
  },
  {
    step: 5,
    kind: "single",
    key: "exp",
    title: "農業の経験はありますか？",
    subtitle: "経験ゼロでも大丈夫。年150万円の補助を受けながら研修できます。",
    options: [
      { value: "none", label: "全くない", icon: "🌱" },
      { value: "garden", label: "家庭菜園程度", icon: "🪴" },
      { value: "part", label: "農業バイト経験あり", icon: "🌾" },
      { value: "train", label: "研修経験あり", icon: "👨‍🌾" },
    ],
  },
  {
    step: 6,
    kind: "single",
    key: "type",
    title: "どんな形で農業を始めたいですか？",
    subtitle: "まだ決まっていなければ「まだわからない」でOKです。",
    options: [
      { value: "self", label: "新規に農地を借りて始める", icon: "🌱" },
      { value: "inherit", label: "農家から引き継ぐ", icon: "🤝" },
      { value: "hire", label: "農業法人に就職してから", icon: "👷" },
      { value: "idk", label: "まだわからない", icon: "🤔" },
    ],
  },
  {
    step: 7,
    kind: "single",
    key: "scale",
    title: "希望する農地の規模感を教えてください",
    subtitle: "まだ未定でも大丈夫です。",
    options: [
      { value: "small", label: "0.5反以下でスタート", icon: "🌱", sub: "まず試してみたい" },
      { value: "mid", label: "1〜3反", icon: "🌿", sub: "生活できる規模で" },
      { value: "large", label: "3反以上", icon: "🌾", sub: "本格的にやりたい" },
      { value: "unknown", label: "まだわからない", icon: "🤔" },
    ],
  },
  {
    step: 8,
    kind: "capIncome",
    key: "cap",
    title: "目標年収と自己資金を教えてください",
    subtitle: "概算で大丈夫です。",
    incomeLabel: "農業で稼ぎたい年収（3年目のイメージ）",
    incomeMin: 100,
    incomeMax: 800,
    incomeStep: 50,
    capLabel: "用意できる自己資金",
    options: [
      { value: "u100", label: "100万円未満", icon: "💳" },
      { value: "100to300", label: "100〜300万円", icon: "💰" },
      { value: "300to500", label: "300〜500万円", icon: "💴" },
      { value: "o500", label: "500万円以上", icon: "🏦" },
    ],
  },
  {
    step: 9,
    kind: "dual",
    title: "一番不安なことといつ頃動きたいか教えてください",
    worryLabel: "一番不安なこと",
    worryOptions: [
      { value: "money", label: "資金・費用", icon: "💰" },
      { value: "info", label: "情報・手続き", icon: "📋" },
      { value: "skill", label: "農業の技術", icon: "🌾" },
      { value: "life", label: "生活・子育て", icon: "🏡" },
    ],
    timingLabel: "いつ頃動きたい？",
    timingOptions: [
      { value: "w1y", label: "1年以内に動きたい", icon: "🔥" },
      { value: "w3y", label: "1〜3年以内", icon: "📅" },
      { value: "o3y", label: "3年以上先", icon: "🌄" },
      { value: "info", label: "まず情報収集", icon: "👀" },
    ],
  },
  {
    step: 10,
    kind: "single",
    key: "window",
    title: "今一番知りたいことは何ですか？",
    subtitle: "選ぶだけでOKです。結果画面で最適な相談窓口をご案内します。",
    options: [
      { value: "fukunou", label: "就農手順・補助金", icon: "🌱" },
      { value: "kenpo", label: "福島県北の農地・JA", icon: "🍑" },
      { value: "iju", label: "移住・生活環境", icon: "🏡" },
      { value: "city", label: "市町村施策", icon: "🏛️" },
      { value: "any", label: "まだわからない", icon: "💬" },
    ],
  },
];
