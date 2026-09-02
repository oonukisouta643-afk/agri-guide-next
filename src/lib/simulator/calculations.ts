import { regions, type Region } from "@/data/regions";
import { similarCases, type SimilarCase } from "@/data/similarCases";
import type { AgeKey, CropKey, FamilyKey, SimulatorState, TimingKey } from "./types";
import { questions } from "./questions";

// 就農シミュレーター：結果画面の計算ロジック
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6／agri-simulator-v4.html（旧版）buildResult()（506〜627行目）

// ---------------------------------------------------------------------------
// ① KPIサマリー・② 補助金リスト
// ---------------------------------------------------------------------------

// 旧版buildResult()のbadge値（'ok'/'req'/'no'）にあわせる。
// 「no」＝対象外であることを明示的に表示するためのバッジ（要件2：情報の欠落を防ぐ）。
export type SubsidyBadge = "ok" | "req" | "no";

export type SubsidyItem = {
  icon: string;
  name: string;
  amountText: string;
  badge: SubsidyBadge;
  /** 制度の簡単な説明 */
  note: string;
  /** 注意書き・確認事項（WarningBoxで強調表示） */
  warn?: string;
};

export type FundingResult = {
  maxSubsidyText: string;
  durationEstimateText: string;
  initialCostEstimateText: string;
  subsidyItems: SubsidyItem[];
  /** 結果ヒーロー見出し（年代・家族構成・目標年収） */
  titleText: string;
};

const ageLabelJa: Record<AgeKey, string> = {
  "20s": "20代",
  "30s": "30代",
  "40s": "40代",
  "50p": "50代以上",
};

const familyLabelJa: Record<FamilyKey, string> = {
  single: "単身",
  couple: "夫婦2人",
  kids: "子育て世帯",
};

// 旧版buildResult()の timeLbl マップをそのまま移植
const durationLabelJa: Record<TimingKey, string> = {
  w1y: "約1〜2年",
  w3y: "約2〜3年",
  o3y: "約3〜5年",
  info: "まず情報収集から",
};

// 旧版buildResult()の costMap をそのまま移植（KPI「想定初期費用」用。⑨のコスト表とは別の数値）
const initialCostByCrop: Partial<Record<CropKey, string>> = {
  momo: "80〜120万円/反",
  apple: "60〜100万円/反",
  kyu: "50〜120万円/反",
  rice: "30〜80万円/反",
};

export function calcFunding(s: SimulatorState): FundingResult {
  // 50歳以上は就農準備資金の対象外（trainOk）
  const trainOk = s.age !== "50p";
  // 東京圏・その他都市部からの移住はふくしま移住支援金の対象（fromTokyo）
  const fromTokyo = s.loc === "tokyo" || s.loc === "other";

  const items: SubsidyItem[] = [];
  let maxTotal = 0;

  // 1. 就農準備資金（研修期間中）
  items.push({
    icon: "💴",
    name: "就農準備資金（研修期間中）",
    amountText: trainOk ? "年間150万円×最長2年" : "対象外（50歳未満が条件）",
    badge: trainOk ? "ok" : "no",
    note: "農業研修機関に登録して研修中に受け取れる生活支援金。",
    warn: trainOk ? undefined : "50歳以上は対象外です。",
  });
  if (trainOk) maxTotal += 300;

  // 2. 経営開始資金（新規就農者育成総合対策）
  items.push({
    icon: "🌱",
    name: "経営開始資金（新規就農者育成総合対策）",
    amountText: trainOk ? "年間150万円×最長3年" : "対象外（原則50歳未満が条件）",
    badge: trainOk ? "req" : "no",
    note: "独立就農後に受け取れる収入補助。認定新規就農者の認定が必要。",
    warn: trainOk
      ? "認定には農業経営改善計画の提出が必要です。"
      : "50歳以上は対象外です（原則50歳未満）。",
  });
  if (trainOk) maxTotal += 450;

  // 3. 地域計画早期実現支援枠（2026年度新設・常時案内）
  items.push({
    icon: "🌾",
    name: "地域計画早期実現支援枠（2026年度新設）",
    amountText: "上限600万円（農機・施設導入等）",
    badge: "req",
    note: "認定新規就農者が地域計画に位置づけられた場合の特別枠。",
    warn: "地域計画への位置づけは農業委員会に確認してください。",
  });

  // 4. 経営発展支援事業／世代交代・初期投資促進事業（常時案内・市町村への要確認を明記）
  items.push({
    icon: "🚜",
    name: "経営発展支援事業／世代交代・初期投資促進事業",
    amountText: "機械・施設等の初期投資を支援（上限額は市町村窓口へ要確認）",
    badge: "req",
    note: "国（農林水産省）の新規就農者育成総合対策のうち、初期投資を支援する制度。実施主体は市町村。",
    warn: "金額・要件は市町村の農業担当窓口に必ず確認してください（2026年8月時点、当サイトでは正式な上限額を未確認）。",
  });

  // 5. JAふくしま未来 担い手育成給付事業（常時案内）
  items.push({
    icon: "🤝",
    name: "JAふくしま未来 担い手育成給付事業",
    amountText: "申請額の1/2以内・上限50万円",
    badge: "req",
    note: "新規就農資金・規模拡大資金・技術研修資金を対象としたJA独自の給付事業。",
    warn: "詳細はJAふくしま未来の各地区本部に確認してください。",
  });

  // 6. ふくしま移住支援金（東京圏・その他都市部からの移住のみ）
  if (fromTokyo) {
    const isSingle = s.family === "single";
    items.push({
      icon: "🏠",
      name: `ふくしま移住支援金（${isSingle ? "単身60万円" : "家族100万円"}）`,
      amountText: isSingle ? "60万円（一時金）" : "100万円（一時金）",
      badge: "ok",
      note: "東京圏からの移住に対して支給される一時金。",
      warn: "転入前に市町村窓口で必ず要件確認してください。",
    });
    maxTotal += isSingle ? 60 : 100;
  }

  // 7. 日本政策金融公庫 農業融資（常時案内・自己資金の多寡にかかわらず表示）
  items.push({
    icon: "🏦",
    name: "日本政策金融公庫 農業融資",
    amountText: "低金利（特例0%）／最大3億円",
    badge: "req",
    note: "農業者向けの低金利融資制度。まず相談だけでもOK。",
    warn: "融資申請には農業経営計画書が必要です。",
  });

  const durationEstimateText = s.timing ? durationLabelJa[s.timing] : "—";

  const mainCrop = s.crops.find((c): c is CropKey => c in initialCostByCrop);
  const initialCostEstimateText = mainCrop ? initialCostByCrop[mainCrop]! : "100〜300万円";

  const ageLbl = s.age ? ageLabelJa[s.age] : "";
  const famLbl = s.family ? familyLabelJa[s.family] : "";
  const titleText = `${ageLbl}・${famLbl}・目標年収${s.income}万円`;

  return {
    maxSubsidyText: `最大${maxTotal.toLocaleString()}万円`,
    durationEstimateText,
    initialCostEstimateText,
    subsidyItems: items,
    titleText,
  };
}

