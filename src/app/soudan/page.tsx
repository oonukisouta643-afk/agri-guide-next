import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { SoudanFormButton } from "@/components/soudan/SoudanFormButton";
import { FORM06_SOUDAN_STATUS, FORM06_SOUDAN_URL } from "@/data/forms";
import { windowReferrals } from "@/data/windowReferral";

// / soudan　地域とのつながりがない方の就農相談
// 出典：docs/INSTRUCTIONS_soudan-page.md（2026年10月25日）。画面の文章は指示書「4. 画面の文章」のまま。
// 2026年10月30日：段階B（受付中）。index、サイトマップに入れ、トップのアンケート欄からリンクする。
// 紹介を約束しない・紹介先の名前を出さない（公的窓口として出す福島県農業経営・就農支援センターは除く）。

export const metadata: Metadata = {
  title: "地域とのつながりがない方の就農相談",
  description:
    "福島県北で農業を始めたいけれど、地域に知り合いや親せきがいない方の相談を、運営者が直接うかがいます。相談は無料です。",
  alternates: { canonical: "/soudan" },
};

// 同意文（Googleフォーム FORM 06 と同じ文）
const CONSENT_TEXT =
  "いただいた情報は、この相談へのお返事に使います。また、集計した結果（個人が分からない形）を、サービスの改善や、行政・関係団体への説明に使うことがあります。本人の同意なく、個人が分かる形で第三者に渡しません。返信メールで削除を希望できます。この相談の受け付けを終えるときに、いただいた情報は削除します。";

// 公的な窓口のリンクは、シミュレーターの窓口案内（src/data/windowReferral.ts）で使っているものを流用する。
const SUPPORT_CENTER_URL = windowReferrals.fukunou.url;

// 「大事なこと」では「〜担当課もあります。」、受付終了の文では「〜担当課があります。」（指示書の文のまま）。
function PublicWindows({ ending = "もあります。" }: { ending?: "もあります。" | "があります。" }) {
  return (
    <>
      公的な窓口として、
      <ExternalLink href={SUPPORT_CENTER_URL} className="text-green-700 underline">
        福島県農業経営・就農支援センター
      </ExternalLink>
      や各市町村の担当課{ending}
    </>
  );
}

export default function SoudanPage() {
  // URL が空なら、status が "open" でも「準備中」として扱う。
  const status =
    FORM06_SOUDAN_STATUS === "open" && FORM06_SOUDAN_URL === "" ? "preparing" : FORM06_SOUDAN_STATUS;

  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <SectionHeader eye="soudan" title="地域とのつながりがない方の就農相談" />

      <div className="mx-auto mt-8 max-w-3xl space-y-6 leading-relaxed text-ink">
        <p>
          福島県北で農業を始めたいけれど、地域に知り合いや親せきがいない。そんな方の相談を、運営者の大貫が直接うかがいます。
        </p>
        <p>
          県北で新しく農業を始める方は、地域おこし協力隊として来た方や、地元に戻ってきた方が多いと聞いています。農地や園地は、地域の方が「この人なら」と思える相手に託されることが多く、つながりのない方には、最初の一歩が見えにくいかもしれません。
        </p>
        <p>ここでは、その最初の一歩を一緒に考えます。</p>

        {status === "preparing" && <WarningBox type="warn">相談の受け付けは準備中です。</WarningBox>}
        {status === "closed" && (
          <WarningBox type="warn">
            相談の受け付けは終了しました。
            <PublicWindows ending="があります。" />
          </WarningBox>
        )}

        <Card>
          <h3 className="text-lg font-bold text-ink">相談できること</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>どの地域・どの品目が自分に合いそうか</li>
            <li>研修や体験には、どんな選択肢があるか</li>
            <li>収入が安定するまでの年数やお金の目安</li>
            <li>何から始めればいいか</li>
          </ul>
        </Card>

        {status === "open" && (
          <Card>
            <h3 className="text-lg font-bold text-ink">進め方</h3>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>
                下のボタンから相談フォームを開き、いまの状況と相談したいことを送ってください（5〜10分ほど）。
              </li>
              {/* 返信の目安（3日以内）は、段階Bの条件2で大貫さんが決めたもの（2026年10月30日）。 */}
              <li>大貫がメールでお返事します（3日以内を目安にしています）。</li>
              <li>必要に応じて、オンラインでお話しします。</li>
            </ol>
            <div className="mt-5 text-center">
              <SoudanFormButton href={FORM06_SOUDAN_URL} />
            </div>
          </Card>
        )}

        <Card>
          <h3 className="text-lg font-bold text-ink">大事なこと</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>相談は無料です。</li>
            <li>18歳未満の方は、保護者の方と一緒にご相談ください。</li>
            <li>市町村・団体・農家の方への紹介をお約束するものではありません。</li>
            <li>{CONSENT_TEXT}</li>
            <li>
              <PublicWindows />
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
