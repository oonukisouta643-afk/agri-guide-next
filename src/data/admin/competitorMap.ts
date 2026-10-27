// タブ⑤：競合ポジション（調べた範囲で直接重なるサービスが見当たらない立ち位置）
// 2026年10月26日：見出しと Agri-Guide の特徴の言い過ぎを弱めた（docs/INSTRUCTIONS_admin-overview.md「5.」）。
// 出典：「AgriGuide_プロジェクト完全記録」8章「競合分析・ポジショニング」より転記（実データ）。

export const competitorHeadline =
  "調べた範囲では、「地域特化×就農前の潜在層」を主な対象にしたサービスは見当たりませんでした。";

export const competitors = [
  {
    service: "Agri-Guide",
    target: "潜在層（漠然と興味）",
    relation: "本体",
    feature: "地域特化×解像度向上",
    isSelf: true,
  },
  {
    service: "ふくのう",
    target: "就農検討者",
    relation: "送客先・補完",
    feature: "福島県公式。就農相談・研修紹介",
    isSelf: false,
  },
  {
    service: "スマウト",
    target: "移住検討者全般",
    relation: "参考競合",
    feature: "移住全般プラットフォーム。農業は一部のみ",
    isSelf: false,
  },
  {
    service: "農水省ポータル",
    target: "就農検討者",
    relation: "情報源",
    feature: "全国×情報提供のみ。地域比較しにくい",
    isSelf: false,
  },
  {
    service: "マイナビ農業",
    target: "農業就職希望者",
    relation: "非競合",
    feature: "全国×求人マッチング特化",
    isSelf: false,
  },
  {
    service: "就農フェア",
    target: "来場者（来る気あり）",
    relation: "After連携先",
    feature: "Agri-GuideがBefore、フェアがAfterの関係",
    isSelf: false,
  },
];
