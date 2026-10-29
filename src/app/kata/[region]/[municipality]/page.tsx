import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { crops, getMunicipality, getSource, municipalities, PRODUCTION_CATEGORIES, regionName } from "@/kata";
import { fmtNumber, fmtOkuFromSenman, fmtPercent } from "@/kata/format";
import { SourcedTable, type SourcedRow } from "@/kata/components/SourcedValue";
import { FieldNotesSlot } from "@/kata/components/FieldNotesSlot";
import type { Brand, BrandKind, Municipality, Sourced } from "@/kata/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return municipalities.map((m) => ({ region: m.regionId, municipality: m.slug }));
}

type Props = { params: Promise<{ region: string; municipality: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const m = getMunicipality(p.region, p.municipality);
  return { title: m ? `${m.name}（見本）` : "見本" };
}

const BRAND_LABEL: Record<BrandKind, string> = {
  gi: "地理的表示（GI）",
  designated: "野菜指定産地",
  fruitPlan: "果樹産地協議会",
  trademark: "地域団体商標",
  local: "その他のブランド",
};
const SOURCES_HREF = "/kata/sources";

/** ページで使っている出典の id（重なりなし） */
function usedSourceIds(m: Municipality) {
  const ids = new Set<string>(["pref-yakuba", "pref-code", "soumu-code"]);
  const visit = (o: unknown) => {
    if (Array.isArray(o)) o.forEach(visit);
    else if (o && typeof o === "object") {
      const r = o as Record<string, unknown>;
      if (typeof r.sourceId === "string") ids.add(r.sourceId);
      Object.values(r).forEach(visit);
    }
  };
  visit(m);
  return [...ids];
}

export default async function MunicipalityPage({ params }: Props) {
  const p = await params;
  const m = getMunicipality(p.region, p.municipality);
  if (!m) notFound();

  const oku = (n: number) => fmtOkuFromSenman(n);
  const production: SourcedRow[] = [
    { label: "合計", s: m.production.total, format: oku },
    ...PRODUCTION_CATEGORIES.map((c) => ({ label: c.label, s: m.production.byCategory[c.id], format: oku })),
    ...(m.production.prefRank ? [{ label: "県内順位（合計）", s: m.production.prefRank, format: (n: number) => `59市町村中 ${n}位` }] : []),
  ];
  const workforce: SourcedRow[] = [
    { label: "基幹的農業従事者数", s: m.workforce.coreWorkers, format: (n) => `${fmtNumber(n)}人` },
    { label: "基幹的農業従事者の平均年齢", s: m.workforce.coreWorkersAvgAge, format: (n) => `${fmtNumber(n, 1)}歳` },
    { label: "基幹的農業従事者のうち65歳以上の割合", s: m.workforce.coreWorkersOver65Ratio, format: (n) => fmtPercent(n) },
    { label: "後継者を確保している経営体の割合", s: m.workforce.successorSecuredRatio, format: (n) => fmtPercent(n) },
    { label: "経営耕地面積", s: m.workforce.farmedAreaHa, format: (n) => `${fmtNumber(n, 2)}ha` },
    { label: "担い手への農地集積率", s: m.farmlandConsolidationRate, format: (n) => fmtPercent(n) },
  ];
  const station = `${m.climate.stationName}（役場から${m.climate.stationDistanceKm}km${m.climate.stationInMunicipality ? "、市町村の中" : ""}）`;
  const climateRows: SourcedRow[] = [
    { label: "年平均気温", s: m.climate.annualMeanTempC, format: (n) => `${fmtNumber(n, 1)}℃` },
    { label: "年降水量", s: m.climate.annualPrecipMm, format: (n) => `${fmtNumber(n, 1)}mm` },
    { label: "年間日照時間", s: m.climate.annualSunshineH, format: (n) => `${fmtNumber(n, 1)}時間` },
    { label: "最深積雪", s: m.climate.maxSnowDepthCm, format: (n) => `${fmtNumber(n)}cm` },
  ];
  const climate = climateRows.map((r) => ({ ...r, extra: `観測所：${station}` }));
  const land: SourcedRow[] = [{ label: "総面積", s: m.areaKm2 as Sourced<number>, format: (n) => `${fmtNumber(n, 2)}km²` }];
  const relatedCrops = crops.filter((c) => c.mainMunicipalityIds.includes(m.id));
  const brandGroups = (Object.keys(BRAND_LABEL) as BrandKind[])
    .map((k) => ({ kind: k, items: m.brands.filter((b) => b.kind === k) }))
    .filter((g) => g.items.length);
  const usedIds = usedSourceIds(m);

  return (
    <main>
      <p className="text-sm">
        <Link href="/kata" className="underline decoration-gray-300 underline-offset-2">59市町村の一覧</Link>
        <span className="mx-1 text-gray-400">/</span>
        <Link href={`/kata/${m.regionId}`} className="underline decoration-gray-300 underline-offset-2">{regionName(m.regionId)}地方</Link>
      </p>
      <h1 className="mt-2 text-2xl font-bold">{m.name}</h1>
      <p className="text-sm text-gray-600">{m.kana}　全国地方公共団体コード {m.id}</p>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">産地：農業産出額（令和5年）</h2>
        <SourcedTable rows={production} getSource={getSource} sourcesHref={SOURCES_HREF} />
        {brandGroups.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-1 font-bold">産地の目印</h3>
            <ul className="space-y-2 text-sm">
              {brandGroups.map((g) => (
                <li key={g.kind}>
                  <span className="text-gray-600">{BRAND_LABEL[g.kind]}：</span>
                  {g.items.map((b: Brand, i) => (
                    <span key={`${b.name}-${b.item}-${i}`}>
                      {i > 0 && "、"}
                      {b.name}
                      {b.item && b.item !== b.name ? `（${b.item}${b.scope && b.scope !== "全域" ? `・${b.scope}` : ""}）` : b.scope && b.scope !== "全域" ? `（${b.scope}）` : ""}
                    </span>
                  ))}
                  <a href={`${SOURCES_HREF}#${g.items[0].sourceId}`} className="ml-1 text-xs text-gray-600 underline decoration-gray-300 underline-offset-2">出典</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">担い手（{m.workforce.censusYear}年農林業センサスほか）</h2>
        <SourcedTable rows={workforce} getSource={getSource} sourcesHref={SOURCES_HREF} />
        <p className="mt-1 text-xs text-gray-600">担い手の数字は、事実として並べています。</p>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">気候（平年値 1991〜2020年）</h2>
        <p className="mb-2 text-sm">参照観測所：{station}</p>
        <SourcedTable rows={climate} getSource={getSource} sourcesHref={SOURCES_HREF} />
        <p className="mt-1 text-xs text-gray-600">役場から一番近い観測所（直線距離）の値です。山あいの集落など、役場から離れた場所とは違うことがあります。</p>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">面積</h2>
        <SourcedTable rows={land} getSource={getSource} sourcesHref={SOURCES_HREF} />
      </section>

      {relatedCrops.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold">関連する品目</h2>
          <ul className="flex flex-wrap gap-3">
            {relatedCrops.map((c) => (
              <li key={c.id}>
                <Link href={`/kata/crops/${c.id}`} className="underline decoration-gray-300 underline-offset-2">{c.name}の道のり</Link>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-gray-600">県の果樹農業振興計画書（案）で、その品目を挙げている果樹産地協議会に入っている市町村に出しています。</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">窓口</h2>
        <p className="text-sm">
          <a href={m.contact.url} target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 underline-offset-2">{m.contact.label}</a>
          <span className="ml-1 text-xs text-gray-600">（就農の相談先は、公式サイトの農政の担当課のページで確かめてください）</span>
        </p>
        {m.extensions?.localContacts && m.extensions.localContacts.length > 0 && (
          <ul className="mt-2 text-sm">
            {m.extensions.localContacts.map((c) => (
              <li key={c.url}><a href={c.url} target="_blank" rel="noopener noreferrer" className="underline">{c.label}</a></li>
            ))}
          </ul>
        )}
      </section>

      <FieldNotesSlot notes={m.extensions?.fieldNotes} />

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">このページの出典</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {usedIds.map((id) => {
            const s = getSource(id);
            return (
              <li key={id}>
                <a href={`${SOURCES_HREF}#${id}`} className="underline decoration-gray-300 underline-offset-2">{s?.title ?? id}</a>
                {s && <span className="text-xs text-gray-600">（{s.dataYear}）</span>}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
