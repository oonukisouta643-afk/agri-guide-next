"use client";

// 59市町村の一覧。地方・主力部門で絞り込み、50音順・産出額順で並び替える。
// 産出額が非公表・データなしの市町村は、産出額順では最後に回し、0 としては扱わない。
import { useMemo, useState } from "react";

export type MunicipalityRow = {
  id: string;
  name: string;
  kana: string;
  regionId: string;
  regionName: string;
  href: string;
  productionTotal: number | null; // 千万円
  productionMissing: string;      // 値がないときの文言
  topCategory: { id: string; label: string } | null;
};

type Option = { id: string; label: string };

export function MunicipalityExplorer({ rows, regions, categories, productionYearLabel }: {
  rows: MunicipalityRow[];
  regions: Option[];
  categories: Option[];
  productionYearLabel: string; // 例：「令和6年」
}) {
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"kana" | "production">("kana");

  const shown = useMemo(() => {
    const list = rows.filter((r) => (!region || r.regionId === region) && (!category || r.topCategory?.id === category));
    return [...list].sort((a, b) => {
      if (sort === "kana") return a.kana.localeCompare(b.kana, "ja");
      if (a.productionTotal === null) return b.productionTotal === null ? a.kana.localeCompare(b.kana, "ja") : 1;
      if (b.productionTotal === null) return -1;
      return b.productionTotal - a.productionTotal;
    });
  }, [rows, region, category, sort]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          地方
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded border border-gray-300 px-2 py-1">
            <option value="">すべて</option>
            {regions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          主力部門
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border border-gray-300 px-2 py-1">
            <option value="">すべて</option>
            {categories.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          並び
          <select value={sort} onChange={(e) => setSort(e.target.value as "kana" | "production")} className="rounded border border-gray-300 px-2 py-1">
            <option value="kana">50音順</option>
            <option value="production">農業産出額の大きい順</option>
          </select>
        </label>
        <span className="self-center text-xs text-gray-600">{shown.length}市町村</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left text-xs text-gray-600">
              <th className="py-2 pr-3 font-medium">市町村</th>
              <th className="py-2 pr-3 font-medium">地方</th>
              <th className="py-2 pr-3 text-right font-medium">農業産出額（{productionYearLabel}）</th>
              <th className="py-2 font-medium">主力部門</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-b border-gray-200">
                <td className="py-1.5 pr-3">
                  <a href={r.href} className="underline decoration-gray-300 underline-offset-2">{r.name}</a>
                  <span className="ml-1 text-xs text-gray-500">{r.kana}</span>
                </td>
                <td className="py-1.5 pr-3">{r.regionName}</td>
                <td className="py-1.5 pr-3 text-right font-mono">
                  {r.productionTotal === null ? <span className="text-gray-500">{r.productionMissing}</span> : `${(r.productionTotal / 10).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}億円`}
                </td>
                <td className="py-1.5">
                  {r.topCategory ? r.topCategory.label : <span className="text-gray-500">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-600">
        主力部門：米・野菜・果実・花き・畜産のうち、数値が出ている部門で産出額がいちばん大きいもの。「その他」は比べていない。花き・畜産などが非公表の市町村では、それを含めた本当の1位とは限らない。
      </p>
    </div>
  );
}
