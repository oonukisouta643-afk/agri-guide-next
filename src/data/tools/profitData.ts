// Tool G：品目別収益モデル
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool G：品目別収益モデル」
// 「桃/りんご/きゅうり/米/梨の5品目・年別棒グラフ・初期費用・黒字化年数」という構成のみの指定で、
// 具体的な金額の指定はなかったため、一般的な就農収益モデルの相場観を参考にClaudeが作成した仮データ。
// 実際の収益は経営規模・地域・気候等により大きく異なるため、ページ内に「※仮データ・目安」の注記を出す。

export type ProfitCrop = {
  key: string;
  label: string;
  emoji: string;
  initialCost: string;
  breakEvenYears: string;
  /** 1〜5年目の想定年間収入（万円） */
  yearlyRevenue: number[];
};

export const profitCrops: ProfitCrop[] = [
  {
    key: "momo",
    label: "桃",
    emoji: "🍑",
    initialCost: "約400万円",
    breakEvenYears: "4〜5年目",
    yearlyRevenue: [30, 90, 160, 240, 320],
  },
  {
    key: "apple",
    label: "りんご",
    emoji: "🍎",
    initialCost: "約450万円",
    breakEvenYears: "5〜6年目",
    yearlyRevenue: [20, 70, 130, 200, 280],
  },
  {
    key: "kyu",
    label: "きゅうり",
    emoji: "🥒",
    initialCost: "約250万円",
    breakEvenYears: "2〜3年目",
    yearlyRevenue: [120, 220, 300, 340, 360],
  },
  {
    key: "rice",
    label: "米",
    emoji: "🌾",
    initialCost: "約300万円",
    breakEvenYears: "3〜4年目",
    yearlyRevenue: [80, 150, 220, 260, 290],
  },
  {
    key: "nashi",
    label: "梨",
    emoji: "🍐",
    initialCost: "約420万円",
    breakEvenYears: "5年目",
    yearlyRevenue: [25, 80, 150, 220, 300],
  },
];