// ---------------------------------------------------------------------------
// Q4「興味品目」ライブ相性フィードバック（旧版updCropMatch()の移植）
// ---------------------------------------------------------------------------

// 2026年8月21日：以前はここで「福島県北との相性◯％」という固定値のバーを表示していたが、
// 選択肢自体が6地域の栽培品目に寄っていて、実質どの品目を選んでも高い％が出る作りだった
// （「誰が選んでも高マッチ度になるのは不自然」というフィードバック）。
// ％の演出はやめて、実際にregions.tsのcropKeysと照合した事実ベースの文言に差し替えた。
// 品目自体もstrawberry/leafy/mushroomを追加し、6地域がカバーしていない選択肢を
// 意図的に含めることで「一致しない」という正直な結果も出るようにしている。

export type CropCoverage = {
  /** 選んだ品目のうち、6地域のいずれかで実際に栽培されている品目のラベル */
  coveredLabels: string[];
  /** 選んだ品目のうち、6地域のどこも栽培していない品目のラベル */
  uncoveredLabels: string[];
  message: string;
};

export function calcCropCoverage(crops: CropKey[]): CropCoverage {
  if (crops.length === 0) {
    return {
      coveredLabels: [],
      uncoveredLabels: [],
      message: "品目を選ぶと、実際にその品目を栽培している地域があるか確認できます。",
    };
  }

  const covered = crops.filter((c) => regions.some((r) => r.cropKeys.includes(c)));
  const uncovered = crops.filter((c) => !covered.includes(c));
  const coveredLabels = covered.map((c) => cropLabel[c] ?? c);
  const uncoveredLabels = uncovered.map((c) => cropLabel[c] ?? c);

  let message: string;
  if (covered.length === 0) {
    message =
      "選んだ品目は、今回ご案内する6地域では主要な栽培品目として登録されていません。地域のおすすめは弱めになりますが、シミュレーション自体はこのまま進められます。";
  } else if (uncovered.length === 0) {
    message = `選んだ品目（${coveredLabels.join("・")}）は、ご案内する6地域のいずれかで実際に栽培されています。`;
  } else {
    message = `選んだ品目のうち「${coveredLabels.join("・")}」は6地域のいずれかで栽培実績があります。「${uncoveredLabels.join("・")}」は今回ご案内する6地域では主要品目としては登録されていません。`;
  }

  return { coveredLabels, uncoveredLabels, message };
}

