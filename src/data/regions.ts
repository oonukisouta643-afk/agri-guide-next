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
// 「date」＝伊達市は旧版では「果樹園地継承事業」を推しポイントとして紹介していたが、
// この事業名は実在が確認できない誤りだったため（2026年8月に県北地方で修正済み）、
// ここでは正しい制度名「伊達市新規就農者支援事業補助金」に置き換えて記載している。
//
// 2026年10月27日：「伊達地域全体」「県北地方総合相談窓口」という書き方は、県の県北農林事務所の
// 窓口を伊達市のもののように見せていたため、名前を「伊達市」に戻し、タグと説明は伊達市の公式ページ
// （移住支援、2026年10月27日に確認）に載っている制度だけで書き直した。裏取りできなかった
// 「農業塾」「多品目経営に向いた気候」の記述も外した。
//
// 2026年8月29日：「koori」（桑折町）の「地域おこし協力隊12名受け入れ・11名定着」という
// 具体的な数字と、「nihonmatsu」（二本松市）の「初心者向けセミナー（オンライン開催あり）」
// というタグ・訴求文言は、出典ページが見つからず／2022年開催の記録しか確認できないなど
// 裏取りが取れなかったため、具体的な数字・未確認の開催状況には触れない表現に修正した
// （県北6市町村_補助金制度調査.md 参照）。行政に最新状況を確認できたら、より具体的な
// 訴求内容に戻すことも検討する。

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
    name: "伊達市",
    tag: "市独自の新規就農者支援",
    crops: ["桃", "りんご", "梨", "さくらんぼ", "柿", "きゅうり", "米", "ぶどう"],
    cropKeys: ["momo", "apple", "nashi", "saku", "kaki", "kyu", "rice", "grape"],
    capKeys: ["100to300", "300to500", "o500"],
    familyKeys: ["single", "couple", "kids"],
    timingKeys: ["w1y", "w3y"],
    description:
      "伊達市新規就農者支援事業補助金（農地の賃借料、農業機械・施設、移住就農者の家賃・生活の支援など）がある。",
    push: "伊達市新規就農者支援事業補助金など、市独自の就農支援制度がある。",
    tradeoff: "支援制度の受付や要件は年度で変わるため、伊達市農政課の案内で確かめる必要がある。",
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
    description: "地域おこし協力隊制度を通じて、研修をしながら着実に就農をめざせる地域。",
    push: "地域おこし協力隊で研修しながら就農を目指せる地域。",
    tradeoff: "研修しながら準備する形なので、すぐに独立したい人には合わない場合があります。",
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
    tradeoff: "ももの産出額は伊達市の方が大きい（令和5年。東北農政局 福島県拠点「MAFF NAVI ふくしま」）。",
    link: "https://www.town.kunimi.fukushima.jp",
  },
  {
    key: "nihonmatsu",
    name: "二本松市",
    tag: "安達地方のまち",
    crops: ["りんご", "梨", "きゅうり", "米", "トマト"],
    cropKeys: ["apple", "nashi", "kyu", "rice", "tomato"],
    capKeys: ["u100", "100to300", "300to500"],
    familyKeys: ["single", "couple", "kids"],
    timingKeys: ["w3y", "o3y", "info"],
    description: "りんご・梨・野菜・米など、品目の幅が広い地域。",
    push: "果樹以外も含めて、品目を広く考えたい人向け。",
    tradeoff: "桃の主産地ではないため、桃を希望する方には伊達市・桑折町・国見町などの方が適している。",
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
    description: "地域おこし協力隊として就農をめざす道がある地域。",
    push: "地域おこし協力隊で就農を目指せる（募集の内容は村の公式サイトで確認）。",
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
    description: "米・野菜が中心の地域。",
    push: "米・野菜を考えている人向け。体験や移住の支援は、市の窓口で確かめてください。",
    tradeoff: "果樹の主産地ではない。米・野菜中心の農業が主流。",
    link: "https://www.city.motomiya.lg.jp",
  },
];
