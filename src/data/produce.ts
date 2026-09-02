// 福島県北の特産品データ（ProduceShowcaseで使用）
// 出典：OLD版 index.html #440-467（.produce-strip）
//
// OLD版は5品目中4品目をUnsplashの外部画像に依存していた。
// 変遷：
// 2026年8月20日①：外部画像はリンク切れリスクがあるとして、絵文字＋グラデーションに統一。
// 2026年8月20日②：見た目が単調というフィードバックを受け、絵文字表示から
// オリジナルのライン風SVGアイコン（ProduceIcons.tsx）に差し替え。
// 2026年8月20日③：「イラストではリアリティが出ない」というフィードバックを受け、
// Unsplash（無料ライセンス、Unsplash+の有料素材は除外）の実写真に差し替え。
// Hero.tsxの背景画像と同じ「外部URLを直接指定」方式（next/imageは使わずimgタグ）。
// 各写真はUnsplash Licenseの下で無料利用可能なものを選定（2026年8月20日確認）。
// 2026年8月20日④：米が航空写真の田んぼでスタイルが浮く／きゅうりが調理済みっぽいという
// フィードバックを受け、米は稲穂のクローズアップに、きゅうりは畑でツルになってる状態の
// クローズアップに差し替え（他の3品目と同じ「収穫前・素材そのもの」の見た目に統一）。
// 2026年8月20日⑤：④で差し替えたきゅうり写真が実際にはゴーヤ（bitter melon）だったと
// 判明（サイト表示で発覚）。ページテキストで「cucumber」と明記されている写真
// （half cucumber on white background）に差し替え。
// 2026年8月20日⑥：⑤の写真が白いスタジオ背景で、他3品目（自然な質感の写真）と
// スタイルが浮いて見えるというフィードバックを受け、学名「Cucumis sativus」まで
// 説明文に明記された、ツルに実った状態の自然な背景の写真に差し替え。
// 2026年8月20日⑦：⑥の写真も実際はきゅうりか判別しづらい（「うりでは？」との指摘）と
// 判明。外部ストック写真のテキスト情報頼りの選定を繰り返し外していたため方針転換し、
// 大貫さんご本人が提供した実写真（きゅうり、木製トレイ・木製テーブル、IMG_6662.JPG）を
// public/images/produce/kyuri.jpgとして自己ホストする方式に切り替え。外部URL依存・
// 品目誤認のリスクを両方解消。他4品目はUnsplash無料素材の外部リンクのまま。
// photoCreditはUnsplashクレジット表記用（法的必須ではないが記録として保持）。
// きゅうりのみ自己ホストのためphotoCreditは"提供写真"。

export type ProduceKey = "peach" | "apple" | "kaki" | "kyuri" | "rice";

export type ProduceItem = {
  key: ProduceKey;
  emoji: string;
  name: string;
  description: string;
  season: string;
  photoUrl: string;
  photoCredit: string;
};

export const produceItems: ProduceItem[] = [
  {
    key: "peach",
    emoji: "🍑",
    name: "桃",
    description:
      "盆地の寒暖差が育む糖度の高さが特徴。生産量全国2位。6月下旬〜9月下旬まで約60品種が楽しめる。",
    season: "旬：7〜8月",
    photoUrl:
      "https://images.unsplash.com/photo-1438274754346-45322cac87e4?auto=format&fit=crop&w=600&q=75",
    photoCredit: "Unsplash",
  },
  {
    key: "apple",
    emoji: "🍎",
    name: "りんご",
    description: "桃の収穫が終わる秋から収入になる品目。複数品目経営の安定化に欠かせない存在。",
    season: "旬：10〜12月",
    photoUrl:
      "https://images.unsplash.com/photo-1572166365087-96ac83103260?auto=format&fit=crop&w=600&q=75",
    photoCredit: "Unsplash",
  },
  {
    key: "kaki",
    emoji: "🍊",
    name: "あんぽ柿",
    description: "半乾燥の独特製法で作る福島の伝統食品。とろけるような食感と濃厚な甘さ。",
    season: "旬：11〜2月",
    photoUrl:
      "https://images.unsplash.com/photo-1762980623131-e58cae8cf401?auto=format&fit=crop&w=600&q=75",
    photoCredit: "Unsplash",
  },
  {
    key: "kyuri",
    emoji: "🥒",
    name: "きゅうり",
    description:
      "福島県は夏秋きゅうりの生産量全国1位。果樹より早く収入になりやすく、新規就農のスタートにも。",
    season: "旬：6〜9月",
    photoUrl: "/images/produce/kyuri.jpg",
    photoCredit: "提供写真",
  },
  {
    key: "rice",
    emoji: "🌾",
    name: "米",
    description: "阿武隈川の清流と盆地の寒暖差が育む良質米。冬は農閑期になるため他品目との組み合わせがしやすい。",
    season: "旬：9〜10月",
    photoUrl:
      "https://images.unsplash.com/photo-1759646850616-8bc3e6567ea5?auto=format&fit=crop&w=600&q=75",
    photoCredit: "Unsplash",
  },
];
