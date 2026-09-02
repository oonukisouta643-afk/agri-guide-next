// 展開計画（事業ロードマップ）データ
// 出典：OLD版 index.html #585-592（#roadmap .rm-list）
//
// 注意：src/data/roadmap.ts（RoadmapPhase型）はシミュレーター結果画面で使う
// 「個人の就農ロードマップ」用データで、このファイルとは無関係。
// こちらはトップページ末尾に表示する「事業としての展開計画（2026〜2027年）」。

export type BusinessRoadmapKey = "now" | "next" | "future";

export type BusinessRoadmapPhase = {
  key: BusinessRoadmapKey;
  icon: string;
  period: string;
  title: string;
  details: string[];
};

export const businessRoadmapPhases: BusinessRoadmapPhase[] = [
  {
    key: "now",
    icon: "🌱",
    period: "現在（2026年5月〜）",
    title: "Phase 1：コンテンツ構築・伴走基盤づくり",
    details: [
      "アンケート5種・インタビュー5件以上を実施",
      "「移住者が書いた伊達市農業メモ」の発信開始",
      "就農シミュレーター β版 公開中",
      "行政連携・需給ギャップレポート無償提供（9月）",
      "地域計画早期実現支援枠（600万円）申請準備",
    ],
  },
  {
    key: "next",
    icon: "📱",
    period: "2026年10月〜",
    title: "Phase 2：MVP開発・βテスト",
    details: [
      "AI就農診断（福島県北地域の実数値データを活用）",
      "品目別コスト・収支データベース公開",
      "βテスターによる先行体験・フィードバック収集",
    ],
  },
  {
    key: "future",
    icon: "🚀",
    period: "2027年〜",
    title: "Phase 3：正式ローンチ・マッチング展開",
    details: [
      "農家×就農希望者マッチング機能追加",
      "行政・JA向けデータ分析レポート（B2G）開始",
      "就農後コミュニティ・定着支援サービス",
    ],
  },
];
