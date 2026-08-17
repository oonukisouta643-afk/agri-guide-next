import type { AgeKey, CropKey, ExpKey, FamilyKey } from "@/lib/simulator/types";

// 結果⑥「似た条件の人カード」の仮データ（4パターン）
// 出典：「AgriGuide_プロジェクト追記版_2026年8月」B章
// 「似た条件の人カード：HTMLには実装したが仮データのみ。農家ヒアリング後に実データへ差し替え」
// との記載の通り、ここに掲載する4名は全て仮データ（架空の人物）。
// 要件定義書にはマッチング対象の属性・スコアリング式の明記がないため、
// このドキュメント作成時に年代・家族構成・農業経験・興味品目の一致度から
// 簡易スコアリングする方式で実装した（src/lib/simulator/calculations.ts参照）。
// 実データ・実際のマッチング基準が固まり次第、差し替えが必要。

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
    now: "桃農家（就農3年目）",
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
    now: "りんご農家（就農2年目）",
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
    now: "さくらんぼ農家（研修修了・独立準備中）",
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
    now: "米農家（就農1年目）",
    quote: "定年後のセカンドキャリアとして、夫婦で新しい生活を始めました。",
    link: "/farmers",
    age: "50p",
    family: "couple",
    exp: "none",
    crops: ["rice"],
  },
];
