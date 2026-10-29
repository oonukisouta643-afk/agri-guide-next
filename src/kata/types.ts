// 福島県59市町村の「型」：データの形
// 出典：docs/REQUIREMENTS_fukushima-kata_v0.2.md 第6章・第7章（要件定義書 v0.2）。
// src/kata/ は AgriGuide 固有のファイルを import しない（フォルダごと切り出して渡せるようにする）。
// 要件定義書の形から足したものには「（足した）」と書いている。

export type RegionId =
  | "kenpoku" | "kenchu" | "kennan" | "aizu" | "minamiaizu" | "soso" | "iwaki";

/**
 * データの種類。画面に出す数値には必ずこのバッジを付ける。
 * - official：国・県の公表値そのまま
 * - estimate：公式の値を組み合わせた計算（note に計算式）。資料がなく推測で置いた値もここに入れ、note を「推測」で始める
 * - field：現地の聞き取り（差し込み口だけ）
 * - placeholder：仮データ。値がまだ取れていないもの（value は null）もここ
 */
export type DataKind = "official" | "estimate" | "field" | "placeholder";

export type Sourced<T> = {
  value: T | null;
  kind: DataKind;
  sourceId: string;
  year?: number;
  note?: string;          // 推計なら計算式
  suppressed?: boolean;   // 統計の秘匿（「x」）
  unavailable?: boolean;  // 公表されていない（「-」「…」「観測なし」など）
};

export type Source = {
  id: string;
  title: string;
  publisher: string;
  dataYear: string;
  url: string;
  accessedAt: string;     // ISO日付
  license?: string;       // 利用条件
  usedFor?: string;       // （足した）どの項目に使っているか
};

export type Region = {
  id: RegionId;
  name: string;
  municipalityIds: string[];
  newFarmers: Sourced<number>;
};

export type ProductionCategory =
  | "rice" | "vegetables" | "fruits" | "flowers" | "livestock" | "other";

/** （足した）産地の目印の種類。fruitPlan＝県の果樹農業振興計画の産地協議会 */
export type BrandKind = "gi" | "designated" | "fruitPlan" | "trademark" | "local";

export type Brand = {
  name: string;
  kind: BrandKind;
  sourceId: string;
  item?: string;   // （足した）品目
  scope?: string;  // （足した）範囲（「全域」「一部（…）」）
  asOf?: string;   // （足した）登録日・時点
};

export type Municipality = {
  id: string;             // 全国地方公共団体コード（6桁）
  slug: string;           // ローマ字（例："date"＝伊達市、"koori"＝桑折町）
  name: string;
  kana: string;           // ひらがな（総務省「全国地方公共団体コード」のカナから）
  regionId: RegionId;
  areaKm2: Sourced<number>;
  production: {
    year: number;
    unit: "千万円";       // （足した）産出額の単位
    total: Sourced<number>;
    byCategory: Record<ProductionCategory, Sourced<number>>;
    prefRank?: Sourced<number>;
  };
  brands: Brand[];
  climate: {
    stationName: string;
    stationDistanceKm: number;
    stationInMunicipality: boolean; // （足した）観測所が市町村の中にあるか
    annualMeanTempC: Sourced<number>;
    annualPrecipMm: Sourced<number>;
    annualSunshineH: Sourced<number>;
    maxSnowDepthCm: Sourced<number>;
  };
  workforce: {
    censusYear: 2020 | 2025;
    coreWorkers: Sourced<number>;
    coreWorkersAvgAge: Sourced<number>;
    coreWorkersOver65Ratio: Sourced<number>;
    successorSecuredRatio: Sourced<number>;
    farmedAreaHa: Sourced<number>;
  };
  farmlandConsolidationRate: Sourced<number>;
  contact: { label: string; url: string }; // 市町村の公式サイト
  extensions?: MunicipalityExtensions;     // 差し込み口（第7章）
};

export type CropId = "momo" | "budou" | "nashi" | "ringo";

/**
 * 道のりの1年分（すべて円、選んだ面積の合計）。
 * 要件定義書の { year, revenue, cost, income } に、内訳を足した。
 */
export type YearPoint = {
  year: number;
  yieldRatio: number;        // （足した）成園に対する収量の割合
  yieldKg: number;           // （足した）
  revenue: number;           // 販売額
  cost: number;              // 経営費（地代を含まない）
  rent: number;              // （足した）地代
  income: number;            // 農業所得＝販売額−経営費−地代
  oneTimeCost: number;       // （足した）初期投資・譲り受けの一時金
  cashBeforeSupport: number; // （足した）農業所得−一時の費用（補助金・支援は入れない）
};

export type CropRoadmap = {
  id: CropId;
  name: string;
  variety: string;                 // （足した）代表品種
  perTenA: {
    yieldKg: Sourced<number>;
    laborHours: Sourced<number>;
    unitPriceYenPerKg: Sourced<number>;
    costYen: Sourced<number>;
  };
  yearsToFirstHarvest: Sourced<number>;
  yearsToFullProduction: Sourced<number>;
  initialInvestmentPerTenA: Sourced<number>;
  mainMunicipalityIds: string[];   // 産出額などから選ぶ。選び方を mainMunicipalitiesNote に書く
  mainMunicipalitiesNote: string;  // （足した）
  extensions?: CropExtensions;     // 差し込み口（第7章）
};

// ---- 差し込み口（第7章）。今回は中身を入れない。空のときは画面に何も出さない ----

export type FieldNote = {
  id: string;
  title: string;
  body: string;
  kind: "field";
  collectedBy: string;      // 例："ふくのう"
  collectedAt: string;      // ISO日付
  respondents: number;      // 聞き取りの人数
  consentToPublish: boolean; // false はビルドに含めない
};

export type MunicipalityExtensions = {
  fieldNotes?: FieldNote[];         // 地域の実情・受け入れの様子など
  localContacts?: { label: string; url: string }[];
};

export type CropExtensions = {
  fieldNotes?: FieldNote[];
  actualIncomeSamples?: { year: number; incomeYen: number; areaA: number; kind: "field" }[];
};
