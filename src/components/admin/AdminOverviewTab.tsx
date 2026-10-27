import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ExternalLink } from "@/components/ui/ExternalLink";
import {
  SHOW_SOUDAN_ITEMS,
  overviewGoal,
  overviewFacts,
  overviewFactsReading,
  overviewSources,
  overviewHypothesis,
  overviewResources,
  overviewQuestions,
} from "@/data/admin/adminOverview";

// タブ「全体像」：目指す状態 → いま起きていること → 見立て → そのためにあるもの → お聞きしたいこと
// 出典：docs/INSTRUCTIONS_admin-overview.md「4.」

export function AdminOverviewTab() {
  const resources = overviewResources.filter((r) => SHOW_SOUDAN_ITEMS || !r.soudan);
  const questions = overviewQuestions.filter((q) => SHOW_SOUDAN_ITEMS || !q.soudan);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-ink">{overviewGoal.title}</h3>

      <Card>
        <h4 className="font-bold text-ink">目指す状態</h4>
        <p className="mt-2 text-sm leading-relaxed text-ink">{overviewGoal.goal}</p>
        <p className="mt-3 text-sm text-muted">{overviewGoal.goalNote}</p>
      </Card>

      <Card>
        <h4 className="font-bold text-ink">いま起きていること（公開資料から）</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-green-200 text-muted">
                <th className="py-2 pr-3 font-bold">いま起きていること</th>
                <th className="py-2 font-bold">出典</th>
              </tr>
            </thead>
            <tbody>
              {overviewFacts.map((f) => (
                <tr key={f.fact} className="border-b border-green-50 align-top">
                  <td className="py-2 pr-3 text-ink">{f.fact}</td>
                  <td className="py-2 text-xs text-muted">{f.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink">{overviewFactsReading}</p>
        <div className="mt-4 border-t border-green-200 pt-3">
          <p className="text-xs font-bold text-muted">出典</p>
          <ul className="mt-1 space-y-1 text-xs">
            {overviewSources.map((s) => (
              <li key={s.url}>
                <ExternalLink href={s.url} className="text-green-700 underline">
                  {s.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card>
        <h4 className="font-bold text-ink">{overviewHypothesis.title}</h4>
        {overviewHypothesis.paragraphs.map((p) => (
          <p key={p} className="mt-2 text-sm leading-relaxed text-ink">
            {p}
          </p>
        ))}
      </Card>

      <Card>
        <h4 className="font-bold text-ink">そのためにあるもの</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-green-200 text-muted">
                <th className="py-2 pr-3 font-bold">目指す状態に向けて</th>
                <th className="py-2 pr-3 font-bold">あるもの</th>
                <th className="py-2 font-bold">状態</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.resource} className="border-b border-green-50 align-top">
                  <td className="py-2 pr-3 text-ink">{r.goal}</td>
                  <td className="py-2 pr-3 text-ink">
                    {r.status === "公開中" && r.href ? (
                      <Link href={r.href} className="text-green-700 underline">
                        {r.resource}
                      </Link>
                    ) : (
                      r.resource
                    )}
                  </td>
                  <td className="whitespace-nowrap py-2 text-xs text-muted">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h4 className="font-bold text-ink">お聞きしたいこと</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
          {questions.map((q) => (
            <li key={q.text}>{q.text}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
