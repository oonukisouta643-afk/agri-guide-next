// 展開計画（事業ロードマップ）データ
// 出典：OLD版 index.html #585-592（#roadmap .rm-list）
//
// 注意：src/data/roadmap.ts（RoadmapPhase型）はシミュレーター結果画面で使う
// 「個人の就農ロードマップ」用データで、このファイルとは無関係。
// こちらはトップページ末尾に表示する「これからの予定」。
//
// 2026年11月1日：Phase 1〜3（AI就農診断、マッチング、B2G レポートなど）は今の方針と合わないため外し、
// 約束に読めない書き方に直した。カードに出さなくなった details も外した。

export type BusinessRoadmapKey = "now" | "next";

export type BusinessRoadmapPhase = {
  key: BusinessRoadmapKey;
  icon: string;
  period: string;
  title: string;
};

export const businessRoadmapPhases: BusinessRoadmapPhase[] = [
  {
    key: "now",
    icon: "🌱",
    period: "いま",
    title: "県北6市町村の情報とシミュレーターを公開しています",
  },
  {
    key: "next",
    icon: "📱",
    period: "これから",
    title: "現場の話を、了承をいただいた方から載せていきます",
  },
];
