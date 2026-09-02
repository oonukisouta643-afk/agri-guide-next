import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WarningBox } from "@/components/ui/WarningBox";
import { FarmerFilter } from "@/components/farmers/FarmerFilter";
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

      <Reveal delayMs={150}>
        <div className="mt-10">
          <FarmerFilter farmers={farmerProfiles} comingSoon={comingSoonProfiles} />
        </div>
      </Reveal>

      {/* 次のステップ：シミュレーターへのCTA */}
      <div className="mx-auto mt-10 max-w-5xl">
        <Reveal>
          <div className="rounded-lg bg-gradient-to-br from-green-700 to-green-900 px-6 py-8 text-center">
            <h3 className="font-serif text-lg font-bold text-white">
              農家のリアルを知ったら
              <br />
              シミュレーターで試してみる
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              年齢・家族構成・希望品目を入力するだけ。就農ロードマップと受け取れる補助金が3分でわかります。
            </p>
            <Button
              href="/simulator"
              className="mt-4 !bg-white !text-green-800 hover:!bg-green-50"
            >
              🌿 シミュレーターを試す（無料）
            </Button>
          </div>
        </Reveal>
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
        <Reveal delayMs={150}>
          <WarningBox type="warn" className="mt-4">
            ⚠️ 仮データです。実際のスケジュールは農家さん・品目・時期によって大きく異なります。農家ヒアリング完了後に更新します。
          </WarningBox>
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
            <WarningBox type="tip" className="mt-4 text-left">
              <strong>最小限の情報だけでOK</strong>
              <br />
              お名前（ニックネーム可）・品目・就農年数・一言メッセージ（50字程度）
            </WarningBox>
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
