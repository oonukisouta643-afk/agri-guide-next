"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { WarningBox } from "@/components/ui/WarningBox";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { SimulatorState } from "@/lib/simulator/types";
import {
  calcFunding,
  calcRegionMatch,
  calcTimingAlerts,
  calcSimilarCase,
  calcMotivationLevel,
  nextStepByLevel,
  buildMailto,
  encodeStateToParam,
  type SubsidyBadge,
} from "@/lib/simulator/calculations";
import { windowReferrals } from "@/data/windowReferral";
import { roadmapPhases } from "@/data/roadmap";

// シミュレーター結果画面（12要素）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6「結果画面の表示順序」

const subsidyBadgeColor: Record<SubsidyBadge, "green" | "gold" | "sky"> = {
  ok: "green",
  warn: "gold",
  req: "sky",
};

type ResultScreenProps = {
  answers: SimulatorState;
  onRestart: () => void;
};

export function ResultScreen({ answers, onRestart }: ResultScreenProps) {
  const funding = useMemo(() => calcFunding(answers), [answers]);
  const regionMatches = useMemo(() => calcRegionMatch(answers), [answers]);
  const similarCase = useMemo(() => calcSimilarCase(answers), [answers]);
  const level = useMemo(() => calcMotivationLevel(answers), [answers]);
  const nextStep = useMemo(() => nextStepByLevel(level), [level]);
  const mailtoHref = useMemo(() => buildMailto(answers), [answers]);
  const windowReferral = windowReferrals[answers.window ?? "any"];

  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  useEffect(() => {
    setCurrentMonth(new Date().getMonth() + 1);
  }, []);
  const timingAlerts = useMemo(
    () => (currentMonth ? calcTimingAlerts(answers.crops.filter((c) => c !== "any"), currentMonth) : []),
    [answers.crops, currentMonth]
  );

  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  function handleShare() {
    const param = encodeStateToParam(answers);
    const url = `${window.location.origin}/simulator?sim=${param}`;
    navigator.clipboard
      .writeText(url)
      .then(() => setShareState("copied"))
      .catch(() => setShareState("idle"));
    setTimeout(() => setShareState("idle"), 2500);
  }

  return (
    <div className="mx-auto max-w-content space-y-6">
      {/* ① KPIサマリー */}
      <Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="text-center">
            <p className="text-xs text-muted">補助金上限</p>
            <p className="mt-1 font-serif text-xl font-bold text-green-700">
              {funding.maxSubsidyText}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-muted">就農期間目安</p>
            <p className="mt-1 font-serif text-xl font-bold text-green-700">
              {funding.durationEstimateText}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-muted">想定初期費用</p>
            <p className="mt-1 font-serif text-xl font-bold text-green-700">
              {funding.initialCostEstimateText}
            </p>
          </Card>
        </div>
      </Reveal>

      {/* ② 補助金リスト */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">利用できそうな補助金・支援制度</h3>
          <ul className="mt-3 space-y-3">
            {funding.subsidyItems.map((item) => (
              <li key={item.name} className="border-b border-green-200 pb-3 last:border-b-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    text={item.badge === "ok" ? "対象" : item.badge === "warn" ? "要確認" : "個別相談"}
                    color={subsidyBadgeColor[item.badge]}
                  />
                  <span className="font-bold text-ink">{item.name}</span>
                </div>
                <p className="mt-1 text-sm text-ink">{item.amountText}</p>
                <p className="text-xs text-muted">{item.note}</p>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>

      {/* ③ 農地・初期費用テーブル（仮データ） */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">農地・初期費用の目安</h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              <tr className="border-b border-green-200">
                <td className="py-2 text-muted">想定初期費用</td>
                <td className="py-2 text-right font-bold text-ink">
                  {funding.initialCostEstimateText}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-muted">農地取得・賃借</td>
                <td className="py-2 text-right font-bold text-ink">農地により異なる（仮データ）</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted">
            ※仮データです。農家ヒアリングが完了次第、実データに更新します。
          </p>
        </Card>
      </Reveal>

      {/* ④ 地域マッチング（要件定義書§6の表示順序一覧で「常時表示」と明記されているため、
          スコアが0でも候補地域を表示する。品目を選択した場合はより精度の高い候補になる） */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">おすすめの地域</h3>
          <div className="mt-3 space-y-3">
            {regionMatches.map((match) => (
              <div
                key={match.region.key}
                className={`rounded border-l-4 p-4 ${
                  match.isTop ? "border-green-700 bg-green-50" : "border-gold bg-[#fbf3e3]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge text={match.isTop ? "おすすめ" : "次点"} color={match.isTop ? "green" : "gold"} />
                  <span className="font-bold text-ink">{match.region.name}</span>
                </div>
                {match.reasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {match.reasons.map((reason, i) => (
                      <span
                        key={i}
                        className="rounded-sm bg-white px-2 py-0.5 text-xs text-ink"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-sm text-muted">
                  {match.reasons.length === 0
                    ? "品目を選択すると、より条件に合った地域を絞り込めます。"
                    : match.isTop
                      ? `${match.region.name}があなたの条件に一番近い候補です。`
                      : "おすすめの地域と比べるとスコアはやや低めですが、他にも魅力があります。"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      {/* ⑤ タイミング警告 */}
      {timingAlerts.length > 0 &&
        timingAlerts.map((alert) => (
          <Reveal key={alert.crop}>
            <WarningBox type={alert.urgent ? "warn" : "tip"}>
              <p className="font-bold">
                {alert.cropLabel}：{alert.urgent ? "申し込みシーズンが近づいています" : "まだ時間に余裕があります"}
              </p>
              <p className="mt-1">{alert.seasonText}</p>
            </WarningBox>
          </Reveal>
        ))}

      {/* ⑥ 似た条件の人カード */}
      {similarCase && (
        <Reveal>
          <Card>
            <h3 className="font-bold text-ink">似た条件で就農した方</h3>
            <div className="mt-3">
              <p className="font-bold text-ink">
                {similarCase.name}（{similarCase.area}）
              </p>
              <p className="text-xs text-muted">
                {similarCase.before} → {similarCase.now}
              </p>
              <p className="mt-2 text-sm text-ink">「{similarCase.quote}」</p>
              <Link
                href={similarCase.link}
                className="mt-3 inline-block text-sm font-bold text-green-700 hover:underline"
              >
                他の農家プロフィールを見る →
              </Link>
            </div>
            <p className="mt-2 text-xs text-muted">
              ※仮データです。農家ヒアリングが完了次第、実データに差し替えます。
            </p>
          </Card>
        </Reveal>
      )}

      {/* ⑦ 窓口斡旋ボックス */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">まずはここに相談してみましょう</h3>
          <p className="mt-2 text-sm text-ink">{windowReferral.name}</p>
          <ExternalLink
            href={windowReferral.url}
            className="mt-3 inline-block rounded bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"
          >
            相談してみる →
          </ExternalLink>
        </Card>
      </Reveal>

      {/* ⑧ 次のステップ（就農意欲レベルはユーザーに見せない） */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">次のステップ</h3>
          <p className="mt-2 text-sm text-ink">{nextStep.message}</p>
          <ExternalLink
            href={nextStep.url}
            className="mt-3 inline-block text-sm font-bold text-green-700 hover:underline"
          >
            詳しく見る →
          </ExternalLink>
        </Card>
      </Reveal>

      {/* ⑨ 就農ロードマップ */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">就農ロードマップ</h3>
          <div className="mt-4 space-y-4">
            {roadmapPhases.map((phase) => (
              <div key={phase.phase} className="flex gap-3">
                <span className="text-2xl">{phase.icon}</span>
                <div>
                  <p className="font-mono text-xs font-bold text-green-700">{phase.phase}</p>
                  <p className="font-bold text-ink">{phase.title}</p>
                  <p className="text-sm text-muted">{phase.description}</p>
                  <ul className="mt-1 list-inside list-disc text-xs text-muted">
                    {phase.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      {/* ⑩ ふくのうへの4リンク */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">ふくのうで詳しく知る</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <ExternalLink href="https://start-fukuagri.jp/trainee/" className="text-green-700 hover:underline">
              お試し就農 →
            </ExternalLink>
            <ExternalLink href="https://start-fukuagri.jp/procedure/" className="text-green-700 hover:underline">
              就農ステップ →
            </ExternalLink>
            <ExternalLink href="https://start-fukuagri.jp/modelcase/" className="text-green-700 hover:underline">
              ロールモデル →
            </ExternalLink>
            <ExternalLink href="https://start-fukuagri.jp/syuno/" className="text-green-700 hover:underline">
              相談する →
            </ExternalLink>
          </div>
        </Card>
      </Reveal>

      {/* ⑪ メール相談CTA */}
      <Reveal>
        <div className="text-center">
          <a
            href={mailtoHref}
            className="inline-block rounded bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-600"
          >
            メールで相談する
          </a>
        </div>
      </Reveal>

      {/* URLシェア（F-30・F-36） */}
      <Reveal>
        <div className="text-center">
          <button
            type="button"
            onClick={handleShare}
            className="text-sm font-bold text-green-700 hover:underline"
          >
            {shareState === "copied" ? "リンクをコピーしました ✓" : "この結果をシェアする（リンクをコピー）"}
          </button>
        </div>
      </Reveal>

      {/* ⑫ 再シミュレーションボタン */}
      <Reveal>
        <div className="text-center">
          <Button variant="secondary" onClick={onRestart}>
            もう一度シミュレーションする
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
