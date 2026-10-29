// npm run kata:validate
// src/kata/data/*.json と src/kata/roadmap.ts を確かめる（要件定義書 v0.2 第9章）。1つでも問題があれば終了コード1。
// roadmap.ts は Node の型の取り除き（Node 22.18 以降・23.6 以降）でそのまま読む。
import fs from "node:fs";
import path from "node:path";
import { REGIONS, CROPS } from "./spec.mjs";
import { readCsv } from "./lib.mjs";
import * as roadmap from "../../src/kata/roadmap.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DATA = path.join(ROOT, "src/kata/data");
const load = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
const regions = load("regions.json");
const municipalities = load("municipalities.json");
const sources = load("sources.json");
const crops = load("crops.json");
const expected = load("roadmap-expected.json");

const errors = [];
const err = (msg) => errors.push(msg);

// ---- 第3章との一致 ----
if (municipalities.length !== 59) err(`市町村が ${municipalities.length} 件（59件のはず）`);
if (regions.length !== 7) err(`地方が ${regions.length} 件（7件のはず）`);
const byId = new Map(municipalities.map((m) => [m.id, m]));
const seenIn = new Map();
for (const spec of REGIONS) {
  const r = regions.find((x) => x.id === spec.id);
  if (!r) { err(`地方 ${spec.id} がない`); continue; }
  if (r.name !== spec.name) err(`地方 ${spec.id} の名前が「${r.name}」（第3章は「${spec.name}」）`);
  const names = r.municipalityIds.map((id) => byId.get(id)?.name ?? `（不明なID ${id}）`);
  if (names.join() !== spec.municipalities.join()) err(`${spec.name} の市町村が第3章と違う：${names.join("、")}`);
  for (const id of r.municipalityIds) {
    if (seenIn.has(id)) err(`${id} が ${seenIn.get(id)} と ${spec.name} の両方にある`);
    seenIn.set(id, spec.name);
    if (byId.get(id) && byId.get(id).regionId !== spec.id) err(`${byId.get(id).name} の regionId が ${byId.get(id).regionId}`);
  }
}
for (const m of municipalities) {
  if (!seenIn.has(m.id)) err(`${m.name} がどの地方にも入っていない`);
  if (!/^07\d{4}$/.test(m.id)) err(`${m.name} の ID「${m.id}」が福島県の6桁コードでない`);
  if (!/^[ぁ-ゖ]+$/.test(m.kana)) err(`${m.name} のふりがな「${m.kana}」がひらがなでない`);
  if (!/^[a-z]+$/.test(m.slug)) err(`${m.name} の slug「${m.slug}」`);
}
const slugs = municipalities.map((m) => `${m.regionId}/${m.slug}`);
if (new Set(slugs).size !== slugs.length) err("slug が重なっている");
if (new Set(municipalities.map((m) => m.id)).size !== 59) err("市町村IDが重なっている");

