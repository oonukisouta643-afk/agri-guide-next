// Q10 窓口斡旋の詳細仕様
// 出典：「AgriGuide_プロジェクト追記版_2026年8月」B章／agri-simulator-v4.html（旧版）WINDOWSオブジェクト
// （735〜771行目）からdesc・per-window色テーマを移植。
//
// URLは旧版のまま移植すると誤り（/consultation/）になる窓口があったため、
// プロジェクト内で既に修正済みの正しいURL（/syuno/）はそのまま維持している。
//
// 2026年10月27日：「ふくのう」は県農業担い手課が運営する就農サイト、「福島県農業経営・就農支援センター」は
// 県と農業団体3者が運営する相談窓口で、別のもの。/syuno/ はセンターへの相談の申込ページなので、窓口名をセンターにし、
// 「ふくのうから申し込む」と書き分けた。出典：https://start-fukuagri.jp/syuno/ 、
// https://www.pref.fukushima.lg.jp/sec/36021c/nougyokeiei-syunoushien-gaiyou.html （2026年10月9日更新）。2026年10月27日に確認。

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
    name: "福島県農業経営・就農支援センター",
    desc: "県・JAグループ福島・県農業会議・県農業振興公社が共同で運営する相談窓口です。就農の手順・補助金・研修先などを相談できます。県の就農サイト「ふくのう」から申し込め、オンライン（Zoom）相談も選べます。",
    url: "https://start-fukuagri.jp/syuno/",
    label: "ふくのうから相談を申し込む",
    color: "#2D7A2D",
    bg: "#F0FBF0",
    border: "#B8E0B8",
  },
  kenpo: {
    key: "kenpo",
    name: "福島県 県北農林事務所",
    desc: "県北地方の農林業を担当する県の出先機関です。管内に伊達農業普及所・安達農業普及所があります。就農相談は、ふくのうから申し込むよう案内されています。",
    url: "https://www.pref.fukushima.lg.jp/sec/36210a/syuunousienn.html",
    label: "県北農林事務所のページへ",
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
    url: "https://www.fukushima-agri-guide.jp/#chiiki",
    label: "各市町村の情報を見る",
    color: "#B08020",
    bg: "#FBF5E0",
    border: "#D0B860",
  },
  any: {
    key: "any",
    name: "福島県農業経営・就農支援センター（まず相談してみる）",
    desc: "何を聞けばいいか分からない段階でも、県の就農サイト「ふくのう」から就農支援センターへの相談を申し込めます。",
    url: "https://start-fukuagri.jp/syuno/",
    label: "ふくのうから相談を申し込む",
    color: "#2D7A2D",
    bg: "#F0FBF0",
    border: "#B8E0B8",
  },
};
