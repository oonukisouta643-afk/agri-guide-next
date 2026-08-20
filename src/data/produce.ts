// 福島県北の特産品データ（ProduceShowcaseで使用）
// 出典：OLD版 index.html #440-467（.produce-strip）
//
// OLD版は5品目中4品目をUnsplashの外部画像に依存していたが、外部画像は
// リンク切れ・読み込み失敗のリスクがあり本番サイトとして脆弱なため、
// Next移行では5品目すべて画像の外部依存なしで統一した。
// 2026年8月20日：見た目が単調というフィードバックを受け、絵文字表示から
// オリジナルのライン風SVGアイコン（ProduceIcons.tsx）に差し替え。
// emojiフィールドはalt代替やメタ情報として引き続き保持。
//
// colorKeyはTailwindのグラデーションクラスを紐付けるためのキー。
// クラス文字列自体はProduceShowcase.tsx側で定義する（Tailwindのcontentスキャン対象は
// src/pages・src/components・src/appのみで、src/dataは対象外のため、クラス文字列を
// データファイル側に置くとスキャンされずスタイルが生成されない。forms.tsのcolorフィールドを
// Field.tsxのbadgeColorByFormでマッピングしているのと同じパターン）。

export type ProduceKey = "peach" | "apple" | "kaki" | "kyuri" | "rice";

export type ProduceItem = {
  key: ProduceKey;
  emoji: string;
  name: string;
  description: string;
  season: string;
};

export const produceItems: ProduceItem[] = [
  {
    key: "peach",
    emoji: "🍑",
    name: "桃",
    description:
      "盆地の寒暖差が育む糖度の高さが特徴。生産量全国2位。6月下旬〜9月下旬まで約60品種が楽しめる。",
    season: "旬：7〜8月",
  },
  {
    key: "apple",
    emoji: "🍎",
    name: "りんご",
    description: "桃の収穫が終わる秋から収入になる品目。複数品目経営の安定化に欠かせない存在。",
    season: "旬：10〜12月",
  },
  {
    key: "kaki",
    emoji: "🍊",
    name: "あんぽ柿",
    description: "半乾燥の独特製法で作る福島の伝統食品。とろけるような食感と濃厚な甘さ。",
    season: "旬：11〜2月",
  },
  {
    key: "kyuri",
    emoji: "🥒",
    name: "きゅうり",
    description:
      "福島県は夏秋きゅうりの生産量全国1位。果樹より早く収入になりやすく、新規就農のスタートにも。",
    season: "旬：6〜9月",
  },
  {
    key: "rice",
    emoji: "🌾",
    name: "米",
    description: "阿武隈川の清流と盆地の寒暖差が育む良質米。冬は農閑期になるため他品目との組み合わせがしやすい。",
    season: "旬：9〜10月",
  },
];
