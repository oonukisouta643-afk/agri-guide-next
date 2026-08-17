import { regions, type Region } from "@/data/regions";
import { similarCases, type SimilarCase } from "@/data/similarCases";
import type { CropKey, SimulatorState } from "./types";
import { questions } from "./questions";

// 就農シミュレーター：結果画面の計算ロジック
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6

// ---------------------------------------------------------------------------
// ① KPIサマリー・② 補助金リスト
// ---------------------------------------------------------------------------

export type SubsidyBadge = "ok" | "warn" | "req";

export type SubsidyItem = {
  name: string;
  amountText: string;
  badge: SubsidyBadge;
  note: string;
};

export type FundingResult = {
  maxSubsidyText: string;
  durationEstimateText: string;
  initialCostEstimateText: string;
  subsidyItems: SubsidyItem[];
};

export function calcFunding(s: SimulatorState): FundingResult {
  const items: SubsidyItem[] = [];
  let maxTotal = 0;

  // 基本：就農準備資金（年間150万円×最長2年）＋経営開始資金（年間150万円×最長3年）
  // 条件：50代以上（S.age === '50p'）は就農準備資金の対象外
  if (s.age !== "50p") {
    items.push({
      name: "就農準備資金",
      amountText: "年間150万円×最長2年（上限300万円）",
      badge: "ok",
      note: "研修期間中の生活費として活用できます。",
    });
    maxTotal += 300;
  }
  items.push({
    name: "農業次世代人材投資資金・経営開始資金",
    amountText: "年間150万円×最長3年（上限450万円）",
    badge: "ok",
    note: "就農直後の経営が安定するまでの支援です。",
  });
  maxTotal += 450;

  // 東京圏移住：ふくしま移住支援金（単身60万円・家族100万円）
  if (s.loc === "tokyo") {
    const isFamily = s.family !== "single";
    items.push({
      name: "ふくしま移住支援金",
      amountText: isFamily ? "100万円（世帯）" : "60万円（単身）",
      badge: "ok",
      note: "東京圏からの移住が対象です。",
    });
    maxTotal += isFamily ? 100 : 60;
  }

  // 自己資金が少ない場合：融資制度の案内（金額は個別審査のため合計には含めない）
  if (s.cap === "u100" || s.cap === "100to300") {
    items.push({
      name: "日本政策金融公庫の農業融資",
      amountText: "金額は個別審査（要相談）",
      badge: "warn",
      note: "自己資金だけで不安な場合の選択肢です。",
    });
  }

  // 地域計画早期実現支援枠：1年以内に就農予定の場合、上限600万円
  if (s.timing === "w1y") {
    items.push({
      name: "地域計画早期実現支援枠",
      amountText: "上限600万円",
      badge: "ok",
      note: "1年以内の就農を予定している方向けの枠です。",
    });
    maxTotal += 600;
  }

  // 世代交代初期投資促進事業：規模が大きい場合に案内（金額は個別のため合計には含めない）
  if (s.scale === "large") {
    items.push({
      name: "世代交代初期投資促進事業",
      amountText: "金額は個別相談",
      badge: "warn",
      note: "規模の大きい経営を検討している方向けの制度です。",
    });
  }

  // 就農期間目安：農業経験・就農希望時期から簡易的に推定（要件定義書に算出式の明記なし。目安として実装）
  let durationEstimateText = "3〜5年ほどが目安";
  if (s.exp === "train" || s.timing === "w1y") {
    durationEstimateText = "1〜2年ほどが目安";
  } else if (s.exp === "part" || s.exp === "garden" || s.timing === "w3y") {
    durationEstimateText = "2〜3年ほどが目安";
  }

  // 想定初期費用：規模から簡易的に推定（要件定義書§6結果③の通り仮データ。実データは今後精査）
  let initialCostEstimateText = "300〜500万円（仮データ）";
  if (s.scale === "mid") initialCostEstimateText = "500〜1,000万円（仮データ）";
  if (s.scale === "large") initialCostEstimateText = "1,000万円〜（仮データ）";

  return {
    maxSubsidyText: `最大${maxTotal.toLocaleString()}万円`,
    durationEstimateText,
    initialCostEstimateText,
    subsidyItems: items,
  };
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

const cropLabel: Record<string, string> = {
  momo: "桃",
  apple: "りんご",
  nashi: "梨",
  saku: "さくらんぼ",
  kyu: "きゅうり",
  rice: "米",
};

export function calcRegionMatch(s: SimulatorState): RegionMatch[] {
  const selectedCrops = s.crops.filter((c): c is CropKey => c !== "any");

  const scored = regions.map((region) => {
    const reasons: string[] = [];
    let score = 0;

    for (const crop of selectedCrops) {
      if (region.cropKeys.includes(crop)) {
        score += 3;
        reasons.push(`${cropLabel[crop] ?? crop}の産地`);
      }
    }

    if (s.family === "kids" && region.key === "otama") {
      score += 1;
      reasons.push("子育て支援が充実");
    }

    return { region, score, reasons };
  });

  // 結果画面④「地域マッチング」は要件定義書§6の表示順序一覧で「常時表示」と
  // 明記されているため、スコアが1点も付かない場合（品目未選択＝「まだ決まってい
  // ない」のみ選択、かつ子育て世帯でない等）でもトップ3地域を必ず返す。
  // （品目一致による+3点が主要な加点要素のため、スコア0のまま返るケースはある）
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
};

type TimingRule = {
  applicationSeason: string;
  urgentMonths: number[];
};

const timingRules: Partial<Record<CropKey, TimingRule>> = {
  momo: { applicationSeason: "10〜11月", urgentMonths: [9, 10, 11, 12] },
  apple: { applicationSeason: "10〜11月", urgentMonths: [9, 10, 11, 12] },
  saku: { applicationSeason: "9〜10月", urgentMonths: [8, 9, 10, 11] },
  kyu: { applicationSeason: "2〜3月", urgentMonths: [1, 2, 3] },
  rice: { applicationSeason: "2〜3月", urgentMonths: [1, 2, 3, 4] },
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
        url: "https://start-fukuagri.jp/consultation/",
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