// ---- Sourced の決まり ----
const sourceIds = new Set(sources.map((s) => s.id));
if (sourceIds.size !== sources.length) err("出典の id が重なっている");
for (const s of sources) {
  if (!/^https?:\/\//.test(s.url)) err(`出典 ${s.id} の URL「${s.url}」`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.accessedAt)) err(`出典 ${s.id} の accessedAt「${s.accessedAt}」`);
}
const KINDS = new Set(["official", "estimate", "field", "placeholder"]);
function walk(obj, where, visit) {
  if (Array.isArray(obj)) obj.forEach((x, i) => walk(x, `${where}[${i}]`, visit));
  else if (obj && typeof obj === "object") {
    if ("sourceId" in obj) visit(obj, where);
    for (const [k, v] of Object.entries(obj)) walk(v, `${where}.${k}`, visit);
  }
}
const RANGES = [
  [/Ratio$|Rate$/, 0, 1], [/annualMeanTempC$/, -5, 25], [/annualPrecipMm$/, 300, 5000],
  [/annualSunshineH$/, 500, 3000], [/maxSnowDepthCm$/, 0, 500], [/coreWorkersAvgAge$/, 30, 90],
  [/areaKm2$/, 1, 2000], [/stationDistanceKm$/, 0, 60],
];
function checkSourced(s, where) {
  if (!sourceIds.has(s.sourceId)) err(`${where}：sourceId「${s.sourceId}」が出典にない`);
  if (!("value" in s)) return; // brands など、値のない出典つきの行
  if (!KINDS.has(s.kind)) err(`${where}：kind「${s.kind}」`);
  if (s.value === null && !s.suppressed && !s.unavailable && s.kind !== "placeholder") {
    err(`${where}：value が null なのに suppressed・unavailable・placeholder のどれでもない`);
  }
  if (s.value !== null && (s.suppressed || s.unavailable)) err(`${where}：値があるのに suppressed か unavailable`);
  if (s.value !== null && typeof s.value === "number") {
    if (!Number.isFinite(s.value)) err(`${where}：数でない`);
    for (const [re, lo, hi] of RANGES) if (re.test(where) && (s.value < lo || s.value > hi)) err(`${where}：${s.value} が ${lo}〜${hi} の外`);
  }
  if (s.kind === "estimate" && !s.note) err(`${where}：推計なのに計算式（note）がない`);
}
const all = { regions, municipalities, crops };
walk(all, "data", checkSourced);
for (const m of municipalities) {
  const d = m.climate.stationDistanceKm;
  if (!(d >= 0 && d <= 60)) err(`${m.name}：観測所までの距離 ${d}`);
  if (!m.climate.stationName) err(`${m.name}：観測所名がない`);
}

// ---- 差し込み口 ----
function checkNotes(notes, where) {
  for (const n of notes ?? []) {
    if (n.consentToPublish !== true) err(`${where}：公開の了承がない聞き取り「${n.id}」がデータに入っている`);
    if (n.kind !== "field") err(`${where}：聞き取りの kind が field でない`);
  }
}
municipalities.forEach((m) => checkNotes(m.extensions?.fieldNotes, m.name));
crops.forEach((c) => checkNotes(c.extensions?.fieldNotes, c.name));

// ---- 道のりの計算 ----
const consts = expected.constants;
if (roadmap.RENT_YEN_PER_TEN_A !== consts.rentYenPerTenA) err(`地代の定数 ${roadmap.RENT_YEN_PER_TEN_A}（08 は ${consts.rentYenPerTenA}）`);
if (roadmap.NEW_PLANTING_COST_FLOOR !== consts.newPlantingCostFloor) err("新植の経営費の下限が 08 と違う");
if (1 - roadmap.TAKEOVER_COST_FIXED_SHARE !== consts.takeoverCostProportional) err("継承の経営費の割合が 08 と違う");
if (roadmap.TAKEOVER_ONE_TIME_YEN_PER_TEN_A !== consts.takeoverOneTimeYenPerTenA) err("継承の一時金が 08 と違う");

let checkedPoints = 0;
for (const spec of CROPS) {
  const crop = crops.find((c) => c.id === spec.id);
  if (!crop) { err(`品目 ${spec.id} がない`); continue; }
  const ramp = roadmap.NEW_PLANTING_YIELD_RATIO[spec.id];
  const first = ramp.findIndex((x) => x > 0) + 1;
  if (crop.yearsToFirstHarvest.value !== first) err(`${crop.name}：yearsToFirstHarvest ${crop.yearsToFirstHarvest.value} と立ち上がりの定数（${first}年目）が合わない`);
  const full = ramp.findIndex((x) => x >= 1);
  if ((crop.yearsToFullProduction.value ?? -1) !== (full >= 0 ? full + 1 : -1)) err(`${crop.name}：yearsToFullProduction と立ち上がりの定数が合わない`);
  for (const route of ["newPlanting", "takeover"]) {
    const exp = expected.crops[spec.id][route];
    const pts = roadmap.calcRoadmap(crop, { areaA: expected.areaA, route });
    pts.forEach((p, i) => {
      checkedPoints++;
      if (p.yieldRatio !== exp.yieldRatio[i]) err(`${crop.name} ${route} ${i + 1}年目：収量の割合 ${p.yieldRatio}（09 は ${exp.yieldRatio[i]}）`);
      // 09 は円未満を四捨五入している。0.5円のずれまで許す
      if (Math.abs(p.income - exp.income[i]) > 0.5001) err(`${crop.name} ${route} ${i + 1}年目：農業所得 ${p.income.toFixed(1)}（09 は ${exp.income[i]}）`);
      if (Math.abs(p.cashBeforeSupport - exp.cashBeforeSupport[i]) > 0.5001) err(`${crop.name} ${route} ${i + 1}年目：一時の費用を引いた後 ${p.cashBeforeSupport.toFixed(1)}（09 は ${exp.cashBeforeSupport[i]}）`);
    });
  }
  // 単価の増減は販売額だけに効く
  const base = roadmap.calcRoadmap(crop, { areaA: 10, route: "takeover" });
  const up = roadmap.calcRoadmap(crop, { areaA: 10, route: "takeover", priceDeltaPct: 10 });
  if (Math.abs(up[3].revenue - base[3].revenue * 1.1) > 1e-6 || up[3].cost !== base[3].cost) err(`${crop.name}：単価の増減の計算`);
}
let threw = false;
try { roadmap.calcRoadmap(crops[0], { areaA: 60, route: "newPlanting", years: 11 }); } catch { threw = true; }
if (!threw) err("years が範囲の外でも止まらない");

// ---- 08 の立ち上がりの割合と、roadmap.ts の定数（data-raw がある場合だけ） ----
const premisesPath = path.join(ROOT, "data-raw/open/08_果樹の試算_前提.csv");
if (fs.existsSync(premisesPath)) {
  const rows = readCsv(premisesPath);
  for (const spec of CROPS) {
    const fromCsv = rows.filter((r) => r["区分"] === "新植の収量の立ち上がり" && r["品目"] === spec.csvName).map((r) => Number(r["値"]));
    if (fromCsv.join() !== roadmap.NEW_PLANTING_YIELD_RATIO[spec.id].join()) err(`${spec.name}：新植の立ち上がりの定数が 08 と違う`);
  }
  const t = rows.filter((r) => r["区分"] === "継承した園地の収量").map((r) => Number(r["値"]));
  if (t.join() !== roadmap.TAKEOVER_YIELD_RATIO.join()) err("継承の収量の割合の定数が 08 と違う");
} else {
  console.log("（data-raw/open/08 がないので、立ち上がりの定数と 08 の照らし合わせは飛ばした。09 の答え合わせはした）");
}

// ---- placeholder の数（ページごと） ----
const count = (o) => {
  let n = 0;
  walk(o, "", (s) => { if (s.kind === "placeholder") n++; });
  return n;
};
console.log("placeholder（仮データ・未取得）の数：");
for (const r of regions) {
  const ms = municipalities.filter((m) => m.regionId === r.id);
  console.log(`  /kata/${r.id}：${count(r) + ms.reduce((a, m) => a + count(m.production), 0)}　（市町村ページ：${ms.map((m) => `${m.slug} ${count(m)}`).join("、")}）`);
}
for (const c of crops) console.log(`  /kata/crops/${c.id}：${count(c)}`);

if (errors.length) {
  console.error(`\nkata:validate：${errors.length} 件の問題`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`\nkata:validate：問題なし（市町村 ${municipalities.length}・地方 ${regions.length}・出典 ${sources.length}・品目 ${crops.length}、道のり ${checkedPoints} 点を 09 と照合）`);
