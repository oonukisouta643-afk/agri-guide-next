// Q10 窓口斡旋の詳細仕様
// 出典：「AgriGuide_プロジェクト追記版_2026年8月」B章

import type { WindowKey } from "@/lib/simulator/types";

export type WindowReferral = {
  key: WindowKey;
  name: string;
  url: string;
};

export const windowReferrals: Record<WindowKey, WindowReferral> = {
  fukunou: {
    key: "fukunou",
    name: "ふくのう（農業経営・就農支援センター）",
    url: "https://start-fukuagri.jp/syuno/",
  },
  kenpo: {
    key: "kenpo",
    name: "県北地方総合相談窓口",
    url: "https://www.pref.fukushima.lg.jp/sec/36210a/",
  },
  iju: {
    key: "iju",
    name: "移住サポート総合窓口",
    url: "https://www.fukushima-iju.jp/index.html",
  },
  city: {
    key: "city",
    name: "各市町村窓口",
    url: "https://fukushima-agri-guide.jp/#chiiki",
  },
  any: {
    key: "any",
    name: "ふくのう（何でも相談OK）",
    url: "https://start-fukuagri.jp/syuno/",
  },
};
