// フィールド調査アンケートの設問サンプル（Fieldセクションのアコーディオンで使用）
// 出典：OLD版 index.html #380-412（.ac-form）
//
// URL・問数・対象者の要約は既存のsrc/data/forms.ts（surveyForms）にあるため、
// ここでは重複させず「formId（surveyFormsのidと対応）」で紐付ける。
// このファイルが持つのは、アコーディオンを開いたときに見せる実際の設問文とタグのみ。

export type FieldQuestionTag = "最重要" | "新設" | "v3新設" | "修正";

export type FieldQuestion = {
  qn: string;
  text: string;
  tag?: FieldQuestionTag;
};

export type FieldFormQuestions = {
  /** src/data/forms.ts の SurveyForm.id と対応 */
  formId: string;
  icon: string;
  label: string;
  questions: FieldQuestion[];
};

export const fieldFormQuestions: FieldFormQuestions[] = [
  {
    formId: "FORM 01",
    icon: "🌾",
    label: "農業経験者・就農者向け（12問）",
    questions: [
      { qn: "Q1", text: "現在の農業経営の状況を教えてください" },
      { qn: "Q2", text: "後継者は見つかっていますか？", tag: "最重要" },
      { qn: "Q4", text: "就農希望者を受け入れる意向はありますか？（研修・農地貸出等）" },
    ],
  },
  {
    formId: "FORM 02",
    icon: "🔴",
    label: "就農を断念した方向け（11問）",
    questions: [
      { qn: "Q2", text: "踏み出せなかった一番大きな理由は？（複数選択可）", tag: "最重要" },
      {
        qn: "Q2.5",
        text: "「農家として生きる」イメージは今どのくらいできていましたか？（1〜5段階）",
        tag: "v3新設",
      },
      { qn: "Q9", text: "農業の解像度を上げる伴走型サービスがあったら使いたかったですか？", tag: "修正" },
    ],
  },
  {
    formId: "FORM 03",
    icon: "🟡",
    label: "農業関係者向け 優位性調査（9問）",
    questions: [
      { qn: "Q3", text: "福島県北地域の農業の一番の強みは何だと思いますか？" },
      { qn: "Q8", text: "都市部の就農希望者が福島県北地域を選ばない理由は何だと思いますか？", tag: "最重要" },
    ],
  },
  {
    formId: "FORM 04",
    icon: "🔵",
    label: "就農検討中の方向け（12問）",
    questions: [
      {
        qn: "Q3",
        text: "「農家として生きる」イメージは今どのくらいできていますか？（1〜5段階）",
        tag: "新設",
      },
      { qn: "Q8", text: "農業について「欲しいのに手に入らない情報」はありますか？（自由記述）", tag: "最重要" },
      { qn: "Q10", text: "農業という生き方の解像度を上げてくれる無料サービスを使ってみたいですか？" },
    ],
  },
  {
    formId: "FORM 05",
    icon: "🟣",
    label: "就農地域の選び方 調査（10問）",
    questions: [
      { qn: "Q7", text: "就農候補地として福島県北地域を検討したことはありますか？" },
      { qn: "Q11", text: "福島県北地域を就農・移住候補から外す理由があるとしたら何ですか？", tag: "最重要" },
    ],
  },
];
