import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMunicipalityById, getRegion, getSource, PRODUCTION_CATEGORIES, regions, sumProduction } from "@/kata";
import { fmtNumber, fmtOkuFromSenman } from "@/kata/format";
import { KindBadge } from "@/kata/components/KindBadge";
import { SourceRef, SourcedValue } from "@/kata/components/SourcedValue";
import type { Municipality } from "@/kata/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return regions.map((r) => ({ region: r.id }));
}

type Props = { params: Promise<{ region: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getRegion((await params).region);
  return { title: r ? `${r.name}地方（見本）` : "見本" };
}

export default async function RegionPage({ params }: Props) {
  const r = getRegion((await params).region);
  if (!r) notFound();
  const ms = r.municipalityIds.map((id) => getMunicipalityById(id)).filter((m): m is Municipality => Boolean(m));
  const zeroTotal = ms.filter((m) => m.production.total.value === 0).map((m) => m.name);
  const sums = [
    { label: "合計", ...sumProduction(ms, (m) => m.production.total) },
    ...PRODUCTION_CATEGORIES.map((c) => ({ label: c.label, ...sumProduction(ms, (m) => m.production.byCategory[c.id]) })),
  ];

  return (
    <main>
      <p className="text-sm"><Link href="/kata" className="underline decoration-gray-300 underline-offset-2">59市町村の一覧</Link></p>
      <h1 className="mt-2 text-2xl font-bold">{r.name}地方</h1>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">新規就農者数</h2>
        <p className="flex flex-wrap items-center gap-2">
          <SourcedValue s={r.newFarmers} format={(n) => `${fmtNumber(n)}人`} />
        </p>
        <p className="mt-1 text-xs text-gray-600">
          <SourceRef sourceId={r.newFarmers.sourceId} getSource={getSource} sourcesHref="/kata/sources" />。{r.newFarmers.note}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">市町村（{ms.length}）</h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {ms.map((m) => (
            <li key={m.id}>
              <Link href={`/kata/${r.id}/${m.slug}`} className="underline decoration-gray-300 underline-offset-2">{m.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">部門別の農業産出額の合計（令和5年）</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-xs text-gray-600">
                <th className="py-2 pr-3 font-medium">部門</th>
                <th className="py-2 pr-3 text-right font-medium">合計</th>
                <th className="py-2 font-medium">足していない市町村</th>
              </tr>
            </thead>
            <tbody>
              {sums.map((s) => (
                <tr key={s.label} className="border-b border-gray-200 align-top">
                  <th scope="row" className="py-1.5 pr-3 text-left font-normal">{s.label}</th>
                  <td className="py-1.5 pr-3 text-right">
                    {s.total === null ? <span className="text-gray-500">足せる値がない</span> : (
                      <span className="inline-flex items-center gap-1.5 font-mono">{fmtOkuFromSenman(s.total)} <KindBadge kind="estimate" /></span>
                    )}
                  </td>
                  <td className="py-1.5 text-xs text-gray-600">{s.excluded.length ? `${s.excluded.join("、")}（非公表・データなし・未取得）` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          推計：所属する市町村の産出額（<SourceRef sourceId="maff-production-r5" getSource={getSource} sourcesHref="/kata/sources" year={2023} />）を足した値。数値が出ていない市町村は 0 として足さず、右の列に名前を出している。そのため、地方の本当の合計より小さいことがある。{zeroTotal.length > 0 && `公開用データの値が 0 の町村（${zeroTotal.join("、")}）は 0 として足している（元の資料で 0 かは確かめていない）。`}
        </p>
      </section>
    </main>
  );
}
