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

export const simulatorCta = {
  href: "/simulator",
  label: "🌿 就農シミュレーターを試す",
};
