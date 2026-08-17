// 福島県北6地域の就農支援施策データ
// 出典：「AgriGuide_プロジェクト追記版_2026年8月」A章・「AgriGuide_Next移行_要件定義書v2.0」§6（地域マッチングスコアリングロジック）
//
// 2026年7月26日の就農フェアにて各行政担当者より掲載許可をいただいた情報。
// 各地域の「詳細を確認する」リンク先は、地域ごとの個別ページが確定するまでの暫定措置として
// 県北地方総合相談窓口の共通ページに揃えている（要更新：地域別の個別URLが判明次第差し替え）。

export type RegionKey =
  | "date"
  | "koori"
  | "kunimi"
  | "nihonmatsu"
  | "otama"
  | "motomiya";

export type Region = {
  key: RegionKey;
  name: string;
  tag: string;
  crops: string[];
  description: string;
  link: string;
};

const KENPO_URL = "https://www.pref.fukushima.lg.jp/sec/36210a/";

export const regions: Region[] = [
  {
    key: "date",
    name: "伊達地域全体",
    tag: "県北地方総合相談窓口",
    crops: ["桃", "りんご", "梨", "さくらんぼ", "柿", "きゅうり", "米"],
    description: "果樹園地継承事業・農業塾・地域おこし協力隊など、県北地域全体の就農相談窓口。",
    link: KENPO_URL,
  },
  {
    key: "koori",
    name: "桑折町",
    tag: "献上桃の郷",
    crops: ["桃", "さくらんぼ"],
    description: "地域おこし協力隊を12名受け入れ、うち11名が定着した実績あり。",
    link: KENPO_URL,
  },
  {
    key: "kunimi",
    name: "国見町",
    tag: "くにみ農業ビジネス訓練所",
    crops: ["桃", "りんご", "梨", "さくらんぼ", "米"],
    description: "座学＋実習の訓練プログラムと、住宅取得支援を用意。",
    link: KENPO_URL,
  },
  {
    key: "nihonmatsu",
    name: "二本松市",
    tag: "4つの顔を持つ街",
    crops: ["りんご", "梨", "きゅうり", "米"],
    description: "初心者向けセミナーや、お試し農業体験を実施。",
    link: KENPO_URL,
  },
  {
    key: "otama",
    name: "大玉村",
    tag: "小さくても輝く、大いなる田舎",
    crops: ["米", "きゅうり"],
    description: "地域おこし協力隊・子育て支援が充実。45年連続で人口増加を継続。",
    link: KENPO_URL,
  },
  {
    key: "motomiya",
    name: "本宮市",
    tag: "へそのまち",
    crops: ["米"],
    description: "お試し宿泊制度があり、体験移住から始められる。",
    link: KENPO_URL,
  },
];
