import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

// TODO(Phase 2以降): ページごとのtitle/description/OGPはF-08で全ページ分を設定する。
// ここではサイト全体の既定値のみ設定。
export const metadata: Metadata = {
  metadataBase: new URL("https://fukushima-agri-guide.jp"),
  title: {
    default: "県北ふくしまAgri-Guide｜農家という生き方を、もっとリアルに。",
    template: "%s｜県北ふくしまAgri-Guide",
  },
  description:
    "農業に興味はあるけど踏み出せていない人向けに、福島県北地域への就農・移住のリアルな情報を届ける伴走型サービス。無料の就農シミュレーターで補助金や手順を自動算出します。",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
