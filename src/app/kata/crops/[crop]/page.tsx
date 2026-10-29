import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { crops, getCrop, getMunicipalityById, getSource } from "@/kata";
import { fmtNumber, fmtYen } from "@/kata/format";
import { SourcedTable, type SourcedRow } from "@/kata/components/SourcedValue";
import { RoadmapExplorer } from "@/kata/components/RoadmapExplorer";
import { FieldNotesSlot } from "@/kata/components/FieldNotesSlot";
import type { Municipality } from "@/kata/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return crops.map((c) => ({ crop: c.id }));
}

type Props = { params: Promise<{ crop: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCrop((await params).crop);
  return { title: c ? `${c.name}の道のり（見本）` : "見本" };
}

const SOURCES_HREF = "/kata/sources";

export default async function CropPage({ params }: Props) {
  const crop = getCrop((await params).crop);
  if (!crop) notFound();

  const perTenA: SourcedRow[] = [
    { label: "成園の収量", s: crop.perTenA.yieldKg, format: (n) => `${fmtNumber(n)}kg` },
    { label: "年間労働時間", s: crop.perTenA.laborHours, format: (n) => `${fmtNumber(n)}時間` },
    { label: "単価", s: crop.perTenA.unitPriceYenPerKg, format: (n) => `${fmtNumber(n)}円/kg` },
    { label: "成園の経営費", s: crop.perTenA.costYen, format: (n) => fmtYen(n) },
    { label: "新しく植えるときの初期投資", s: crop.initialInvestmentPerTenA, format: (n) => fmtYen(n) },
  ];
  const years: SourcedRow[] = [
    { label: "初めて収穫できる年（新しく植える場合）", s: crop.yearsToFirstHarvest, format: (n) => `${n}年目` },
    { label: "成園並みの収量になる年（新しく植える場合）", s: crop.yearsToFullProduction, format: (n) => `${n}年目` },
  ];
  const mains = crop.mainMunicipalityIds.map((id) => getMunicipalityById(id)).filter((m): m is Municipality => Boolean(m));

  return (
    <main>
      <p className="text-sm"><Link href="/kata" className="underline decoration-gray-300 underline-offset-2">59市町村の一覧</Link></p>
      <h1 className="mt-2 text-2xl font-bold">{crop.name}の道のり</h1>
      <p className="text-sm text-gray-600">代表品種：{crop.variety}</p>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">10aあたり</h2>
        <SourcedTable rows={perTenA} getSource={getSource} sourcesHref={SOURCES_HREF} />
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">何年目にどのくらいの所得になりそうか</h2>
        <p className="mb-3 text-sm text-gray-700">
          「新しく植える」と「先輩の園地を受け継ぐ」の2つの始め方で、1〜10年目の農業所得を計算しています。面積と単価を変えると計算し直します。
        </p>
        <RoadmapExplorer crop={crop} />
        <div className="mt-4">
          <SourcedTable rows={years} getSource={getSource} sourcesHref={SOURCES_HREF} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">主な産地</h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {mains.map((m) => (
            <li key={m.id}>
              <Link href={`/kata/${m.regionId}/${m.slug}`} className="underline decoration-gray-300 underline-offset-2">{m.name}</Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-600">選び方：{crop.mainMunicipalitiesNote}</p>
      </section>

      <FieldNotesSlot notes={crop.extensions?.fieldNotes} />

      <section className="mt-8 rounded border border-gray-200 p-3 text-sm text-gray-700">
        このページは果樹の道のりを補うための見本です。野菜（きゅうり・トマトなど）や花きの経営の目安は、福島県の就農ポータル「ふくのう」の
        <a href="https://start-fukuagri.jp/management/" target="_blank" rel="noopener noreferrer" className="underline">代表作物の経営指標</a>
        をご覧ください。
      </section>
    </main>
  );
}
