import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { FarmerCard } from "@/components/farmers/FarmerCard";
import { DayTimeline } from "@/components/farmers/DayTimeline";
import { farmerProfiles, comingSoonProfiles, peachFarmerDay } from "@/data/farmers";
import { surveyForms } from "@/data/forms";

// / farmers　農家プロフィール
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2

export const metadata: Metadata = {
  title: "農家プロフィール",
  description:
    "福島県北地域で実際に就農した方々のプロフィール。就農前の職業・自己資金・農業歴を包み隠さず紹介します。",
};

const form01 = surveyForms.find((f) => f.id === "FORM 01");

export default function FarmersPage() {
  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          eye="farmers"
          title="農家プロフィール"
          lead="「自分みたいな人間でもできるのか」——就農前の職業・自己資金・農業歴を包み隠さず紹介します。"
        />
      </Reveal>

      <Reveal delayMs={100}>
        <div className="mx-auto mt-6 max-w-content text-center">
          <ExternalLink
            href="https://start-fukuagri.jp/modelcase/"
            className="text-sm font-bold text-green-700 hover:underline"
          >
            ふくのうの就農ロールモデルページも見る →
          </ExternalLink>
          <p className="mt-2 text-xs text-muted">
            ※以下のプロフィールは仮データです。農家ヒアリング完了次第、実データへ更新します。
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {farmerProfiles.map((farmer, i) => (
          <Reveal key={farmer.id} delayMs={(i % 4) * 75}>
            <FarmerCard farmer={farmer} />
          </Reveal>
        ))}
      </div>

      {/* coming-card */}
      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {comingSoonProfiles.map((c) => (
          <Reveal key={c.id}>
            <div className="flex h-full flex-col items-center justify-center rounded border border-dashed border-green-200 bg-green-50/50 p-6 text-center">
              <p className="font-bold text-ink">{c.category}</p>
              <p className="mt-2 text-xs text-muted">{c.beforeJob}</p>
              <p className="mt-1 text-xs text-muted">準備中</p>
              <p className="mt-2 text-xs text-muted">{c.note}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 農家の1日 */}
      <div className="mx-auto mt-14 max-w-content">
        <Reveal>
          <SectionHeader eye="a day in the life" title="農家の1日" lead="桃農家・繁忙期のスケジュール例" />
        </Reveal>
        <Reveal delayMs={100}>
          <Card className="mt-8">
            <DayTimeline schedule={peachFarmerDay} />
          </Card>
        </Reveal>
      </div>

      {/* 農家募集フォーム */}
      <div className="mx-auto mt-14 max-w-content">
        <Reveal>
          <Card className="text-center">
            <h3 className="font-bold text-ink">農家さんへ：プロフィール掲載のお願い</h3>
            <p className="mt-2 text-sm text-muted">
              就農・移住を考えている方に向けて、あなたの経験を聞かせてください。
            </p>
            {form01 && (
              <ExternalLink
                href={form01.url}
                className="mt-4 inline-block rounded bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-600"
              >
                FORM 01に回答する →
              </ExternalLink>
            )}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
