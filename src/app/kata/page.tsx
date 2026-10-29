import type { Metadata } from "next";
import Link from "next/link";
import { crops, municipalities, PRODUCTION_CATEGORIES, regionName, regions, topCategory, getSource } from "@/kata";
import { KIND_DESCRIPTION, KIND_LABEL, missingText, fmtNumber } from "@/kata/format";
import type { DataKind } from "@/kata/types";
import { KindBadge } from "@/kata/components/KindBadge";
import { SourceRef } from "@/kata/components/SourcedValue";
import { MunicipalityExplorer, type MunicipalityRow } from "@/kata/components/MunicipalityExplorer";

export const metadata: Metadata = { title: "福島県59市町村の型（見本）" };

const KINDS: DataKind[] = ["official", "estimate", "field", "placeholder"];

export default function KataTop() {
  const rows: MunicipalityRow[] = municipalities.map((m) => ({
    id: m.id,
    name: m.name,
    kana: m.kana,
    regionId: m.regionId,
    regionName: regionName(m.regionId),
    href: `/kata/${m.regionId}/${m.slug}`,
    productionTotal: m.production.total.value,
    productionMissing: missingText(m.production.total),
    topCategory: topCategory(m),
  }));
  const nf = regions[0].newFarmers;

  return (
    <main>
      <h1 className="text-2xl font-bold">福島県59市町村の就農データ</h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        福島県の59市町村を、産地・担い手・気候の同じ物差しで並べる「型」の見本です。数値は国・県の公表値と、それを組み合わせた推計まで。すべての数値に、データの種類と出典を付けています。
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">7つの地方</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {regions.map((r) => (
            <li key={r.id} className="rounded border border-gray-200 p-3">
              <Link href={`/kata/${r.id}`} className="font-bold underline decoration-gray-300 underline-offset-2">{r.name}</Link>
              <span className="ml-2 text-sm text-gray-600">{r.municipalityIds.length}市町村</span>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
                新規就農者 {r.newFarmers.value === null ? missingText(r.newFarmers) : `${fmtNumber(r.newFarmers.value)}人`}
                <KindBadge kind={r.newFarmers.kind} />
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-600">
          新規就農者数：<SourceRef sourceId={nf.sourceId} getSource={getSource} sourcesHref="/kata/sources" />。{nf.note}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">59市町村</h2>
        <MunicipalityExplorer
          rows={rows}
          regions={regions.map((r) => ({ id: r.id, label: r.name }))}
          categories={PRODUCTION_CATEGORIES.filter((c) => c.id !== "other").map((c) => ({ id: c.id, label: c.label }))}
        />
        <p className="mt-1 text-xs text-gray-600">
          農業産出額：<SourceRef sourceId="maff-production-r5" getSource={getSource} sourcesHref="/kata/sources" year={2023} />（推計の公表値）。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">果樹の道のり</h2>
        <ul className="flex flex-wrap gap-3">
          {crops.map((c) => (
            <li key={c.id}>
              <Link href={`/kata/crops/${c.id}`} className="underline decoration-gray-300 underline-offset-2">{c.name}（{c.variety}）</Link>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-xs text-gray-600">ぶどうは、単価と収量の立ち上がりの前提を確かめてから足します。</p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">データの種類</h2>
        <dl className="space-y-2 text-sm">
          {KINDS.map((k) => (
            <div key={k} className="flex flex-wrap items-baseline gap-2">
              <dt><KindBadge kind={k} /></dt>
              <dd className="text-gray-700">{KIND_DESCRIPTION[k]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-gray-700">
          値のない所は、0 ではなく次のように書いています。「非公表」＝統計で秘匿されている値。「データなし」＝統計上の理由で公表されていない、または観測していない値。「未取得」＝公開されている資料から、まだ取り込めていない値（{KIND_LABEL.placeholder}）。どれも比較からは外しています。
        </p>
        <p className="mt-3 text-sm">
          <Link href="/kata/sources" className="underline decoration-gray-300 underline-offset-2">出典と計算式の一覧</Link>
        </p>
      </section>
    </main>
  );
}
