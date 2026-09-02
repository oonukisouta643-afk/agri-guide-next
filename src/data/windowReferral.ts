// Q10 窓口斡旋の詳細仕様
// 出典：「AgriGuide_プロジェクト追記版_2026年8月」B章／agri-simulator-v4.html（旧版）WINDOWSオブジェクト
// （735〜771行目）からdesc・per-window色テーマを移植。
//
// URLは旧版のまま移植すると誤り（/consultation/）になる窓口があったため、
// プロジェクト内で既に修正済みの正しいURL（/syuno/）はそのまま維持している。

import type { WindowKey } from "@/lib/simulator/types";

export type WindowReferral = {
  key: WindowKey;
  name: string;
  /** 窓口の説明文（旧版desc） */
  desc: string;
  url: string;
  /** CTAボタンのラベル */
  label: string;
  /** テーマカラー（見出し・ボタン背景） */
  color: string;
  /** カード背景色 */
  bg: string;
  /** カード枠線色 */
  border: string;
};

export const windowReferrals: Record<WindowKey, WindowReferral> = {
  fukunou: {
    key: "fukunou",
    name: "ふくのう（農業経営・就農支援センター）",
    desc: "就農の手順・補助金・研修機関の紹介まで何でも無料で相談できます。オンライン相談も可能です。",
    url: "https://start-fukuagri.jp/syuno/",
    label: "ふくのうへ相談する",
    color: "#2D7A2D",
    bg: "#F0FBF0",
    border: "#B8E0B8",
  },
  kenpo: {
    key: "kenpo",
    name: "県北地方総合相談窓口",
    desc: "福島県北の農地・品目・JAへの接続など、県北エリアに特化した相談ができます。",
    url: "https://www.pref.fukushima.lg.jp/sec/36210a/",
    label: "県北地方総合相談窓口へ",
    color: "#1A4878",
    bg: "#E5EEF8",
    border: "#A0C0E8",
  },
  iju: {
    key: "iju",
    name: "移住サポート総合窓口",
    desc: "福島県への移住・住まい・子育て・生活環境について相談できます。就農と移住を同時に考えたい方向け。",
    url: "https://www.fukushima-iju.jp/index.html",
    label: "移住サポート総合窓口へ",
    color: "#5B2D8A",
    bg: "#F0E8FB",
    border: "#C0A0E0",
  },
  city: {
    key: "city",
    name: "各市町村窓口",
    desc: "気になる市町村が決まっている方は直接問い合わせるのが一番早いです。桑折町・国見町・二本松市・大玉村・本宮市の各窓口へ。",
    url: "https://fukushima-agri-guide.jp/#chiiki",
    label: "各市町村の情報を見る",
    color: "#B08020",
    bg: "#FBF5E0",
    border: "#D0B860",
  },
  any: {
    key: "any",
    name: "ふくのう（まず何でも相談OK）",
    desc: "「何を聞けばいいかわからない」という状態でも大丈夫です。ふくのうは就農前の漠然とした相談も歓迎しています。",
    url: "https://start-fukuagri.jp/syuno/",
    label: "ふくのうへ相談する",
    color: "#2D7A2D",
    bg: "#F0FBF0",
    border: "#B8E0B8",
  },
};
