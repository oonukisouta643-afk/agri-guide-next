// npm run kata:import
// data-raw/（git管理外。人が置く）の公式ファイルから、src/kata/data/*.json を作る。
// ネットからは取りにいかない。置くファイルは src/kata/README.md「取り込みの手順」を参照。
//
// 読むもの：
//   data-raw/open/   県北ふくしまAgri-Guide「福島県59市町村 就農の地域データ」（2026年10月16日版）の CSV 01・02・03・07・08・09・11・13
//   data-raw/soumu/000925835.xlsx   総務省「全国地方公共団体コード」（令和6年1月1日現在）。ふりがなに使う
// 市町村の支援制度（04・05）は、/kata に出すかが決まっていないので読まない。
import fs from "node:fs";
import path from "node:path";
import { readCsv, readXlsxFirstSheet, kataToHira, hiraToRomaji, writeJson } from "./lib.mjs";
import { REGIONS, CROPS } from "./spec.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const RAW = path.join(ROOT, "data-raw");
const OUT = path.join(ROOT, "src/kata/data");
const OPEN_ACCESSED = "2026-10-16"; // 公開用データの時点

const csv = (name) => {
  const p = path.join(RAW, "open", name);
  if (!fs.existsSync(p)) throw new Error(`${p} がない。src/kata/README.md の手順でファイルを置く`);
  return readCsv(p);
};
const fail = (msg) => { throw new Error(msg); };

// ---------- 出典 ----------
// 13_出典一覧.csv の「項目」の書き出しで行を探し、資料名・URL を写す。
const sourceRows = csv("13_出典一覧.csv");
const fromList = (itemPrefix) =>
  sourceRows.find((r) => r["項目"].startsWith(itemPrefix)) ?? fail(`13_出典一覧.csv に「${itemPrefix}」がない`);

// 利用条件は、それぞれのサイトの利用規約のページを開いて確かめた（2026年10月30日）
const LICENSE_CHECKED = "2026年10月30日";
// ページに書いてあるのは「権利表記の記載がない限り PDL1.0 に準拠」。個々の資料（PDF・Excel）に別の権利表記がないかは見ていない
const pdl = (page) =>
  `サイトの決まりでは、権利表記の記載がない限り公共データ利用規約（第1.0版）（PDL1.0）に準拠。出典の記載と、加工したときはそのことの記載が要る。${page} で確かめた（${LICENSE_CHECKED}）。この資料そのものに別の権利表記がないかは確かめていない`;
const LICENSE_MAFF = pdl("農林水産省「リンクについて・著作権」https://www.maff.go.jp/j/use/link.html");
const LICENSE_TOHOKU = pdl("東北農政局「リンクについて・著作権」https://www.maff.go.jp/tohoku/use/riyou.html");
const LICENSE_JMA = pdl("気象庁「気象庁ホームページについて」の利用規約 https://www.jma.go.jp/jma/kishou/info/coment.html");
const LICENSE_SOUMU = pdl("総務省「当省ホームページについて」の著作権について https://www.soumu.go.jp/menu_kyotsuu/policy/tyosaku.html");
// 福島県：オープンデータ（CC BY 2.1）はバナーのあるページ・データだけ（https://www.pref.fukushima.lg.jp/sec/11045a/open-data-top.html ）。
// それ以外は「リンク・著作権・免責事項などについて」により著作権の対象で、著作権法で認められた範囲（引用など）で使う。
const PREF_RULE = "福島県ホームページ「リンク・著作権・免責事項などについて」https://www.pref.fukushima.lg.jp/sec/01010d/koho-chosakuken.html により著作権の対象（私的使用・引用など著作権法で認められた範囲で利用できる）";
const licensePref = (bannerPage) => bannerPage
  ? `${PREF_RULE}。資料を置いているページ（${bannerPage}）に福島県オープンデータ（CC BY 2.1）の表示はない。この型では数値だけを出典つきで使っている（${LICENSE_CHECKED}確認）`
  : `${PREF_RULE}。資料を置いているページは見つけられず、オープンデータの表示があるかは確かめられていない。この型では数値だけを出典つきで使っている（${LICENSE_CHECKED}確認）`;
