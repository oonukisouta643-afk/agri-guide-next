// Tool C：コスト比較（東京 vs 福島県北 生活コスト比較）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool C：コスト比較」
// 世帯タイプ別（単身/夫婦2人/子育て世帯）カテゴリ比較（categories/costPersonas）はClaude作成の仮データのまま維持。
//
// 加えて、旧サイト（netlify-0816/agri-tools.html 206-221, 706-795行）の
// 「東京での手取り月収スライダー（20〜50万円）で人物像と収支が動的に切り替わる」インタラクションを移植。
// 家賃・食費・光熱費・交通費・通信費・娯楽交際費の内訳、就農準備資金（年150万円＝月12.5万円）、
// ペルソナ名・説明文・コメント文の計算式・しきい値は全て旧サイトの実データ・実ロジックをそのまま移植したもの。
// 出典：SUUMO 2024年12月データ（福島市周辺家賃）、総務省家計調査2024年・単身世帯データ（旧サイト303-305行）

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

// ── 収入スライダー・モデルケース（旧サイト移植） ──

export const COST_INCOME_MIN = 20;
export const COST_INCOME_MAX = 50;
export const COST_INCOME_DEFAULT = 28;

export type IncomeComparison = {
  income: number;
  personaName: string;
  personaDesc: string;
  tokyo: {
    rent: number;
    food: number;
    util: number;
    trans: number;
    comm: number;
    enter: number;
    total: number;
    left: number;
  };
  fukushima: {
    rent: number;
    food: number;
    util: number;
    trans: number;
    comm: number;
    enter: number;
    total: number;
    subsidy: number;
    left: number;
  };
  comment: string;
};

/**
 * 東京の手取り月収（20〜50万円）に応じてモデルケース人物像・支出・コメントを算出する。
 * 旧サイト updCost() 関数（agri-tools.html 706-795行）のロジックをそのまま移植。
 */
export function computeIncomeComparison(income: number): IncomeComparison {
  // 手取りに応じたペルソナ
  let personaName: string;
  let personaDesc: string;
  if (income <= 23) {
    personaName = "山田さん（27歳・独身）";
    personaDesc =
      "東京・一人暮らし3年目。手取りは少なく家賃を払うと余裕がほとんどない。農業への興味はあるが「お金が心配」と感じている。";
  } else if (income <= 32) {
    personaName = "田中さん（35歳・独身）";
    personaDesc =
      "東京・一人暮らし8年目。会社員として働きながら農業に関心を持ち始めた。補助金込みの農業収入と比べてみると意外な発見がある。";
  } else if (income <= 42) {
    personaName = "鈴木さん（38歳・独身）";
    personaDesc = "東京・管理職。手取りは悪くないが家賃と税金で消えていく。農業という選択肢を真剣に検討中。";
  } else {
    personaName = "佐藤さん（42歳・独身）";
    personaDesc =
      "東京・高収入だが激務。農業への憧れはある。収入は下がるが生活の質が上がるかもしれない選択肢として農業を見ている。";
  }

  // 東京の家賃（手取りの約30〜35%が相場、8〜15万円でクランプ）
  let rent = Math.round(income * 0.3);
  if (rent < 8) rent = 8;
  if (rent > 15) rent = 15;

  // 東京の支出（総務省家計調査2024年ベース）
  const food = 4.6;
  const util = 1.3;
  const trans = income > 35 ? 3.5 : 2.5;
  const comm = 1.0;
  const enter = income > 35 ? 3 : 2;
  const tokyoTotal = rent + food + util + trans + comm + enter;
  const tokyoLeft = income - tokyoTotal;

  // 福島県北の支出
  const fRent = 4.8; // SUUMO 2024年12月 福島市1K平均
  const fFood = 3.5;
  const fUtil = 1.3;
  const fTrans = 1.5; // 車維持費含む
  const fComm = 1.0;
  const fEnter = 1.5;
  const fTotal = fRent + fFood + fUtil + fTrans + fComm + fEnter;
  const subsidy = 12.5; // 就農準備資金 年150万円÷12
  const fLeft = subsidy - fTotal;

  // コメント
  let comment: string;
  if (income <= 25) {
    comment = `${personaName}の場合、東京では毎月${tokyoLeft.toFixed(1)}万円しか残りません。就農研修中の補助金（月12.5万円）だけでも、支出を抑えれば生活できる水準です。農業収入が加わる就農3年目以降はさらに改善します。`;
  } else if (income <= 35) {
    comment = `${personaName}の場合、東京では${tokyoLeft.toFixed(1)}万円残りますが、研修中の福島でも補助金だけで${fLeft >= 0 ? "+" : ""}${fLeft.toFixed(1)}万円残ります。収入は下がりますが生活コストも下がるため、手元に残るお金の差は思ったより小さいかもしれません。`;
  } else {
    comment = `${personaName}の場合、東京の手取りは高いですが支出も多い。農業収入が安定する就農3〜5年目以降は、福島県北での農業収入（果樹農家の平均200〜400万円）と低い生活コストの組み合わせで、実質的な豊かさが逆転する可能性があります。`;
  }

  return {
    income,
    personaName,
    personaDesc,
    tokyo: { rent, food, util, trans, comm, enter, total: tokyoTotal, left: tokyoLeft },
    fukushima: { rent: fRent, food: fFood, util: fUtil, trans: fTrans, comm: fComm, enter: fEnter, total: fTotal, subsidy, left: fLeft },
    comment,
  };
}
