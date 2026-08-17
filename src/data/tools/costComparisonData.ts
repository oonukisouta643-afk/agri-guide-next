// Tool C：コスト比較（東京 vs 福島県北 生活コスト比較）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool C：コスト比較」
// 「ペルソナ選択→支出カテゴリ別比較グラフ」という構成のみの指定で、具体的な金額の指定はなかったため
// 一般的な生活コストの相場観を参考にClaudeが作成した仮データ。実際の生活費は個人差が大きいため、
// ページ内に「※仮データ・目安」の注記を出す。単位：万円/月

export type CostPersona = {
  id: string;
  label: string;
  description: string;
  categories: { name: string; tokyo: number; fukushima: number }[];
};

export const costPersonas: CostPersona[] = [
  {
    id: "single",
    label: "単身",
    description: "一人暮らしの場合の生活コスト目安",
    categories: [
      { name: "家賃", tokyo: 8.5, fukushima: 4.0 },
      { name: "食費", tokyo: 4.0, fukushima: 3.2 },
      { name: "光熱費", tokyo: 1.2, fukushima: 1.5 },
      { name: "交通費", tokyo: 1.5, fukushima: 2.0 },
      { name: "その他", tokyo: 3.0, fukushima: 2.2 },
    ],
  },
  {
    id: "couple",
    label: "夫婦2人",
    description: "夫婦2人暮らしの場合の生活コスト目安",
    categories: [
      { name: "家賃", tokyo: 12.0, fukushima: 5.5 },
      { name: "食費", tokyo: 6.5, fukushima: 5.2 },
      { name: "光熱費", tokyo: 2.0, fukushima: 2.4 },
      { name: "交通費", tokyo: 2.5, fukushima: 3.0 },
      { name: "その他", tokyo: 4.5, fukushima: 3.3 },
    ],
  },
  {
    id: "kids",
    label: "子育て世帯",
    description: "子育て世帯（子2人想定）の場合の生活コスト目安",
    categories: [
      { name: "家賃", tokyo: 14.0, fukushima: 6.5 },
      { name: "食費", tokyo: 9.0, fukushima: 7.5 },
      { name: "光熱費", tokyo: 2.5, fukushima: 3.0 },
      { name: "教育費", tokyo: 6.0, fukushima: 3.5 },
      { name: "交通費", tokyo: 3.0, fukushima: 3.5 },
      { name: "その他", tokyo: 5.0, fukushima: 3.8 },
    ],
  },
];