const LICENSE_NAGANO = `長野県「このサイトの考え方」の著作権について https://www.pref.nagano.lg.jp/koho/kensei/koho/homepage/riyo.html により著作権の対象（私的使用・引用など著作権法で認められた範囲で利用できる）。資料を置いているページ https://www.pref.nagano.lg.jp/nogi/keiei/keiei_list.html にオープンデータの表示はない。PDF そのものの権利表記は確かめていない。この型では数値だけを出典つきで使っている（${LICENSE_CHECKED}確認）`;

const sourceDefs = [
  { id: "pref-yakuba", item: "市町村の一覧", publisher: "福島県", dataYear: "2026年1月22日更新", usedFor: "市町村の一覧・地方の区分・公式サイト", license: `ページの本文は${PREF_RULE}。ページに置かれた一覧のデータファイル（市役所・町村役場一覧）には福島県オープンデータ（CC BY 2.1）の表示がある。公開用データの値が本文とデータファイルのどちらから取ったものかは記録がない（${LICENSE_CHECKED}確認）` },
  { id: "pref-code", item: "団体コード", publisher: "福島県", dataYear: "掲載時点", usedFor: "市町村ID（全国地方公共団体コード）。2026年10月28日にページの59件と一致することを確かめた", accessedAt: "2026-10-28", license: licensePref("このページ") },
  { id: "soumu-code", title: "総務省「全国地方公共団体コード」（都道府県コード及び市区町村コード）", url: "https://www.soumu.go.jp/denshijiti/code.html", publisher: "総務省", dataYear: "令和6年1月1日現在", usedFor: "ふりがな（市区町村名のカナ）。ローマ字の slug はこのカナから機械的に作った", accessedAt: "2026-10-28", license: LICENSE_SOUMU },
  { id: "area", item: "総面積", publisher: "福島県（元：国土地理院）", dataYear: "2025年10月1日または2022年10月1日", usedFor: "総面積", license: licensePref("第140回福島県統計年鑑 https://www.pref.fukushima.lg.jp/sec/11045b/nenkan140.html") },
  { id: "maff-production-r5", item: "農業産出額", publisher: "農林水産省 東北農政局", dataYear: "令和5年（2023年）", usedFor: "農業産出額（合計・部門別）", license: LICENSE_TOHOKU },
  { id: "census-2020", item: "農業経営体数", publisher: "福島県", dataYear: "2020年（農林業センサス）", usedFor: "経営耕地面積", license: licensePref("2020年農林業センサス農林業経営体調査結果 https://www.pref.fukushima.lg.jp/sec/11045b/nourin2020.html") },
  { id: "tohoku-age-2020", item: "基幹的農業従事者の平均年齢", publisher: "農林水産省 東北農政局", dataYear: "2020年（農林業センサス）", usedFor: "基幹的農業従事者の平均年齢", license: LICENSE_TOHOKU },
  { id: "tohoku-successor-2020", item: "後継者がいる", publisher: "農林水産省 東北農政局", dataYear: "2020年（農林業センサス）", usedFor: "後継者を確保している経営体の割合", license: LICENSE_TOHOKU },
  { id: "tohoku-consolidation", item: "耕地面積・担い手", publisher: "農林水産省 東北農政局", dataYear: "2026年3月末", usedFor: "担い手への農地集積率", license: LICENSE_TOHOKU },
  { id: "jma-normals", item: "気候の平年値", publisher: "気象庁", dataYear: "平年値（1991〜2020年）", usedFor: "年平均気温・年降水量・日照時間・最深積雪", license: LICENSE_JMA },
  { id: "gi", item: "地理的表示", publisher: "農林水産省", dataYear: "登録日は産品ごと", usedFor: "産地の目印（GI）", license: `${LICENSE_MAFF}。GIマークの表示は地理的表示法による制約があり、この型では使っていない` },
  { id: "vegetable-designated", item: "野菜指定産地", publisher: "農林水産省 東北農政局", dataYear: "2026年8月3日現在", usedFor: "産地の目印（野菜指定産地）", license: LICENSE_TOHOKU },
  { id: "fruit-plan-councils", item: "果樹産地協議会", publisher: "福島県", dataYear: "令和8年3月（案）", usedFor: "産地の目印（果樹産地協議会）、品目ページの主な産地", license: licensePref(null) },
  { id: "aizu-brands", item: "会津のブランド", publisher: "福島県 会津農林事務所", dataYear: "2021年3月", usedFor: "産地の目印（その他のブランド）", license: licensePref(null) },
  { id: "trademark-asparagus", item: "地域団体商標", publisher: "福島県", dataYear: "令和5年5月10日", usedFor: "産地の目印（地域団体商標）", license: licensePref(null) },
  { id: "pref-new-farmers", item: "新規就農者数", publisher: "福島県 農業担い手課", dataYear: "令和8年度調査（2026年9月15日公表）", usedFor: "地方別の新規就農者数", license: `${licensePref(null)}。参考：前年の「令和7年度の新規就農者数について」https://www.pref.fukushima.lg.jp/sec/36021c/sinkisyunou07.html にはオープンデータの表示はない` },
  { id: "pref-fruit-plan", item: "成園の収量・年間労働時間", publisher: "福島県", dataYear: "令和8年3月", usedFor: "果樹の成園10aあたりの収量・労働時間", license: licensePref("福島県果樹農業振興計画 https://www.pref.fukushima.lg.jp/sec/36035c/kajushinkou.html") },
  { id: "nagano-indicators", item: "10a当たりの単価", title: "長野県「作目別経営指標一覧表」（令和4年版と推定）", url: "https://www.pref.nagano.lg.jp/nogi/keiei/documents/r4keieishihyoulist.pdf", publisher: "長野県", dataYear: "令和4年版と推定", usedFor: "果樹の単価・経営費（福島県の果樹の経営指標が見つからないため仮に使用。福島の値ではない）", license: LICENSE_NAGANO },
  { id: "agriguide-open-08", item: "収量の立ち上がり", title: "県北ふくしまAgri-Guide「福島県59市町村 就農の地域データ」08_果樹の試算_前提（2026年10月16日版）", url: "https://www.fukushima-agri-guide.jp", publisher: "県北ふくしまAgri-Guide", dataYear: "2026年10月16日版", usedFor: "道のりの前提（収量の立ち上がり・地代・経営費の割合・初期投資）と計算のしかた。項目ごとの根拠は 08 の根拠・出典の列", license: "CC BY 4.0（まとめた部分）。元の数値はそれぞれの出典の利用条件による" },
];

