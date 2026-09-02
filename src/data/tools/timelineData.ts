// Tool E：就農タイムライン
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool E：就農タイムライン」
// 「4フェーズ選択（情報収集中/本気で考え始めた/研修・準備中/就農直前〜直後）→現在地強調表示」

export type TimelinePhase = {
  key: "info" | "serious" | "training" | "final";
  label: string;
  description: string;
  suggestion: string;
  link: { text: string; href: string };
};

export const timelinePhases: TimelinePhase[] = [
  {
    key: "info",
    label: "情報収集中",
    description: "農業という選択肢について、なんとなく興味を持ち始めた段階。",
    suggestion: "農業カレンダーやコスト比較ツールで、まずは全体像をつかみましょう。",
    link: { text: "農業カレンダーを見る", href: "/tools#calendar" },
  },
  {
    key: "serious",
    label: "本気で考え始めた",
    description: "就農を具体的な選択肢として検討し始めた段階。",
    suggestion: "就農シミュレーターで、自分の条件に合った補助金・地域を確認してみましょう。",
    link: { text: "就農シミュレーターを試す", href: "/simulator" },
  },
  {
    key: "training",
    label: "研修・準備中",
    description: "研修に参加したり、資金計画を立て始めている段階。",
    suggestion: "農家プロフィールで、似た条件で就農した人の実例を参考にしましょう。",
    link: { text: "農家プロフィールを見る", href: "/farmers" },
  },
  {
    key: "final",
    label: "就農直前〜直後",
    description: "農地の目処が立ち、いよいよ就農が近づいている段階。",
    suggestion: "ふくのうや農業委員会への相談で、手続きを具体的に進めましょう。",
    link: { text: "ふくのうに相談する", href: "https://start-fukuagri.jp/syuno/" },
  },
];
