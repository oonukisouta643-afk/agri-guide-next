import type { Metadata } from "next";

// /kata 以下：福島県59市町村の「型」の見本（要件定義書 docs/REQUIREMENTS_fukushima-kata_v0.2.md 第8章）。
// 一般公開するかは未決（大貫さんが決める）。それまでは noindex・サイトマップ外・サイト内からリンクしない。
// サイトマップ（src/app/sitemap.ts）は手で並べる作りなので、/kata は入らない。

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function KataLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-gray-900">
      <p className="mb-6 rounded border border-dashed border-gray-400 bg-gray-50 px-3 py-2 text-xs text-gray-700">
        見本（公開前の確認用）。福島県59市町村の就農データの「型」の動作確認のためのページです。
      </p>
      {children}
    </div>
  );
}
