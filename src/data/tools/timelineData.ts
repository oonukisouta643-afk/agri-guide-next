// Tool E：就農タイムライン
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool E：就農タイムライン」
// 旧サイト（netlify-0816/agri-tools.html 883-933行）の5フェーズ・月数ラベル・
// フェーズ毎3項目チェックリストを移植（NEWは4フェーズに簡略化されていた）。
// リンク先はNext.js移行後のページ構成に合わせてClaudeが割り当てたもの。

export type TimelinePhase = {
  key: "info" | "plan" | "training" | "certify" | "start";
  label: string;
  /** 就農までの目安時期（旧サイトmonthsフィールド） */
  months: string;
  icon: string;
  /** タイムライン上のドット色（Tailwindクラス） */
  dotColorClass: string;
  /** フェーズごとのやるべきことチェックリスト（旧サイトitemsフィールド、各3件） */
  checklist: string[];
  /** 「現在地バナー」に表示する次のアクション（旧サイトmsgsと同じ文言） */
  nextAction: string;
  link?: { text: string; href: string };
};

export const timelinePhases: TimelinePhase[] = [
  {
    key: "info",
    label: "情報収集フェーズ",
    months: "〜6ヶ月前",
    icon: "📱",
    dotColorClass: "bg-green-300",
    checklist: [
      "就農シミュレーターで補助金・初期費用を試算",
      "農業カレンダーで1年の生活イメージをつかむ",
      "ふくのうのお試し就農体験に申し込む",
    ],
    nextAction: "お試し就農体験の申し込み",
    link: { text: "農業カレンダーを見る", href: "/tools#calendar" },
  },
  {
    key: "plan",
    label: "相談・計画フェーズ",
    months: "6〜12ヶ月前",
    icon: "📋",
    dotColorClass: "bg-green-400",
    checklist: [
      "ふくのうに就農相談の予約を入れる",
      "農業委員会に農地情報を問い合わせる",
      "農業経営改善計画の骨子を作る",
    ],
    nextAction: "ふくのうへの就農相談予約",
    link: { text: "就農シミュレーターを試す", href: "/simulator" },
  },
  {
    key: "training",
    label: "研修・準備フェーズ",
    months: "就農1〜2年前",
    icon: "📚",
    dotColorClass: "bg-green-500",
    checklist: [
      "農業研修機関に登録（就農準備資金 年150万円スタート）",
      "農地バンク経由で農地情報を収集",
      "日本政策金融公庫に農業融資の相談",
    ],
    nextAction: "認定新規就農者の申請準備",
    link: { text: "農家プロフィールを見る", href: "/farmers" },
  },
  {
    key: "certify",
    label: "認定・移住フェーズ",
    months: "就農6ヶ月前",
    icon: "📝",
    dotColorClass: "bg-green-600",
    checklist: [
      "認定新規就農者の申請（農業委員会）",
      "ふくしま移住支援金の要件確認（転入前に必須）",
      "農機・施設の発注・準備",
    ],
    nextAction: "ふくしま移住支援金の申請・農機/施設の準備",
    link: { text: "ふくのうに相談する", href: "https://start-fukuagri.jp/syuno/" },
  },
  {
    key: "start",
    label: "就農スタート",
    months: "就農後",
    icon: "🌱",
    dotColorClass: "bg-green-700",
    checklist: [
      "経営開始資金の申請（年150万円×最長3年）",
      "青色申告の開始（税務署に申請）",
      "ふくのう・農業委員会との定期相談を継続",
    ],
    nextAction: "経営開始資金の申請",
  },
];
