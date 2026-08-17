// プロジェクトダッシュボード：将来のタスク（機能拡張計画）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §7「Next.js移行で追加する機能（F-36〜F-40）」＋
// 「AgriGuide_プロジェクト完全記録」11章のタイムラインより。
// F-30/F-36（URLシェア機能）はPhase 3で実装済みのため、完了済みとして記載。
// F-23（地域マッチング）も、要件定義書の想定では2027年以降の機能とされていたが、
// Next.js移行のPhase 3で前倒しして実装済み。

export type FutureTask = {
  id: string;
  title: string;
  description: string;
  status: "done" | "planned";
  timing: string;
};

export const futureTasks: FutureTask[] = [
  {
    id: "F-30",
    title: "シミュレーター結果のURLシェア機能",
    description: "URLパラメータに回答データを含めて結果を直接表示・共有できる機能。",
    status: "done",
    timing: "Phase 3で実装済み（2026年8月）",
  },
  {
    id: "region-match",
    title: "シミュレーション経由の地域マッチング",
    description: "回答から条件に合う地域へマッチングする機能。当初は2027年以降を想定していたが前倒しで実装。",
    status: "done",
    timing: "Phase 3で実装済み（2026年8月）",
  },
  {
    id: "F-37",
    title: "お気に入り地域の比較機能（/regions/compare）",
    description: "シミュレーター結果で気になった地域を複数選択して施策・品目・支援内容を横並び比較できるページ。",
    status: "planned",
    timing: "Phase 4〜5",
  },
  {
    id: "F-38",
    title: "就農チェックリスト",
    description: "お試し就農体験申し込み・ふくのう相談予約・農業委員会問い合わせ等をチェックできる機能。localStorageで保存。",
    status: "planned",
    timing: "Phase 4〜5",
  },
  {
    id: "F-39",
    title: "農家プロフィールのフィルタリング",
    description: "就農前職業・年代・家族構成・品目で絞り込み検索。農家データが10件以上集まり次第実装。",
    status: "planned",
    timing: "8月ヒアリング後",
  },
  {
    id: "F-40",
    title: "地域別施策の横断比較表（/regions/compare）",
    description: "6地域の補助金・研修・農地賃借料・主要品目を一覧で比較できるテーブル。",
    status: "planned",
    timing: "馬場さん情報待ち",
  },
  {
    id: "line-official",
    title: "LINE公式アカウント開設",
    description: "アンケート回答者・興味を持った人とのコミュニケーション接点として。",
    status: "planned",
    timing: "未定",
  },
  {
    id: "ai-chat",
    title: "チャットAIをAnthropic APIに差し替え",
    description: "旧HTML版の`getAIReply`関数をAnthropic API連携に置き換える計画。",
    status: "planned",
    timing: "2026年10月目処",
  },
];
