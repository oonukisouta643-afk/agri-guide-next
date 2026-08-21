"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";

// AdminSection：行政・連携機関向けの価値訴求セクション（SimCtaの直後）
// 出典：OLD版 index.html #351-359（#admin section-dark）
// ダーク背景の専用テーマのため、共通のSectionHeaderコンポーネントは使わず
// 同等の見出し構造（eye/h2/lead）をこのファイル内で再現している。
// "use client"：詳細資料リンククリックのGA4イベント送信（trackEvent）のため。
//
// 2026年8月21日：「モバイルだとページが長い・行政向け内容が一般ユーザーの導線に
// フルで入ってて冗長」というフィードバックを受け、3枚のカード＋長文説明を
// 1〜2文の要約＋詳細資料へのリンクに圧縮。詳細は/adminページ側に残っているので
// 情報は失われていない（ホームページの表示だけを短縮）。

export function AdminSection() {
  return (
    <section id="admin" className="bg-green-900 px-5 py-10 text-white sm:px-10 sm:py-12">
      <Reveal>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <p className="font-mono text-xs font-bold lowercase tracking-widest text-green-200">
              行政・連携機関の皆さまへ
            </p>
            <h2 className="mt-2 text-xl text-white sm:text-2xl">
              Agri-Guideは<span className="font-bold text-green-200">ふくのうへの送客装置</span>です
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              関心層の掘り起こしから一次データの無償提供まで、行政・ふくのうと役割分担しながら支援します。
            </p>
          </div>
          <Link
            href="/admin"
            onClick={() =>
              trackEvent("admin_doc_click", { source: "homepage_admin_section" })
            }
            className="inline-block shrink-0 rounded-full border border-green-200/40 px-6 py-2.5 text-sm font-bold text-green-200 transition-colors hover:bg-white/10"
          >
            行政向け詳細資料を見る →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
