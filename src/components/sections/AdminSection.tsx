"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";

// AdminSection：行政・連携機関向けの価値訴求セクション（SimCtaの直後）
// 出典：OLD版 index.html #351-359（#admin section-dark）
// ダーク背景の専用テーマのため、共通のSectionHeaderコンポーネントは使わず
// 同等の見出し構造（eye/h2/lead）をこのファイル内で再現している。
// "use client"：詳細資料リンククリックのGA4イベント送信（trackEvent）のため。

const valueCards = [
  {
    icon: "📈",
    title: "ふくのうへの送客",
    description:
      "「まだ漠然と農業に興味がある段階」の人にAgri-Guideが最初に接触し、就農への関心が高まった段階でふくのうへつなぎます。ふくのうの競合ではなく、ふくのうに来る前の層を届ける入口です。",
  },
  {
    icon: "🏡",
    title: "定着率の高い移住者を増やす",
    description:
      "農業・地域への解像度を上げた上で移住した人は定着率が高くなります。「来たが数年で離農・転出」という問題の根本にある「情報格差」をAgri-Guideが事前に埋めます。",
  },
  {
    icon: "📊",
    title: "一次データの無償提供",
    description:
      "「就農希望者が福島県北を選ばない理由」と「農家・行政側の認識」のギャップを調査データとして無償提供します。行政の施策立案の根拠データとして活用いただけます（2026年9月予定）。",
  },
];

export function AdminSection() {
  return (
    <section id="admin" className="bg-green-900 px-5 py-14 text-white sm:px-10 sm:py-[72px]">
      <Reveal>
        <div className="mx-auto max-w-content text-center">
          <p className="font-mono text-xs font-bold lowercase tracking-widest text-green-200">
            行政・連携機関の皆さまへ
          </p>
          <h2 className="mt-2 text-white">
            Agri-Guideは<span className="font-bold text-green-200">ふくのうへの送客装置</span>です
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            ※「ふくのう」＝福島県農業経営・就農支援センターの愛称（県公式の就農相談窓口）。農業に漠然と興味があるけどまだ一歩踏み出せていない層に先にアプローチし、就農への意欲が高まった段階でふくのう・農業委員会へつなぎます。民間ならではのスピードで「関心層の掘り起こし」を担います。
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {valueCards.map((card, i) => (
          <Reveal key={card.title} delayMs={i * 100}>
            <div className="h-full rounded-lg border border-white/15 bg-white/5 p-5">
              <p className="text-2xl" aria-hidden="true">
                {card.icon}
              </p>
              <p className="mt-2 font-bold text-white">{card.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{card.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={150}>
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            onClick={() =>
              trackEvent("admin_doc_click", { source: "homepage_admin_section" })
            }
            className="inline-block rounded-full border border-green-200/40 px-6 py-2.5 text-sm font-bold text-green-200 transition-colors hover:bg-white/10"
          >
            行政向け詳細資料を見る →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
