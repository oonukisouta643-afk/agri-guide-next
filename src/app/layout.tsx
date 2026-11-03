import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { siteConfig } from "@/data/site";

// フォント出典：AgriGuide_Next移行_要件定義書v2.0 §3（タイポグラフィ）
// 見出し：Noto Serif JP bold / 本文：Noto Sans JP regular / 数値・コード：JetBrains Mono
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// F-08：全ページmeta・OGP・description設定（サイト全体の既定値。各ページは個別にexport const metadataで上書き）
export const metadata: Metadata = {
  metadataBase: new URL("https://www.fukushima-agri-guide.jp"),
  title: {
    default: "福島県北の就農・移住を、もっとリアルに｜県北ふくしまAgri-Guide",
    template: "%s｜県北ふくしまAgri-Guide",
  },
  description:
    "県北6市町村（伊達市・桑折町・国見町・二本松市・大玉村・本宮市）で就農・移住を考える人向けに、補助金・支援制度の一覧、果樹の収益の試算、就農シミュレーター、地域とのつながりがない方の相談をまとめています。個人が運営する非公式のサイトです。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.fullName,
    // title・description は書かない（各ページの title・description がそのまま使われる。2026年11月3日）
  },
  twitter: {
    card: "summary_large_image",
  },
};

// JSON-LD構造化データ（F-08）：検索結果でのサイト表示・エンティティ理解を助ける
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.fullName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/favicon.ico`,
  email: siteConfig.contactEmail,
  description:
    "県北6市町村で就農・移住を考える人向けに、補助金・支援制度の一覧、果樹の収益の試算、就農シミュレーター、相談をまとめた情報サイト。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerifJP.variable} ${notoSansJP.variable} ${jetbrainsMono.variable} antialiased flex min-h-screen flex-col`}
      >
        {/* js-reveal：JavaScriptが無効な環境では常時表示にフォールバックする（F-06のグレースフルデグラデーション） */}
        <noscript>
          <style>{`.js-reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
