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
  metadataBase: new URL("https://fukushima-agri-guide.jp"),
  title: {
    default: "県北ふくしまAgri-Guide｜農家という生き方を、もっとリアルに。",
    template: "%s｜県北ふくしまAgri-Guide",
  },
  description:
    "農業に興味はあるけど踏み出せていない人向けに、福島県北地域への就農・移住のリアルな情報を届ける伴走型サービス。無料の就農シミュレーターで補助金や手順を自動算出します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.fullName,
    title: "県北ふくしまAgri-Guide｜農家という生き方を、もっとリアルに。",
    description:
      "農業に興味はあるけど踏み出せていない人向けに、福島県北地域への就農・移住のリアルな情報を届ける伴走型サービス。",
  },
  twitter: {
    card: "summary_large_image",
    title: "県北ふくしまAgri-Guide｜農家という生き方を、もっとリアルに。",
    description: "無料の就農シミュレーターで補助金や手順を自動算出します。",
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
    "福島県北地域への就農・移住を検討している人向けに、就農シミュレーターや農業ツール集を提供する伴走型サービス。",
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