const sources = sourceDefs.map((d) => {
  const row = d.item ? fromList(d.item) : null;
  const url = d.url ?? row["URL"].split(" ／ ")[0].trim();
  if (!/^https?:\/\//.test(url)) fail(`${d.id}: URL がない（${url}）`);
  return {
    id: d.id,
    title: d.title ?? row["資料"],
    publisher: d.publisher,
    dataYear: d.dataYear,
    url,
    accessedAt: d.accessedAt ?? OPEN_ACCESSED,
    ...(d.license ? { license: d.license } : {}),
    usedFor: d.usedFor,
  };
});
const sourceByUrl = (url) => {
  if (url.startsWith("https://www.maff.go.jp/j/shokusan/gi_act/register/")) return "gi";
  const s = sources.find((x) => x.url === url);
  return s ? s.id : fail(`産地の目印の URL に対応する出典がない：${url}`);
};

// ---------- 値の読み方 ----------
const NUM = /^-?\d+(\.\d+)?$/;
function sourced(raw, sourceId, extra = {}) {
  const v = (raw ?? "").trim();
  const base = { sourceId, ...extra };
  if (NUM.test(v)) return { value: Number(v), kind: extra.kind ?? "official", ...base };
  delete base.kind;
  if (v === "未取得") return { value: null, kind: "placeholder", ...base, note: "未取得（公開されている資料から、まだ取れていない）" };
  if (v === "x") return { value: null, kind: "official", ...base, suppressed: true, note: "秘匿（個々の経営が分かってしまうため非公表）" };
  if (v === "-" || v === "…" || v === "—") return { value: null, kind: "official", ...base, unavailable: true, note: `元の資料で数値が示されていない（「${v}」）` };
  if (v === "調査なし") return { value: null, kind: "official", ...base, unavailable: true, note: "避難指示の影響により調査されていない" };
  if (v === "観測なし") return { value: null, kind: "official", ...base, unavailable: true, note: "参照している観測所で、この項目を観測していない" };
  if (v === "") return { value: null, kind: "official", ...base, unavailable: true, note: "元の資料に記載がない" };
  fail(`読めない値：「${v}」（${sourceId}）`);
}
// 産出額の合計が 0 の町村（公開用データの値が 0）。元の資料の表記が 0 なのかは確かめていないので、そう書いておく
const zeroNote = (s) => (s.value === 0 ? { ...s, note: "公開用データの値が 0（単位は千万円）。元の資料で 0 と書かれているのか、ほかの表記の代わりかは確かめていない" } : s);
const notYet = (sourceId, what) => ({ value: null, kind: "placeholder", sourceId, note: `未取得（${what}。Phase 2 で取り込む）` });

// ---------- ふりがな（総務省） ----------
const soumuPath = path.join(RAW, "soumu", "000925835.xlsx");
if (!fs.existsSync(soumuPath)) fail(`${soumuPath} がない。src/kata/README.md の手順でファイルを置く`);
const soumu = new Map();
for (const r of readXlsxFirstSheet(soumuPath)) {
  if (/^07\d{4}$/.test(r.A ?? "") && r.C) soumu.set(r.A, { name: r.C, kana: kataToHira(r.E) });
}

// ---------- 市町村 ----------
const base = csv("01_市町村の基本データ.csv");
const main = new Map(csv("02_主力品目.csv").map((r) => [r["市町村"], r]));
const marks = csv("03_産地の目印.csv");
const regionIdByName = new Map(REGIONS.map((r) => [r.name, r.id]));
const BRAND_KIND = { GI: "gi", 野菜指定産地: "designated", 果樹産地計画: "fruitPlan", 地域団体商標: "trademark", その他: "local" };

const municipalities = base.map((r) => {
  const name = r["市町村"];
  const id = r["団体コード"];
  const regionId = regionIdByName.get(r["地方"]) ?? fail(`${name}：地方「${r["地方"]}」が第3章にない`);
  const s = soumu.get(id) ?? fail(`${name}（${id}）が総務省の表にない`);
  if (s.name !== name) fail(`${id}：名前が違う（公開用データ「${name}」、総務省「${s.name}」）`);
  const suffix = { 市: "し", 町: "まち", 村: "むら" }[name.at(-1)];
  if (!suffix || !s.kana.endsWith(suffix)) fail(`${name}：ふりがな「${s.kana}」の終わりが「${suffix}」でない`);
  const slug = hiraToRomaji(s.kana.slice(0, -suffix.length));

  const m2 = main.get(name) ?? fail(`02 に ${name} がない`);
  const dist = r["役場から参照観測所までの距離"].match(/^([\d.]+)km(（市町村内）)?$/) ?? fail(`${name}：距離が読めない`);
  const areaDate = r["面積の基準日"];
  const climateNote = r["気候データの確認状況"] === "第三者サイト"
    ? "気象庁の平年値を転載しているサイトで確かめた値（気象庁の原典との照合はまだ）"
    : undefined;
  const climate = (col) => sourced(r[col], "jma-normals", climateNote ? { note: climateNote } : {});
  const prod = (col) => sourced(r[col], "maff-production-r5", { year: 2023 });

  return {
    id,
    slug,
    name,
    kana: s.kana,
    regionId,
    areaKm2: sourced(r["総面積(km²)"], "area", { year: Number(areaDate.slice(0, 4)), note: `基準日 ${areaDate}` }),
    production: {
      year: 2023,
      unit: "千万円",
      total: zeroNote(prod("農業産出額 合計(千万円,R5)")),
      byCategory: {
        rice: prod("産出額 米(千万円,R5)"),
        vegetables: prod("産出額 野菜(千万円,R5)"),
        fruits: prod("産出額 果実(千万円,R5)"),
        flowers: prod("産出額 花き(千万円,R5)"),
        livestock: prod("産出額 畜産(千万円,R5)"),
        other: notYet("maff-production-r5", "公開用データに「その他」の列がない"),
      },
      prefRank: sourced(m2["県内順位(R5)"], "maff-production-r5", {
        kind: "estimate", year: 2023, note: "令和5年の農業産出額（合計）を59市町村で大きい順に並べた順位（公開用データ02）",
      }),
    },
    brands: marks.filter((b) => b["市町村"] === name).map((b) => ({
      name: b["名称"],
      kind: BRAND_KIND[b["種類"]] ?? fail(`03 の種類「${b["種類"]}」が分からない`),
      sourceId: sourceByUrl(b["URL"]),
      ...(b["品目"] ? { item: b["品目"] } : {}),
      ...(b["範囲"] ? { scope: b["範囲"] } : {}),
      ...(b["時点"] ? { asOf: b["時点"] } : {}),
    })),
    climate: {
      stationName: r["参照観測所"],
      stationDistanceKm: Number(dist[1]),
      stationInMunicipality: Boolean(dist[2]),
      annualMeanTempC: climate("年平均気温(℃,平年値1991-2020)"),
      annualPrecipMm: climate("年降水量(mm,平年値)"),
      annualSunshineH: climate("年間日照時間(h,平年値)"),
      maxSnowDepthCm: climate("最深積雪(cm,平年値)"),
    },
    workforce: {
      censusYear: 2020,
      coreWorkers: notYet("census-2020", "基幹的農業従事者数は公開用データにない"),
      coreWorkersAvgAge: sourced(r["基幹的農業従事者の平均年齢(歳,2020)"], "tohoku-age-2020", { year: 2020 }),
      coreWorkersOver65Ratio: notYet("census-2020", "65歳以上の割合は公開用データにない"),
      successorSecuredRatio: sourced(r["後継者がいる経営体の割合(2020)"], "tohoku-successor-2020", { year: 2020 }),
      farmedAreaHa: sourced(r["経営耕地面積(ha,2020)"], "census-2020", { year: 2020 }),
    },
    farmlandConsolidationRate: sourced(r["集積率(2026年3月末)"], "tohoku-consolidation", { year: 2026, note: "2026年3月末" }),
    contact: { label: `${name}の公式サイト`, url: r["公式サイト"] || fail(`${name}：公式サイトがない`) },
  };
});

// 第3章の並びに合わせる
const order = REGIONS.flatMap((r) => r.municipalities);
municipalities.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

// ---------- 地方 ----------
const regionRows = new Map(csv("07_地方別.csv").map((r) => [r["地方"], r]));
const regions = REGIONS.map((spec) => ({
  id: spec.id,
  name: spec.name,
  municipalityIds: spec.municipalities.map((n) => (municipalities.find((m) => m.name === n) ?? fail(`${n} が 01 にない`)).id),
  newFarmers: sourced(regionRows.get(spec.name)?.["新規就農者数(人) 令和8年度調査"], "pref-new-farmers", {
    year: 2026, note: "令和8年度調査（2026年9月15日公表）。市町村別は公表されていない",
  }),
}));

// ---------- 品目 ----------
const premises = csv("08_果樹の試算_前提.csv");
const premise = (crop, item) => {
  const row = premises.find((r) => r["品目"] === crop && r["項目"] === item) ?? fail(`08 に ${crop}「${item}」がない`);
  return { value: Number(row["値"]), raw: row["値"], basis: row["根拠・出典"] };
};
const labor = csv("11_果樹の年間労働時間.csv");
const councils = marks.filter((b) => b["種類"] === "果樹産地計画");

const crops = CROPS.map((c) => {
  const yieldKg = premise(c.csvName, "成園の収量");
  const naganoYield = premise(c.csvName, "長野の指標の収量");
  const naganoCost = premise(c.csvName, "長野の指標の経営費");
  const cost = premise(c.csvName, "福島の収量に合わせた経営費");
  const price = premise(c.csvName, "単価");
  const invest = premise(c.csvName, "新植の初期投資");
  const variety = premises.find((r) => r["品目"] === c.csvName && r["項目"] === "代表品種")["値"];
  const laborRow = labor.find((r) => r["品種"] === c.laborVariety) ?? fail(`11 に ${c.laborVariety} がない`);
  const ramp = premises
    .filter((r) => r["区分"] === "新植の収量の立ち上がり" && r["品目"] === c.csvName)
    .map((r) => Number(r["値"]));
  const first = ramp.findIndex((x) => x > 0);
  const full = ramp.findIndex((x) => x >= 1);
  const investGuess = /初期投資[^。]*推測|推測（棚/.test(invest.basis);
  const mainIds = councils.filter((b) => b["品目"].split("・").includes(c.name)).map((b) => municipalities.find((m) => m.name === b["市町村"]).id);

  return {
    id: c.id,
    name: c.name,
    variety,
    perTenA: {
      yieldKg: { value: yieldKg.value, kind: "official", sourceId: "pref-fruit-plan", note: `成園10aあたり（${variety}）` },
      laborHours: { value: Number(laborRow["福島県(h/10a)"]), kind: "official", sourceId: "pref-fruit-plan", note: `成園10aあたりの年間労働時間（${c.laborVariety}、県調べ）` },
      unitPriceYenPerKg: { value: price.value, kind: "estimate", sourceId: "nagano-indicators", note: "長野県の作目別経営指標の単価をそのまま使用（福島の値ではない）" },
      costYen: {
        value: cost.value, kind: "estimate", sourceId: "nagano-indicators",
        note: naganoYield.value === yieldKg.value
          ? `長野県の作目別経営指標の経営費（${naganoCost.raw}円/10a）。福島の値ではない`
          : `長野県の経営費 ${naganoCost.raw}円/10a ×（0.5＋0.5×福島の収量${yieldKg.raw}kg÷長野の収量${naganoYield.raw}kg）。経営費の半分を収量に比例させた。福島の値ではない`,
      },
    },
    yearsToFirstHarvest: { value: first + 1, kind: "estimate", sourceId: "agriguide-open-08", note: `新植の収量の立ち上がり（${ramp.join("、")}）で、初めて収量が出る年` },
    yearsToFullProduction: full >= 0
      ? { value: full + 1, kind: "estimate", sourceId: "agriguide-open-08", note: "新植の収量の立ち上がりで、成園並み（割合1）になる年" }
      : { value: null, kind: "estimate", sourceId: "agriguide-open-08", unavailable: true, note: `試算の${ramp.length}年の中では成園並みにならない（${ramp.length}年目で${ramp.at(-1)}）` },
    initialInvestmentPerTenA: {
      value: invest.value, kind: "estimate", sourceId: "agriguide-open-08",
      note: investGuess ? "推測（公開用データ08の根拠の列を参照）" : "公開用データ08の根拠の列を参照",
    },
    mainMunicipalityIds: [...new Set(mainIds)],
    mainMunicipalitiesNote: `福島県「果樹農業振興計画書（案）」令和8年3月の果樹産地協議会のうち、対象品目に「${c.name}」を挙げている協議会に入っている市町村（公開用データ03）。産出額の大きさの順ではない`,
  };
});

// ---------- 道のりの答え合わせ用（09 の 60a の値） ----------
const tenYears = csv("09_果樹の試算_60aの10年.csv");
const yearsOf = (row) => Array.from({ length: 10 }, (_, i) => Number(row[`${i + 1}年目`]));
const expected = {
  areaA: 60,
  note: "公開用データ09（2026年10月16日版）の値。円未満は四捨五入。kata:validate で calcRoadmap の結果と照らし合わせる",
  crops: Object.fromEntries(CROPS.map((c) => {
    const pick = (route, item) => {
      const row = tenYears.find((r) => r["品目"].startsWith(c.csvName) && r["始め方"] === route && r["項目"] === item) ?? fail(`09 に ${c.csvName} ${route} ${item} がない`);
      return yearsOf(row);
    };
    const routes = { newPlanting: "新植", takeover: "継承" };
    return [c.id, Object.fromEntries(Object.entries(routes).map(([k, jp]) => [k, {
      yieldRatio: pick(jp, "収量の割合"),
      income: pick(jp, "農業所得"),
      cashBeforeSupport: pick(jp, "手元に残るお金の目安（国の支援・経営開始資金を除く）"),
    }]))];
  })),
  // 08 の共通の前提（roadmap.ts の定数と照らし合わせる）
  constants: {
    rentYenPerTenA: Number(premises.find((r) => r["項目"] === "地代(円/10a/年)")["値"]),
    newPlantingCostFloor: Number(premises.find((r) => r["項目"].startsWith("育成中の経営費の下限"))["値"]),
    takeoverCostProportional: Number(premises.find((r) => r["項目"] === "経営費のうち収量に比例する割合")["値"]),
    takeoverOneTimeYenPerTenA: Number(premises.find((r) => r["項目"].startsWith("継承するときの樹体・設備の一時金"))["値"]),
  },
};

fs.mkdirSync(OUT, { recursive: true });
writeJson(path.join(OUT, "sources.json"), sources);
writeJson(path.join(OUT, "regions.json"), regions);
writeJson(path.join(OUT, "municipalities.json"), municipalities);
writeJson(path.join(OUT, "crops.json"), crops);
writeJson(path.join(OUT, "roadmap-expected.json"), expected);
console.log(`kata:import：出典 ${sources.length}、地方 ${regions.length}、市町村 ${municipalities.length}、品目 ${crops.length} を src/kata/data/ に書いた`);
