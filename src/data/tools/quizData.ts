// Tool B：補助金クイズ
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool B：補助金クイズ」＋
// 「AgriGuide_プロジェクト追記版_2026年8月」B章の補助金額（就農シミュレーターと同じ数値を使用し、
// サイト内で情報の一貫性を保っている）

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "就農準備資金は、年間いくらまで・最長何年間受け取れる？",
    options: ["年間100万円×最長2年", "年間165万円×最長2年", "年間165万円×最長3年"],
    correctIndex: 1,
    explanation: "就農準備資金は年間165万円（令和8年度からの新規交付分。従来は年150万円）を最長2年間（上限330万円）受け取れます。ただし50代以上は対象外です。",
  },
  {
    id: "q2",
    question: "50代以上の人が就農準備資金を受け取れるか？",
    options: ["受け取れる", "受け取れない（対象外）", "60代のみ対象外"],
    correctIndex: 1,
    explanation: "就農準備資金は50代以上（S.age==='50p'）の方は対象外です。ただし経営開始資金は年代に関わらず対象になります。",
  },
  {
    id: "q3",
    question: "東京圏から福島県北へ移住する場合の「ふくしま移住支援金」、単身者の金額は？",
    options: ["30万円", "60万円", "100万円"],
    correctIndex: 1,
    explanation: "単身者は60万円、世帯（couple・kids）は100万円が加算されます。",
  },
  {
    id: "q4",
    question: "機械・施設の導入を支援する「地域計画早期実現支援枠」。国が出す補助の上限額は？",
    options: ["上限300万円", "上限450万円", "上限600万円"],
    correctIndex: 2,
    explanation: "国費の上限は600万円で、県の負担と合わせると補助は最大900万円です。49歳以下の認定新規就農者などが対象で、経営開始資金との併用はできません（農林水産省 令和8年度の資料）。",
  },
  {
    id: "q5",
    question: "自己資金が少ない場合に相談できる融資制度は？",
    options: ["日本政策金融公庫の農業融資", "地方銀行の住宅ローン", "クラウドファンディングのみ"],
    correctIndex: 0,
    explanation: "自己資金が300万円未満の場合、日本政策金融公庫の農業融資が選択肢になります。金額は個別審査です。",
  },
];
