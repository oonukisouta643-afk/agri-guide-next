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
    area: "断念者の声・農家プロフィール・似た条件の人（2026年10月28日に外した）",
    detail: "作った人物・声だったため外し、/farmers は農家さんの声を集めるページにした。本物の声は掲載の了承をいただいた方から載せる",
    file: "src/app/farmers/page.tsx",
    needsFrom: "FORM 01・FORM 02の回答、農家さんへの聞き取り（掲載の了承）",
  },
  {
    area: "コスト比較ツール（2026年10月28日に外した）",
    detail: "出典の弱い生活費と作った人物だったため、ツールごと外した",
    file: "（削除済み）",
    needsFrom: "生活費の出典を確かめられたら作り直しを検討",
  },
  {
    area: "品目別収益モデル（2026年10月28日に作り直し）",
    detail: "もも・なし・りんごの60a・10年の農業所得。収量は福島県果樹農業振興計画、単価・経営費は長野県の指標で仮置き",
    file: "src/data/tools/profitData.ts",
    needsFrom: "福島県の果樹の経営指標（県の担当課への質問）",
  },
  {
    area: "農業カレンダー（2026年10月28日に作り直し）",
    detail: "果樹4品目の月ごとの忙しさと収穫時期。他県の資料を福島の時期に合わせた推定を含む",
    file: "src/data/tools/calendarData.ts",
    needsFrom: "農家さんへの聞き取りでの確認",
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
    detail: "6地域すべて暫定的に県北農林事務所のページにリンク",
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
