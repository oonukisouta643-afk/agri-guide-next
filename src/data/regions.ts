import type { CapKey, CropKey, FamilyKey, TimingKey } from "@/lib/simulator/types";

// 福島県北6地域の就農支援施策データ
// 出典：「AgriGuide_プロジェクト追記版_2026年8月」A章・「AgriGuide_Next移行_要件定義書v2.0」§6（地域マッチングスコアリングロジック）
// ／agri-simulator-v4.html（旧版）REGIONS配列（638〜690行目）から個別URL・push・tradeoff・
// スコアリング用の資金/家族/時期条件を移植。
//
// 2026年7月26日の就農フェアにて各行政担当者より掲載許可をいただいた情報。
//
// cropKeysは要件定義書§6「地域マッチングスコアリングロジック」の対応品目表 兼
// 旧版REGIONS配列のcrops値をQ4の新しい選択肢コード（momo/apple/nashi/grape/saku/kaki/
// kyu/tomato/rice/organic/flower/any/dairy/beef/chicken）に対応させたもの。
//
// 「date」＝伊達地域は旧版では「果樹園地継承事業」を推しポイントとして紹介していたが、
// この事業名は実在が確認できない誤りだったため（2026年8月に県北地方で修正済み）、
// ここでは正しい制度名「伊達市新規就農者支援事業補助金」に置き換えて記載している。

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
  /** 表示用（日本語ラベル） */
  crops: string[];
  /** シミュレーターのスコアリング用（Q4の選択肢コードと対応） */
  cropKeys: CropKey[];
  /** スコアリング用：自己資金の範囲内で始めやすいか */
  capKeys: CapKey[];
  /** スコアリング用：生活環境が向いている家族構成 */
  familyKeys: FamilyKey[];
  /** スコアリング用：向いている就農時期 */
  timingKeys: TimingKey[];
  description: string;
  /** 地域の推しポイント（ポジティブな訴求文） */
  push: string;
  /** 注意点・向き不向き（トレードオフの説明） */
  tradeoff: string;
  link: string;
};

export const regions: Region[] = [
  {
    key: "date",
    name: "伊達地域全体",
    tag: "県北地方総合相談窓口",
    crops: ["桃", "りんご", "梨", "さくらんぼ", "柿", "きゅうり", "米", "ぶどう"],
    cropKeys: ["momo", "apple", "nashi", "saku", "kaki", "kyu", "rice", "grape"],
    capKeys: ["100to300", "300to500", "o500"],
    familyKeys: ["single", "couple", "kids"],
    timingKeys: ["w1y", "w3y"],
    description:
      "伊達市新規就農者支援事業補助金など独自の支援制度があり、多品目経営に向いた気候。農業塾・地域おこし協力隊など、県北地域全体の就農相談窓口。",
    push: "伊達市新規就農者支援事業補助金など独自の支援制度があり、多品目経営に向いた気候。",
    tradeoff: "農地の競争率が高い場合あり。JAの農業塾への参加が就農への近道。",
    link: "https://www.city.fukushima-date.lg.jp/site/iju/ouen.html",
  },
  {
    key: "koori",
    name: "桑折町",
    tag: "献上桃の郷",
    crops: ["桃", "さくらんぼ"],
    cropKeys: ["momo", "saku"],
    capKeys: ["u100", "100to300", "300to500", "o500"],
    familyKeys: ["single", "couple", "kids"],
    timingKeys: ["w1y", "w3y", "o3y", "info"],
    description: "地域おこし協力隊を12名受け入れ、うち11名が定着した実績あり。",
    push: "地域おこし協力隊で研修しながら就農。12名受け入れ・11名が定着という実績。",
    tradeoff: "研修期間が2〜3年かかる。即就農よりじっくり育てたい人向け。",
    link: "https://www.town.koori.fukushima.jp/site/iju/1831.html",
  },
  {
    key: "kunimi",
    name: "国見町",
    tag: "くにみ農業ビジネス訓練所",
    crops: ["桃", "りんご", "梨", "さくらんぼ", "米"],
    cropKeys: ["momo", "apple", "nashi", "saku", "rice"],
    capKeys: ["u100", "100to300", "300to500", "o500"],
    familyKeys: ["single", "couple", "kids"],
    timingKeys: ["w1y", "w3y", "o3y", "info"],
    description: "座学＋実習の訓練プログラムと、住宅取得支援を用意。",
    push: "農業ビジネス訓練所で座学＋実習。未経験でも体系的に学べる研修体制あり。",
    tradeoff: "桃の産地としては桑折町・伊達市の方が規模が大きい。",
    link: "https://www.town.kunimi.fukushima.jp",
  },
  {
    key: "nihonmatsu",
    name: "二本松市",
    tag: "初心者向けセミナーあり",
    crops: ["りんご", "梨", "きゅうり", "米", "トマト"],
    cropKeys: ["apple", "nashi", "kyu", "rice", "tomato"],
    capKeys: ["u100", "100to300", "300to500"],
    familyKeys: ["single", "couple", "kids"],
    timingKeys: ["w3y", "o3y", "info"],
    description: "初心者向けセミナー（オンライン開催あり）や、お試し農業体験を実施。",
    push: "農業初心者向けセミナー（オンライン開催あり）。お試し農業体験も可能。",
    tradeoff: "桃の主産地ではないため、桃希望の方には伊達地域の方が適している。",
    link: "https://www.city.nihonmatsu.lg.jp/",
  },
  {
    key: "otama",
    name: "大玉村",
    tag: "小さくても輝く、大いなる田舎",
    crops: ["米", "トマト", "きゅうり"],
    cropKeys: ["rice", "tomato", "kyu"],
    capKeys: ["u100", "100to300"],
    familyKeys: ["kids"],
    timingKeys: ["w3y", "o3y", "info"],
    description: "地域おこし協力隊・子育て支援が充実。45年連続で人口増加を継続。",
    push: "45年間人口増加中。子育て支援が充実。地域おこし協力隊で就農を目指せる。",
    tradeoff: "果樹より野菜・米向きの地域。果樹希望の方には向かない場合あり。",
    link: "https://www.vill.otama.fukushima.jp",
  },
  {
    key: "motomiya",
    name: "本宮市",
    tag: "へそのまち",
    crops: ["米", "トマト"],
    cropKeys: ["rice", "tomato"],
    capKeys: ["u100", "100to300"],
    familyKeys: ["single", "couple"],
    timingKeys: ["info", "o3y"],
    description: "お試し宿泊制度があり、体験移住から始められる。",
    push: "宿泊施設でお試し滞在しながら農業体験できる。まず雰囲気を掴みたい人向け。",
    tradeoff: "果樹の主産地ではない。米・野菜中心の農業が主流。",
    link: "https://www.city.motomiya.lg.jp",
  },
];
