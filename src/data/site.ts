// サイト共通のナビゲーション・連絡先データ
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4（共通コンポーネント仕様）

export const siteConfig = {
  name: "Agri-Guide",
  fullName: "県北ふくしまAgri-Guide",
  url: "https://fukushima-agri-guide.jp",
  contactEmail: "oonukisouta643@gmail.com",
};

export const navLinks = [
  { href: "/#story", label: "このサービスとは" },
  { href: "/tools", label: "ツール集" },
  { href: "/farmers", label: "農家プロフィール" },
  { href: "/#chiiki", label: "地域施策" },
];

// モバイルドロワー用の目次（ToC）。navLinksより網羅的で、グループ分けして表示する。
// 2026年8月21日追加：「スマホだとページ内のどこに何があるかわからない」というフィードバックを受け、
// ハンバーガーメニューを実質的なサイトマップとして機能させるために新設。
export const mobileToc: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "このページについて",
    links: [
      { href: "/#story", label: "このサービスとは" },
      { href: "/#how", label: "使い方" },
      { href: "/#field", label: "アンケートに答える" },
      { href: "/#chiiki", label: "地域の支援策" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
  {
    heading: "ツール・診断",
    links: [
      { href: "/simulator", label: "🌿 就農シミュレーター" },
      { href: "/tools", label: "ツール集" },
    ],
  },
  {
    heading: "情報を見る",
    links: [
      { href: "/farmers", label: "農家プロフィール" },
      { href: "/subsidies", label: "補助金一覧" },
    ],
  },
  {
    heading: "行政・連携機関の方へ",
    links: [{ href: "/admin", label: "行政向け資料" }],
  },
];

export const simulatorCta = {
  href: "/simulator",
  label: "🌿 就農シミュレーターを試す",
};
