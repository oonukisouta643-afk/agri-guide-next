"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { surveyForms, type SurveyForm } from "@/data/forms";
import { fieldFormQuestions, type FieldQuestionTag } from "@/data/fieldQuestions";
import { trackEvent } from "@/lib/analytics";

// Section 4：Field（アンケート・フィールド調査）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5、OLD版 index.html #360-437
// "use client"：アンケート設問アコーディオンの開閉状態・農家プロフィール誘導のGA4送信のため。

const badgeColorByForm: Record<string, "green" | "sky" | "gold" | "red"> = {
  "FORM 01": "green",
  "FORM 02": "sky",
  "FORM 03": "sky", // 紫指定だがBadgeコンポーネントの色トークンに紫がないためskyで代用
  "FORM 04": "gold",
  "FORM 05": "red",
};

const tagBadgeColor: Record<FieldQuestionTag, "red" | "gold"> = {
  最重要: "red",
  新設: "gold",
  v3新設: "gold",
  修正: "gold",
};

function FormRow({ form }: { form: SurveyForm }) {
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-green-200 py-3 last:border-b-0">
      <Badge text={form.id} color={badgeColorByForm[form.id] ?? "green"} />
      <span className="text-sm font-medium text-ink">{form.target}</span>
      <span className="text-xs text-muted">
        {form.questionCount}問・{form.duration}
      </span>
      <ExternalLink
        href={form.url}
        className="ml-auto text-sm font-bold text-green-700 hover:underline"
      >
        回答する →
      </ExternalLink>
    </li>
  );
}

function SurveyAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-green-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="text-xl" aria-hidden="true">
          📋
        </span>
        <span className="flex-1">
          <span className="block font-bold text-ink">アンケート5種・設計完了</span>
          <span className="block text-xs text-muted">タップして各フォームの内容を確認</span>
        </span>
        <span
          className={`text-green-700 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-green-200 px-5 py-5">
          <p className="text-xs leading-relaxed text-muted">
            現在5種類のアンケートを並行して実施中です。各フォームの目的と主な設問をご確認いただけます。
          </p>
          <div className="mt-4 flex flex-col gap-5">
            {fieldFormQuestions.map((form) => {
              const surveyForm = surveyForms.find((f) => f.id === form.formId);
              return (
                <div key={form.formId}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-green-700">
                      {form.icon} {form.formId}　{form.label}
                    </span>
                    {surveyForm && (
                      <ExternalLink
                        href={surveyForm.url}
                        className="rounded-sm border border-green-200 px-2 py-0.5 text-[11px] text-green-600 hover:bg-green-50"
                      >
                        開く →
                      </ExternalLink>
                    )}
                  </div>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {form.questions.map((q) => (
                      <li key={q.qn} className="flex flex-wrap items-baseline gap-2 text-xs">
                        <span className="shrink-0 font-mono font-bold text-green-700">{q.qn}</span>
                        <span className="text-ink">{q.text}</span>
                        {q.tag && (
                          <Badge text={q.tag} color={tagBadgeColor[q.tag]} className="text-[10px]" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const teaserCards = [
  {
    icon: "🎤",
    title: "農家インタビュー（進行中）",
    description: "果樹研究所・元JA人脈経由で福島県北地域農家へのヒアリングを実施中",
  },
  {
    icon: "📊",
    title: "需給ギャップ分析（8月予定）",
    description: "農家・行政側の認識と就農希望者の実態を照合したレポートを行政へ無償提供",
  },
  {
    icon: "🏛️",
    title: "2026年度 政策の追い風",
    description: "農業構造転換集中対策が494億円に倍増・地域計画早期実現支援枠（上限600万円）新設",
  },
];

export function Field() {
  return (
    <section id="field" className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader title="あなたの声が農業の未来を変える" />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Reveal>
          <Card>
            <p className="font-bold text-ink">データを社会に届ける</p>
            <p className="mt-2 text-sm text-muted">
              みなさんの回答は、行政や関係団体への提案資料としても活用され、支援制度の充実につながります。
            </p>
          </Card>
        </Reveal>
        <Reveal delayMs={100}>
          <Card>
            <p className="font-bold text-ink">転送で思わぬ人に届く</p>
            <p className="mt-2 text-sm text-muted">
              周りに就農・移住に興味がありそうな方がいたら、ぜひアンケートを転送してください。
            </p>
          </Card>
        </Reveal>
      </div>

      <Reveal delayMs={150}>
        <ul className="mx-auto mt-8 max-w-5xl rounded border border-green-200 bg-white px-5 shadow-sm">
          {surveyForms.map((form) => (
            <FormRow key={form.id} form={form} />
          ))}
        </ul>
      </Reveal>

      <Reveal delayMs={200}>
        <div className="mx-auto max-w-5xl">
          <SurveyAccordion />
        </div>
      </Reveal>

      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {teaserCards.map((card, i) => (
          <Reveal key={card.title} delayMs={i * 75}>
            <Card className="h-full">
              <p className="text-2xl" aria-hidden="true">
                {card.icon}
              </p>
              <p className="mt-2 font-bold text-ink">{card.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{card.description}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={225}>
        <div className="mx-auto mt-4 max-w-5xl">
          <Link
            href="/farmers"
            onClick={() =>
              trackEvent("farmer_profile_teaser_click", { source: "homepage_field" })
            }
            className="block"
          >
            <Card className="flex items-center gap-4 transition-shadow hover:shadow">
              <span className="text-2xl" aria-hidden="true">
                👨‍🌾
              </span>
              <div>
                <p className="font-bold text-ink">農家プロフィール（掲載中）</p>
                <p className="mt-1 text-sm text-muted">
                  実際に福島県北地域で農業をしている農家さんの声・プロフィールを公開中。話を聞いてみたい方はこちら →
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
