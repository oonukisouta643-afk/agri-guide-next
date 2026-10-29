// 型のデータの読み口。ページはここから読む（JSON を直接 import しない）。
// src/kata/data/*.json は `npm run kata:import` で作る。手で書き換えない。
import type {
  CropId, CropRoadmap, FieldNote, Municipality, ProductionCategory, Region, RegionId, Source, Sourced,
} from "./types";
import regionsJson from "./data/regions.json";
import municipalitiesJson from "./data/municipalities.json";
import sourcesJson from "./data/sources.json";
import cropsJson from "./data/crops.json";

export const regions = regionsJson as Region[];
export const sources = sourcesJson as Source[];

/** 公開の了承がない聞き取り（consentToPublish === false）は、ここで落としてビルドに含めない */
const publishable = (notes?: FieldNote[]) => notes?.filter((n) => n.consentToPublish === true);

export const municipalities: Municipality[] = (municipalitiesJson as Municipality[]).map((m) => ({
  ...m,
  extensions: m.extensions && { ...m.extensions, fieldNotes: publishable(m.extensions.fieldNotes) },
}));

export const crops: CropRoadmap[] = (cropsJson as CropRoadmap[]).map((c) => ({
  ...c,
  extensions: c.extensions && { ...c.extensions, fieldNotes: publishable(c.extensions.fieldNotes) },
}));

export const PRODUCTION_CATEGORIES: { id: ProductionCategory; label: string }[] = [
  { id: "rice", label: "米" },
  { id: "vegetables", label: "野菜" },
  { id: "fruits", label: "果実" },
  { id: "flowers", label: "花き" },
  { id: "livestock", label: "畜産" },
  { id: "other", label: "その他" },
];

export const getRegion = (id: string) => regions.find((r) => r.id === id);
export const getMunicipality = (regionId: string, slug: string) =>
  municipalities.find((m) => m.regionId === regionId && m.slug === slug);
export const getMunicipalityById = (id: string) => municipalities.find((m) => m.id === id);
export const getCrop = (id: string) => crops.find((c) => c.id === (id as CropId));
export const getSource = (id: string) => sources.find((s) => s.id === id);
export const regionName = (id: RegionId) => getRegion(id)?.name ?? id;

/** 数値として比べられる値か（秘匿・データなし・未取得は比較から外す） */
export const hasValue = (s: Sourced<number>): s is Sourced<number> & { value: number } =>
  typeof s.value === "number";

/**
 * 数値が出ている部門のうち、いちばん産出額が大きい部門。
 * 秘匿・未取得の部門は比べられないので、それを含めた本当の1位とは限らない（画面に注記する）。
 */
export function topCategory(m: Municipality) {
  const entries = PRODUCTION_CATEGORIES.map((c) => ({ ...c, s: m.production.byCategory[c.id] }));
  const known = entries.filter((e) => hasValue(e.s));
  if (known.length === 0) return null;
  const top = known.reduce((a, b) => ((b.s.value as number) > (a.s.value as number) ? b : a));
  return { id: top.id, label: top.label };
}

/** 地方ごとの部門別産出額の合計（推計）。数値が出ていない市町村は足さず、名前を返す */
export function sumProduction(ms: Municipality[], pick: (m: Municipality) => Sourced<number>) {
  const included = ms.filter((m) => hasValue(pick(m)));
  const excluded = ms.filter((m) => !hasValue(pick(m)));
  const total = included.reduce((a, m) => a + (pick(m).value as number), 0);
  return { total: included.length ? total : null, excluded: excluded.map((m) => m.name) };
}

/** ページの中の placeholder（仮データ）の数 */
export function countPlaceholders(obj: unknown): number {
  if (Array.isArray(obj)) return obj.reduce((a: number, x) => a + countPlaceholders(x), 0);
  if (obj && typeof obj === "object") {
    const o = obj as Record<string, unknown>;
    if (o.kind === "placeholder" && "sourceId" in o) return 1;
    return Object.values(o).reduce((a: number, x) => a + countPlaceholders(x), 0);
  }
  return 0;
}
