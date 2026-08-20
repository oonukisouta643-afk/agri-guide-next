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
import { buildRoadmap } from "@/data/roadmap";
import { trackEvent } from "@/lib/analytics";

// シミュレーター結果画面（12要素）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6「結果画面の表示順序」
// ／agri-simulator-v4.html（旧版）の結果画面（293〜391行目）から仮データ表示バナー・
// コスト表・4リンクグリッド・免責文言などを移植。

const subsidyBadgeColor: Record<SubsidyBadge, "green" | "gold" | "red"> = {
  ok: "green",
  req: "gold",
  no: "red",
};

const subsidyBadgeText: Record<SubsidyBadge, string> = {
  ok: "対象可能性あり",
  req: "要件確認必要",
  no: "対象外",
};

// 旧版「ふくのうへの4リンクグリッド」（344〜359行目）を移植。
// 4つ目の相談リンクは/support/（Q10回答連動のwindowReferralで使う/syuno/とは別ページ）。
const fukunouLinks = [
  {
    href: "https://start-fukuagri.jp/trainee/",
    icon: "🌱",
    title: "お試し就農体験",
    desc: "1〜3日間・無料・交通費補助あり",
  },
  {
    href: "https://start-fukuagri.jp/procedure/",
    icon: "📋",
    title: "就農までのステップ",
    desc: "ふくのう公式・全体の流れを確認",
  },
  {
    href: "https://start-fukuagri.jp/modelcase/",
    icon: "👨‍🌾",
    title: "就農ロールモデル",
    desc: "実例・収益数字あり",
  },
  {
    href: "https://start-fukuagri.jp/support/",
    icon: "📞",
    title: "ふくのうに相談",
    desc: "無料・就農前でもOK",
  },
];

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
  const roadmap = useMemo(() => buildRoadmap(answers), [answers]);
  const windowReferral = windowReferrals[answers.window ?? "any"];

  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  useEffect(() => {
    setCurrentMonth(new Date().getMonth() + 1);
  }, []);

  // GA4：結果画面を表示した時点で、就農意欲レベル（Lv1〜3）をパラメータ付きで送信。
  // 個人を特定する情報は含めない。市町村への紹介料モデル検討のため、
  // 「Lv3（実行層）到達者数」をGA4上で追えるようにする目的。
  useEffect(() => {
    trackEvent("simulator_result_view", { motivation_level: level });
  }, [level]);
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
      {/* 仮データ表示中バナー（旧版.draft-notice、294行目の移植） */}
      <Reveal>
        <WarningBox type="warn">
          <p className="font-bold">⚠️ 仮データ表示中・2026年8月更新予定</p>
          <p className="mt-1">
            品目別の初期費用・年収は全国平均値ベースの試算です。福島県北地域の実データはFORM
            03集計後に更新します。
          </p>
        </WarningBox>
      </Reveal>

      {/* 結果ヒーロー見出し（旧版.r-title、523行目：年代・家族構成・目標年収） */}
      <Reveal>
        <div className="rounded-lg bg-gradient-to-br from-green-900 to-[#0E2210] p-6 text-center text-white">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            シミュレーション結果
          </p>
          <p className="mt-2 font-serif text-base font-black leading-relaxed">
            {funding.titleText}
          </p>
        </div>
      </Reveal>

      {/* ① KPIサマリー */}
      <Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="text-center">
            <p className="text-xs text-muted">受給可能な補助金（上限目安）</p>
            <p className="mt-1 font-serif text-xl font-bold text-green-700">
              {funding.maxSubsidyText}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-muted">就農までの目安（研修含む概算）</p>
            <p className="mt-1 font-serif text-xl font-bold text-green-700">
              {funding.durationEstimateText}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-muted">想定初期費用（仮データ・8月更新）</p>
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
                <div className="flex flex-wrap items-start gap-2">
                  <span className="text-xl leading-none">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-ink">{item.name}</span>
                      <Badge text={subsidyBadgeText[item.badge]} color={subsidyBadgeColor[item.badge]} />
                    </div>
                    <p className="mt-1 text-sm font-bold text-green-700">{item.amountText}</p>
                    <p className="text-xs text-muted">{item.note}</p>
                    {item.warn && (
                      <WarningBox type="warn" className="mt-2 text-xs">
                        ⚠ {item.warn}
                      </WarningBox>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-center">
            <Link
              href="/subsidies"
              className="inline-block rounded-full border border-green-200 px-5 py-2 text-xs font-bold text-green-700 hover:bg-green-50"
            >
              県北6市町村＋県の補助金一覧を見る →
            </Link>
          </div>
        </Card>
      </Reveal>

      {/* ③ 農地・初期費用テーブル（旧版308〜334行目の5行構成を移植） */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">農地・初期費用の目安</h3>
          <p className="mt-2 text-xs text-muted">
            ※ 全国平均値ベースの仮データ。2026年8月に農家ヒアリングデータで更新予定。
          </p>
          <table className="mt-3 w-full text-sm">
            <tbody>
              <tr className="border-b border-green-200">
                <td className="py-2 text-muted">農地賃借料</td>
                <td className="py-2 text-right font-mono font-bold text-ink">1〜3万円/反・年</td>
              </tr>
              <tr className="border-b border-green-200 bg-green-50/40">
                <td className="py-2 text-muted">農機・設備（初期）</td>
                <td className="py-2 text-right font-mono font-bold text-ink">50〜300万円</td>
              </tr>
              <tr className="border-b border-green-200">
                <td className="py-2 text-muted">苗木・資材（果樹）</td>
                <td className="py-2 text-right font-mono font-bold text-ink">30〜80万円/反</td>
              </tr>
              <tr className="border-b border-green-200 bg-green-50/40">
                <td className="py-2 text-muted">就農1年目の総費用</td>
                <td className="py-2 text-right font-mono font-bold text-ink">中央値 約400万円</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-2 font-bold text-green-700">
                  補助金＋融資 合計上限（全制度合算）
                </td>
                <td className="py-2 text-right font-mono text-base font-black text-green-700">
                  最大750万円以上
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            ※ 上部「受給可能な補助金」（あなたの回答から算出した給付金の目安）とは別の数値です。
            こちらは給付金に加えて日本政策金融公庫の融資枠なども含めた、全制度を合算した理論上の
            上限額であり、実際に受け取れる金額とは異なります。
          </p>
        </Card>
      </Reveal>

      {/* ④ 地域マッチング（要件定義書§6の表示順序一覧で「常時表示」と明記されているため、
          スコアが0でも候補地域を表示する。品目を選択した場合はより精度の高い候補になる） */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">おすすめの地域</h3>
          <p className="mt-1 text-xs text-muted">
            ※ 仮データ。農家ヒアリング完了後（2026年8月）に精度を上げます。
          </p>
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
                  <span className="ml-auto text-xs text-muted">{match.region.tag}</span>
                </div>
                {match.reasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {match.reasons.map((reason, i) => (
                      <span
                        key={i}
                        className="rounded-sm bg-white px-2 py-0.5 text-xs text-ink"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-sm text-ink">{match.region.push}</p>
                {!match.isTop && (
                  <p className="mt-1 text-xs text-muted">⚠ {match.region.tradeoff}</p>
                )}
                <ExternalLink
                  href={match.region.link}
                  className="mt-2 inline-block text-sm font-bold text-green-700 hover:underline"
                  onClick={() =>
                    trackEvent("region_referral_click", {
                      region_key: match.region.key,
                      region_name: match.region.name,
                      is_top: match.isTop,
                      motivation_level: level,
                      source: "simulator_result",
                    })
                  }
                >
                  詳細を確認する →
                </ExternalLink>
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
                {alert.urgent ? "⏰ 動き始めるなら今がタイミングです" : "📅 農業には申し込みの旬があります"}
              </p>
              <p className="mt-1" dangerouslySetInnerHTML={{ __html: alert.messageHtml }} />
              <p className="mt-1 text-xs opacity-80">{alert.seasonText}</p>
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

      {/* ⑦ 窓口斡旋ボックス（旧版WINDOWSオブジェクト：desc・per-window色テーマを移植） */}
      <Reveal>
        <div
          className="rounded-lg border p-6"
          style={{ background: windowReferral.bg, borderColor: windowReferral.border }}
        >
          <p className="text-xs font-bold" style={{ color: windowReferral.color }}>
            📞 あなたへのおすすめ相談窓口
          </p>
          <h3 className="mt-2 font-bold text-ink">{windowReferral.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink">{windowReferral.desc}</p>
          <a
            href={windowReferral.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded px-4 py-2 text-sm font-bold text-white hover:opacity-90"
            style={{ background: windowReferral.color }}
            onClick={() =>
              trackEvent("window_referral_click", {
                window_key: windowReferral.key,
                window_name: windowReferral.name,
                motivation_level: level,
              })
            }
          >
            {windowReferral.label} →
          </a>
        </div>
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

      {/* ⑨ 就農ロードマップ（回答内容に応じて動的に3〜5ステップを構築） */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">就農ロードマップ</h3>
          <div className="mt-4 space-y-4">
            {roadmap.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wide text-green-700">
                    {step.phase}
                  </p>
                  <p className="font-bold text-ink">{step.title}</p>
                  <p className="text-sm text-muted">{step.description}</p>
                  <ul className="mt-1 list-inside list-disc text-xs text-muted">
                    {step.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  {step.warn && (
                    <WarningBox type="warn" className="mt-2 text-xs">
                      ⚠ {step.warn}
                    </WarningBox>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      {/* ⑩ ふくのうへの4リンクグリッド（旧版344〜359行目のアイコン＋説明カード構成を移植） */}
      <Reveal>
        <Card>
          <h3 className="font-bold text-ink">次のステップ：ふくのうへ相談する</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            シミュレーションで方向性が見えてきたら、福島県の公式就農支援窓口「ふくのう」に相談してみてください。お試し就農体験・就農相談・研修機関の紹介まで、無料でサポートしてもらえます。
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {fukunouLinks.map((link) => (
              <ExternalLink
                key={link.href}
                href={link.href}
                className="block rounded-lg border border-green-200 bg-green-50 px-3 py-2 hover:bg-green-100"
              >
                <p className="text-sm font-bold text-green-700">
                  {link.icon} {link.title}
                </p>
                <p className="mt-0.5 text-xs text-muted">{link.desc}</p>
              </ExternalLink>
            ))}
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

      {/* 免責事項（旧版.disc、388行目の移植。日付は2026年8月時点の情報に更新） */}
      <Reveal>
        <p className="rounded bg-black/[.03] p-3 text-[11px] leading-relaxed text-muted">
          ※ 本シミュレーションは2026年8月時点の情報に基づく概算です。補助金の受給には各制度の要件を満たす必要があります。実際の金額・条件は申請時に各窓口にご確認ください。
        </p>
      </Reveal>
    </div>
  );
}
