import type { AgeKey, CropKey, ExpKey, FamilyKey } from "@/lib/simulator/types";

// 結果⑥「似た条件の人カード」の仮データ（4パターン）
// 出典：「AgriGuide_プロジェクト追記版_2026年8月」B章
// 「似た条件の人カード：HTMLには実装したが仮データのみ。農家ヒアリング後に実データへ差し替え」
// との記載の通り、ここに掲載する4名は全て仮データ（架空の人物）。
// 要件定義書にはマッチング対象の属性・スコアリング式の明記がないため、
// このドキュメント作成時に年代・家族構成・農業経験・興味品目の一致度から
// 簡易スコアリングする方式で実装した（src/lib/simulator/calculations.ts参照）。
// 実データ・実際のマッチング基準が固まり次第、差し替えが必要。
//
// 収入figuresについて：agri-simulator-v4.html（旧版）SIMILAR_CASES（822〜847行目）は
// 4名とも具体的な農業収入額を記載していたが、Next版のペルソナ（Aさん伊達市桃／Bさん二本松
// りんご／Cさん国見さくらんぼ／Dさん大玉米）は旧版の4名（桃+りんご／きゅうり+米／桃+さくらんぼ／
// 米+トマト）と1:1で一致しない。年代・家族構成・品目が近いケースは旧版の実数値をそのまま移植し、
// 対応が薄いケースは近似値として推定した（各ケースのコメントに移植／推定の別を明記）。

export type SimilarCase = {
  id: string;
  name: string;
  area: string;
  before: string;
  now: string;
  quote: string;
  link: string;
  age: AgeKey;
  family: FamilyKey;
  exp: ExpKey;
  crops: CropKey[];
};

export const similarCases: SimilarCase[] = [
  {
    id: "case-a",
    name: "Aさん",
    area: "伊達市",
    before: "都内IT企業・営業職",
    // 旧版case_a（30代・単身・桃）の実数値をそのまま移植：「4年目で農業収入約280万円」
    now: "桃農家（就農3年目）。前年の4年目時点で農業収入は約280万円（仮データ）。",
    quote: "何も分からないまま飛び込みましたが、研修制度のおかげで何とかなりました。",
    link: "/farmers",
    age: "30s",
    family: "single",
    exp: "none",
    crops: ["momo"],
  },
  {
    id: "case-b",
    name: "Bさん",
    area: "二本松市",
    before: "会社員（家庭菜園歴10年）",
    // 旧版case_b（夫婦・きゅうり+米）の実数値を近似移植：「夫婦2人で年収計400万円超」
    now: "りんご農家（就農2年目）。夫婦2人で農業収入は世帯計400万円超を目標（仮データ）。",
    quote: "家庭菜園の延長線で始められたのが、自分には合っていました。",
    link: "/farmers",
    age: "40s",
    family: "couple",
    exp: "garden",
    crops: ["apple"],
  },
  {
    id: "case-c",
    name: "Cさん",
    area: "国見町",
    before: "農業バイト経験あり・フリーランス",
    // 収入額は旧版に直接対応するケースがないための推定値（就農準備資金150万円/年を踏まえた独立後目標）
    now: "さくらんぼ農家（研修修了・独立準備中）。独立後は農業収入で年間約250万円を目標（推定値）。",
    quote: "くにみ農業ビジネス訓練所の座学と実習で、ゼロから知識を積み上げられました。",
    link: "/farmers",
    age: "20s",
    family: "single",
    exp: "part",
    crops: ["saku"],
  },
  {
    id: "case-d",
    name: "Dさん",
    area: "大玉村",
    before: "会社員（定年退職）",
    // 収入額は旧版に直接対応するケースがないための推定値（就農1年目・小規模米作の一般的目安）
    now: "米農家（就農1年目）。1年目の農業収入は約80万円、3年目に150万円台への到達を目標（推定値）。",
    quote: "定年後のセカンドキャリアとして、夫婦で新しい生活を始めました。",
    link: "/farmers",
    age: "50p",
    family: "couple",
    exp: "none",
    crops: ["rice"],
  },
];
