// プロジェクトダッシュボード：仮データ差し替えリスト
// Next.js移行（Phase 2〜5）で実装した箇所のうち、要件定義書に具体的な数値・文言の
// 指定がなく、Claudeが仮データ・仮コンテンツとして作成した箇所の一覧。
// 詳細な経緯は各Phaseのプロジェクトドキュメント（claude/2026-08-17_Nextjs移行Phase2〜5完了.md）を参照。

export type PlaceholderItem = {
  area: string;
  detail: string;
  file: string;
  needsFrom: string;
};

export const placeholderItems: PlaceholderItem[] = [
  {
    area: "断念者の声（トップページ3件・ツール集6件）",
    detail: "就農を断念した人の声・属性",
    file: "src/components/sections/Story.tsx, src/data/tools/voicesData.ts",
    needsFrom: "FORM 02の回答",
  },
  {
    area: "農家プロフィール4件",
    detail: "就農前職業・自己資金・農業収入・農地規模・研修期間・コメント",
    file: "src/data/farmers.ts",
    needsFrom: "FORM 01の回答・農家ヒアリング",
  },
  {
    area: "シミュレーター結果⑥「似た条件の人カード」4パターン",
    detail: "農家プロフィールと同じ4名を仮採用。マッチングロジックも独自設計",
    file: "src/data/similarCases.ts",
    needsFrom: "FORM 01の回答・農家ヒアリング",
  },
  {
    area: "コスト比較ツールの金額データ",
    detail: "東京vs福島県北の家賃・食費等（3ペルソナ）",
    file: "src/data/tools/costComparisonData.ts",
    needsFrom: "実際の生活コスト相場調査",
  },
  {
    area: "品目別収益モデルの金額データ",
    detail: "5品目の初期費用・年別収入・黒字化年数",
    file: "src/data/tools/profitData.ts",
    needsFrom: "農家ヒアリング・JA等の統計",
  },
  {
    area: "農業カレンダーの月別作業内容",
    detail: "6品目の産地・年間作業スケジュール・安定化のヒント",
    file: "src/data/tools/calendarData.ts",
    needsFrom: "農業普及所・農家ヒアリングでの確認",
  },
  {
    area: "地域マッチングの加点基準（未実装）",
    detail: "「自己資金が地域の想定範囲内」「就農時期が地域の研修サイクルと合う」の2条件は基準値不明のため未実装",
    file: "src/lib/simulator/calculations.ts（calcRegionMatch）",
    needsFrom: "各地域の資金レンジ・研修サイクルの具体的な基準値",
  },
  {
    area: "地域データの品目コード不整合",
    detail: "要件定義書の地域別対応品目に、Q4選択肢にないコード（oran/kaki/veg）が含まれていた。無効コードとして除外済み",
    file: "src/data/regions.ts",
    needsFrom: "正しい品目コードの確認",
  },
  {
    area: "就農ロードマップの4フェーズ文言",
    detail: "フェーズ構成のみ指定があり、具体的な文言はClaudeが作成",
    file: "src/data/roadmap.ts",
    needsFrom: "内容の妥当性レビュー",
  },
  {
    area: "地域カードの「詳細を確認する」リンク先",
    detail: "6地域すべて暫定的に県北地方総合相談窓口の共通ページにリンク",
    file: "src/data/regions.ts",
    needsFrom: "地域別の個別ページURL",
  },
  {
    area: "農業適性チェックの設問内容",
    detail: "5問の構成のみ指定があり、具体的な設問はClaudeが作成",
    file: "src/data/tools/aptitudeData.ts",
    needsFrom: "内容の妥当性レビュー",
  },
  {
    area: "行政向け提案書：移住定着率データ",
    detail: "行政KPIへの貢献を示す具体的な定着率データが未掲載（数値未提示のまま）",
    file: "src/data/admin/immigrationImpact.ts",
    needsFrom: "行政側の統計データ",
  },
  {
    area: "行政向け提案書：行政連携シナリオ・想定Q&A",
    detail: "3ステップのシナリオ・送客案/QR配布案・想定問答はClaudeが構成した案。行政への提示前に内容確認が必要",
    file: "src/data/admin/collaborationScenario.ts",
    needsFrom: "内容の妥当性レビュー（行政への提示前に必須）",
  },
];