// Q8「目標年収」ライブ補助金カバー率（旧版updIncome()の移植）
export function calcIncomeCoverPercent(income: number): number {
  return Math.min(95, Math.round((150 / income) * 100));
}

// ---------------------------------------------------------------------------
// ④ 地域マッチング
// ---------------------------------------------------------------------------

export type RegionMatch = {
  region: Region;
  score: number;
  reasons: string[];
  isTop: boolean;
};

const cropLabel: Record<CropKey, string> = {
  momo: "桃",
  apple: "りんご",
  nashi: "梨",
  grape: "ぶどう",
  saku: "さくらんぼ",
  kaki: "あんぽ柿",
  strawberry: "いちご",
  kyu: "きゅうり",
  tomato: "トマト",
  rice: "米",
  leafy: "葉物野菜",
  mushroom: "きのこ",
  organic: "有機農業",
  flower: "花き",
  any: "未定",
  dairy: "酪農",
  beef: "肉用牛",
  chicken: "養鶏",
};

const familyMatchLabelJa: Record<FamilyKey, string> = {
  single: "単身",
  couple: "夫婦",
  kids: "子育て世帯",
};

// 旧版buildResult()内のスコアリングロジック（692〜708行目）を移植：
// 品目一致（+3/件）・自己資金の範囲内（+2）・家族構成の適合（+1）・就農時期の適合（+1）
export function calcRegionMatch(s: SimulatorState): RegionMatch[] {
  const selectedCrops = s.crops.filter((c): c is CropKey => c !== "any");

  const scored = regions.map((region) => {
    const reasons: string[] = [];
    let score = 0;

    const cropMatches = selectedCrops.filter((crop) => region.cropKeys.includes(crop));
    if (cropMatches.length > 0) {
      score += cropMatches.length * 3;
      reasons.push(`希望品目（${cropMatches.map((c) => cropLabel[c] ?? c).join("・")}）の産地`);
    }

    if (s.cap && region.capKeys.includes(s.cap)) {
      score += 2;
      reasons.push("自己資金の範囲内で始めやすい");
    }

    if (s.family && region.familyKeys.includes(s.family)) {
      score += 1;
      reasons.push(`生活環境が${familyMatchLabelJa[s.family]}に向いている`);
    }

    if (s.timing && region.timingKeys.includes(s.timing)) {
      score += 1;
    }

    return { region, score, reasons };
  });

  // 結果画面④「地域マッチング」は要件定義書§6の表示順序一覧で「常時表示」と
  // 明記されているため、スコアが1点も付かない場合でもトップ3地域を必ず返す。
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r, i) => ({ ...r, isTop: i === 0 }));
}

// ---------------------------------------------------------------------------
// ⑤ タイミング警告
// ---------------------------------------------------------------------------

export type TimingAlert = {
  crop: string;
  cropLabel: string;
  urgent: boolean;
  seasonText: string;
  /** 品目別の詳しい警告文（<strong>タグ含む・信頼できる静的コンテンツのためHTML許容） */
  messageHtml: string;
};

type TimingRule = {
  applicationSeason: string;
  urgentMonths: number[];
  messageHtml: string;
};

// 旧版buildResult()内のtimingAlertsオブジェクト（798〜807行目）を移植。
// nashi（梨）は旧版に存在しなかったため、appleの申し込み時期を参考にした推定文言（要確認）。
const timingRules: Partial<Record<CropKey, TimingRule>> = {
  momo: {
    applicationSeason: "10〜11月",
    urgentMonths: [9, 10, 11, 12],
    messageHtml:
      "🍑 桃の研修は毎年4月スタートが多く、申し込みは前年の<strong>10〜11月締め切り</strong>がほとんどです。今から動かないと次のチャンスは約1年後になります。",
  },
  apple: {
    applicationSeason: "10〜11月",
    urgentMonths: [9, 10, 11, 12],
    messageHtml:
      "🍎 りんごの研修申し込みも秋〜冬が多く、<strong>年内に動き始める</strong>ことで来春の研修スタートに間に合います。",
  },
  nashi: {
    applicationSeason: "10〜11月",
    urgentMonths: [9, 10, 11, 12],
    messageHtml:
      "🍐 梨の研修も秋〜冬の募集が中心で、<strong>年内の相談開始</strong>が来春の研修スタートへの近道です（りんごに準じた目安・要確認）。",
  },
  saku: {
    applicationSeason: "9〜10月",
    urgentMonths: [8, 9, 10, 11],
    messageHtml:
      "🍒 さくらんぼの研修は収穫（6月）に合わせた準備が必要で、<strong>前年の秋が申し込みのタイミング</strong>です。",
  },
  kyu: {
    applicationSeason: "2〜3月",
    urgentMonths: [1, 2, 3],
    messageHtml:
      "🥒 きゅうりの夏秋作は4〜5月定植が多く、<strong>3月までに農地・資材の準備</strong>が必要です。今年の作付けを目指すなら今すぐ動く必要があります。",
  },
  rice: {
    applicationSeason: "2〜3月",
    urgentMonths: [1, 2, 3, 4],
    messageHtml:
      "🌾 米の田植えは5〜6月。<strong>農地の確保と農業委員会への申請</strong>は少なくとも3ヶ月前が目安です。",
  },
};

