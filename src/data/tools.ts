// 農業ツール集（7ツール）メタ情報
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ tools 農業ツール集」・§5 Section 5
// 各ツール本体はPhase 4（/toolsページ）で実装。トップページでは一覧カードのみ表示し、
// クリックで/tools（該当タブ）へ遷移する。

export type Tool = {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  /** trueの場合、2カラムグリッドで全幅（品目別収益モデルのみ） */
  wide?: boolean;
};

export const tools: Tool[] = [
  {
    id: "calendar",
    icon: "📅",
    title: "農業カレンダー",
    description: "品目から住む場所を考える。産地確認からカレンダー表示まで4ステップ。",
    href: "/tools#calendar",
  },
  {
    id: "quiz",
    icon: "🎓",
    title: "補助金クイズ",
    description: "5問のクイズ形式で、就農支援の補助金制度を楽しく学べる。",
    href: "/tools#quiz",
  },
  {
    id: "cost",
    icon: "🏙️",
    title: "コスト比較",
    description: "東京 vs 福島県北の生活コストを、ペルソナ別・カテゴリ別に比較。",
    href: "/tools#cost",
  },
  {
    id: "aptitude",
    icon: "🌱",
    title: "農業適性チェック",
    description: "5問の質問で、農業という生き方との相性をスコア表示。",
    href: "/tools#aptitude",
  },
  {
    id: "timeline",
    icon: "🕒",
    title: "就農タイムライン",
    description: "情報収集中〜就農直前まで、自分の今のフェーズを確認できる。",
    href: "/tools#timeline",
  },
  {
    id: "voices",
    icon: "💬",
    title: "断念者の本音",
    description: "就農を諦めた人たちの声6件。情報格差など理由別に整理。",
    href: "/tools#voices",
  },
  {
    id: "profit",
    icon: "💰",
    title: "品目別収益モデル",
    description: "桃・りんご・きゅうり・米・梨の5品目の年別収益シミュレーション。初期費用・黒字化年数つき。",
    href: "/tools#profit",
    wide: true,
  },
];
