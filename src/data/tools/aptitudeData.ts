// Tool D：農業適性チェック
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool D：農業適性チェック」
// 「5問・農業という生き方との相性スコア表示」という構成のみの指定で、設問内容の指定はなかったため
// Claudeが作成した想定コンテンツ。診断結果は目安であり、断定的な適性判定ではない旨をページ内に明記する。

export type AptitudeQuestion = {
  id: string;
  question: string;
  options: { label: string; score: number }[];
};

export const aptitudeQuestions: AptitudeQuestion[] = [
  {
    id: "a1",
    question: "天候によって予定が変わることについて",
    options: [
      { label: "むしろ自然に合わせるのが好き", score: 3 },
      { label: "慣れれば大丈夫だと思う", score: 2 },
      { label: "できれば予定通り進めたい", score: 1 },
    ],
  },
  {
    id: "a2",
    question: "毎日同じ時間に体を動かす生活について",
    options: [
      { label: "体力には自信がある", score: 3 },
      { label: "普通だと思う", score: 2 },
      { label: "あまり体力に自信がない", score: 1 },
    ],
  },
  {
    id: "a3",
    question: "収入が季節や年によって変動することについて",
    options: [
      { label: "ある程度は許容できる", score: 3 },
      { label: "工夫すれば対応できると思う", score: 2 },
      { label: "安定した収入が欲しい", score: 1 },
    ],
  },
  {
    id: "a4",
    question: "地域のコミュニティに参加することについて",
    options: [
      { label: "積極的に関わりたい", score: 3 },
      { label: "必要な範囲で関わりたい", score: 2 },
      { label: "あまり得意ではない", score: 1 },
    ],
  },
  {
    id: "a5",
    question: "新しい技術や知識を学び続けることについて",
    options: [
      { label: "学ぶこと自体が好き", score: 3 },
      { label: "必要なら学ぶ", score: 2 },
      { label: "できれば新しく覚えたくない", score: 1 },
    ],
  },
];

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
