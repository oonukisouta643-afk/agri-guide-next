// Tool D：農業適性チェック
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool D：農業適性チェック」
// 「5問・農業という生き方との相性スコア表示」という構成のみの指定で、設問内容の指定はなかったため
// Claudeが作成した想定コンテンツ。診断結果は目安であり、断定的な適性判定ではない旨をページ内に明記する。
//
// 旧サイト（agri-tools.html 98-109, 800-805行）の5段階リッカート尺度（1〜5点・進捗バー）を移植。
// 旧サイトの評価軸は5点満点の選択式で、各設問固有の文言ではなく
// 「あてはまらない／あてはまる」の共通ラベルのみを表示していたため、その挙動を踏襲する。

export type AptitudeQuestion = {
  id: string;
  question: string;
};

export const aptitudeQuestions: AptitudeQuestion[] = [
  {
    id: "a1",
    question: "天候によって予定が変わることについて、自然に合わせて動く方が好きだ",
  },
  {
    id: "a2",
    question: "毎日同じ時間に体を動かす生活を続ける体力・習慣がある",
  },
  {
    id: "a3",
    question: "収入が季節や年によって変動することにも耐性がある",
  },
  {
    id: "a4",
    question: "地域のコミュニティ・近所との関わりを大切にできる",
  },
  {
    id: "a5",
    question: "新しい技術や知識を学び続けることが苦にならない",
  },
];

export const APTITUDE_SCALE_MIN_LABEL = "あてはまらない";
export const APTITUDE_SCALE_MAX_LABEL = "あてはまる";
export const APTITUDE_SCALE_VALUES = [1, 2, 3, 4, 5] as const;

export function aptitudeResultText(totalScore: number, maxScore: number): { title: string; description: string } {
  const ratio = totalScore / maxScore;
  if (ratio >= 0.8) {
    return {
      title: "相性◎：農業という生き方に前向きです",
      description: "自然のリズムや変化を楽しめる素質がありそうです。まずは就農シミュレーターで具体的な条件を整理してみましょう。",
    };
  }
  if (ratio >= 0.5) {
    return {
      title: "相性○：向いている面と不安な面がありそうです",
      description: "農業カレンダーやコスト比較ツールで、不安な部分から解像度を上げてみるのがおすすめです。",
    };
  }
  return {
    title: "相性△：じっくり検討するのがよさそうです",
    description: "この診断はあくまで目安です。断念者の本音や農家プロフィールも読んで、リアルな声に触れてみてください。",
  };
}

/** 結果画面の大きなスコア数字の色分け（旧サイト 841-842行：70%以上=緑／50%以上=金／それ未満=赤） */
export function aptitudeScoreColorClass(pct: number): string {
  if (pct >= 70) return "text-green-700";
  if (pct >= 50) return "text-gold";
  return "text-red";
}
