import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WarningBox } from "@/components/ui/WarningBox";
import { DayTimeline } from "@/components/farmers/DayTimeline";
import { peachFarmerDay } from "@/data/farmers";
import { surveyForms } from "@/data/forms";

// / farmers　農家さんの声
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2
// 2026年10月28日：架空のプロフィール4人を外し、農家さんの声を集めるページにした。
// 「農家の1日」は同じ日にトップに合わせて直したもの（PR #12）を残す（仮データの表示つき）。
// 掲載の了承をいただいた方の話から載せる（実名は本人の了承がある場合だけ）。

export const metadata: Metadata = {
  title: "農家さんの声",
  description:
    "福島県北で就農した農家さんの声を集めています。掲載の了承をいただいた方から順に紹介します。",
};

const form01 = surveyForms.find((f) => f.id === "FORM 01");

export default function FarmersPage() {
  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          eye="farmers"
          title="農家さんの声"
          lead="「自分みたいな人間でもできるのか」——その答えに近づけるよう、実際に就農した方の声を集めています。"
        />
      </Reveal>

      <div className="mx-auto mt-10 max-w-content">
        <Reveal>
          <Card>
            <h3 className="font-bold text-ink">いま、声を集めているところです</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              就農前の仕事、どうやって地域とつながったか、収入が落ち着くまでの年数などを、農家さんにうかがっています。掲載の了承をいただいた方から順に、このページで紹介します。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              それまでは、県の就農サイト「ふくのう」の就農ロールモデルもご覧ください。
            </p>
            <ExternalLink
              href="https://start-fukuagri.jp/modelcase/"
              className="mt-3 inline-block text-sm font-bold text-green-700 hover:underline"
            >
              ふくのうの就農ロールモデルを見る →
            </ExternalLink>
          </Card>
        </Reveal>
      </div>

      {/* 次のステップ：シミュレーター・ツールへのCTA */}
      <div className="mx-auto mt-10 max-w-5xl">
        <Reveal>
          <div className="rounded-lg bg-gradient-to-br from-green-700 to-green-900 px-6 py-8 text-center">
            <h3 className="font-serif text-lg font-bold text-white">収入の立ち上がりを、数字で見てみる</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              もも・なし・りんごの1〜10年目の農業所得の試算（新しく植える場合と、先輩の園地を受け継ぐ場合）と、果樹の1年の忙しさの目安を用意しています。
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button href="/tools#profit" className="!bg-white !text-green-800 hover:!bg-green-50">
                💰 品目別収益モデル
              </Button>
              <Button href="/simulator" className="!bg-white !text-green-800 hover:!bg-green-50">
                🌿 シミュレーターを試す（無料）
              </Button>
            </div>
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
            <h3 className="font-bold text-ink">農家さんへ：お話を聞かせてください</h3>
            <p className="mt-2 text-sm text-muted">
              就農・移住を考えている方に向けて、あなたの経験を聞かせてください。載せる範囲は、お話をうかがったうえで一緒に決めます。
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