export function calcTimingAlerts(crops: CropKey[], currentMonth: number): TimingAlert[] {
  return crops
    .filter((c): c is keyof typeof timingRules => c in timingRules)
    .map((crop) => {
      const rule = timingRules[crop]!;
      const urgent = rule.urgentMonths.includes(currentMonth);
      return {
        crop,
        cropLabel: cropLabel[crop] ?? crop,
        urgent,
        seasonText: `募集時期の目安：${rule.applicationSeason}`,
        messageHtml: rule.messageHtml,
      };
    });
}

// ---------------------------------------------------------------------------
// ⑥ 似た条件の人カード
// ---------------------------------------------------------------------------

export function calcSimilarCase(s: SimulatorState): SimilarCase | null {
  let best: { c: SimilarCase; score: number } | null = null;

  for (const c of similarCases) {
    let score = 0;
    if (s.age === c.age) score += 1;
    if (s.family === c.family) score += 1;
    if (s.exp === c.exp) score += 1;
    if (s.crops.some((crop) => crop !== "any" && c.crops.includes(crop as CropKey))) {
      score += 1;
    }
    if (!best || score > best.score) {
      best = { c, score };
    }
  }

  if (!best || best.score < 2) return null;
  return best.c;
}

// ---------------------------------------------------------------------------
// ⑧ 次のステップ（就農意欲レベル判定・バックエンドのみ／ユーザーには見せない）
// ---------------------------------------------------------------------------

export type MotivationLevel = 1 | 2 | 3;

export function calcMotivationLevel(s: SimulatorState): MotivationLevel {
  if (s.timing === "w1y" || s.exp === "train") return 3;
  if (s.timing === "w3y" || s.exp === "part" || s.exp === "garden") return 2;
  return 1;
}

export function nextStepByLevel(level: MotivationLevel): { message: string; url: string } {
  switch (level) {
    case 3:
      return {
        message: "農業委員会への相談が次のステップです",
        url: "https://start-fukuagri.jp/procedure/",
      };
    case 2:
      return {
        message: "ふくのうへの就農相談を予約しましょう（オンライン可・無料）",
        url: "https://start-fukuagri.jp/syuno/",
      };
    default:
      return {
        message: "まずはお試し就農体験から始めてみましょう（1〜3日・無料）",
        url: "https://start-fukuagri.jp/trainee/",
      };
  }
}

// ---------------------------------------------------------------------------
// ⑪ メール相談CTA（回答データを本文に自動入力）
// ---------------------------------------------------------------------------

function findLabel(key: "timing" | "exp" | "crops" | "cap", value: string): string {
  for (const q of questions) {
    if (q.kind === "single" && q.key === key) {
      return q.options.find((o) => o.value === value)?.label ?? value;
    }
    if (q.kind === "multi" && q.key === key) {
      for (const g of q.groups) {
        const found = g.options.find((o) => o.value === value);
        if (found) return found.label;
      }
      return value;
    }
    if (q.kind === "capIncome" && q.key === key) {
      return q.options.find((o) => o.value === value)?.label ?? value;
    }
    if (q.kind === "dual" && key === "timing") {
      return q.timingOptions.find((o) => o.value === value)?.label ?? value;
    }
  }
  return value;
}

export function buildMailto(s: SimulatorState): string {
  const to = "oonukisouta643@gmail.com";
  const subject = "就農シミュレーターの結果を見て相談したいです";
  const cropsText = s.crops.map((c) => findLabel("crops", c)).join("・") || "未選択";
  const body = [
    "県北ふくしまAgri-Guideの就農シミュレーターを試しました。相談を希望します。",
    "",
    `就農時期：${s.timing ? findLabel("timing", s.timing) : "未回答"}`,
    `農業経験：${s.exp ? findLabel("exp", s.exp) : "未回答"}`,
    `希望品目：${cropsText}`,
    `自己資金：${s.cap ? findLabel("cap", s.cap) : "未回答"}`,
    `目標年収：約${s.income}万円`,
  ].join("\n");

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ---------------------------------------------------------------------------
// URLシェア機能（F-30・F-36）
// ---------------------------------------------------------------------------

export function encodeStateToParam(s: SimulatorState): string {
  const json = JSON.stringify(s);
  if (typeof window === "undefined") return Buffer.from(json).toString("base64url");
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeParamToState(param: string): SimulatorState | null {
  try {
    const base64 = param.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as SimulatorState;
  } catch {
    return null;
  }
}
