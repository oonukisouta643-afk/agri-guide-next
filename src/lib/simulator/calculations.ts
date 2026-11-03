import { regions, type Region } from "@/data/regions";
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
  /** 上限の数字が何を足したものかの説明 */
  maxSubsidyNote: string;
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

// 2026年11月1日：品目別の金額（桃80〜120万円/反など）は収益モデルの試算と食い違い、出典もなかったため外した。
// 品目ごとの初期投資は /tools#profit の試算に任せ、ここは農機・設備の仮データだけを出す。
const INITIAL_COST_TEXT = "50〜300万円";

export function calcFunding(s: SimulatorState): FundingResult {
  // 50歳以上は就農準備資金の対象外（trainOk）
  const trainOk = s.age !== "50p";
  // ふくしま移住支援金は、東京23区に住んでいた人・東京圏から23区へ通勤していた人などが対象（fromTokyo）。
  // 東京圏以外の都市部（「その他の都市部」）は対象にならない。
  // 出典：福島県「ふくしま移住支援金給付事業について」https://www.pref.fukushima.lg.jp/sec/11025b/iju.html
  // （2026年7月27日更新）。2026年10月27日に確認。
  const fromTokyo = s.loc === "tokyo";
  // 2026年11月1日：上限の合計を答えに合わせた。経営開始資金は独立・自営就農が前提で、農業法人への雇用就農は対象外。
  // 就農準備資金は雇用就農も対象で、研修を終えた人は足さない。移住支援金は条件が多いので合計に入れない。
  // 出典：農林水産省 新規就農者育成総合対策の資料。2026年11月1日に確認。
  const isHire = s.type === "hire";
  const trained = s.exp === "train";

  const items: SubsidyItem[] = [];
  const countedNames: string[] = [];
  let maxTotal = 0;

  // 1. 就農準備資金（研修期間中）
  items.push({
    icon: "💴",
    name: "就農準備資金（研修期間中）",
    amountText: trainOk ? "年間165万円×最長2年" : "対象外（50歳未満が条件）",
    badge: !trainOk ? "no" : trained ? "req" : "ok",
    note: "農業研修機関に登録して研修中に受け取れる生活支援金。令和8年度からの新規交付分は年165万円（従来は年150万円）。",
    warn: !trainOk
      ? "50歳以上は対象外です。"
      : trained
        ? "これから研修を受ける方の制度です。研修を終えている場合は、上限の合計に入れていません。"
        : undefined,
  });
  if (trainOk && !trained) {
    maxTotal += 330;
    countedNames.push("就農準備資金");
  }

  // 2. 経営開始資金（新規就農者育成総合対策）
  items.push({
    icon: "🌱",
    name: "経営開始資金（新規就農者育成総合対策）",
    amountText: !trainOk ? "対象外（原則50歳未満が条件）" : isHire ? "対象外（独立・自営就農が条件）" : "年間165万円×最長3年",
    badge: trainOk && !isHire ? "req" : "no",
    note: "独立就農後に受け取れる収入補助。認定新規就農者の認定が必要。令和8年度からの新規交付分は年165万円（従来は年150万円）。",
    warn: !trainOk
      ? "50歳以上は対象外です（原則50歳未満）。"
      : isHire
        ? "農業法人に就職する場合は対象になりません。あとで独立するときに改めて確かめてください。"
        : "認定には、青年等就農計画を市町村に提出する必要があります。",
  });
  if (trainOk && !isHire) {
    maxTotal += 495;
    countedNames.push("経営開始資金");
  }

  // 3・4. 経営発展支援事業（機械・施設の初期投資。常時案内）
  // 2026年10月27日：農水省の令和8年度の資料（hatten-57.pdf、r8kettei_pr45.pdf）と福島市の案内で、上限額と併用の可否を確認。
  // 特別枠（地域計画早期実現支援枠）は経営開始資金と併用できない。経営開始資金を受けるなら通常枠（国費上限250万円）。
  // 詳しい出典は src/data/subsidies.ts の福島県タブの sourceNote。
  items.push({
    icon: "🚜",
    name: "経営発展支援事業 通常枠（世代交代・初期投資促進事業 初期投資促進タイプ）",
    amountText: trainOk ? "国費上限500万円（経営開始資金を受ける人は上限250万円）" : "対象外（就農時49歳以下が条件）",
    badge: trainOk ? "req" : "no",
    note: "機械・施設等の初期投資を支援する国の制度。就農時49歳以下の認定新規就農者が対象で、経営開始資金と一緒に使える枠。実施主体は市町村。",
    warn: trainOk ? "補助率などは市町村の農業担当窓口に確認してください。" : "50歳以上は対象外です（就農時49歳以下が条件）。",
  });

  items.push({
    icon: "🌾",
    name: "経営発展支援事業 地域計画早期実現支援枠（世代交代・初期投資促進事業 世代交代円滑化タイプ）",
    amountText: trainOk ? "国費上限600万円（県の負担と合わせて補助は最大900万円）" : "対象外（49歳以下が条件）",
    badge: trainOk ? "req" : "no",
    note: "地域計画に位置付けられた（位置付けが確実な）49歳以下の認定新規就農者・認定農業者で、令和5年度以降に経営を始めた人などが対象。実施主体は市町村。",
    warn: trainOk
      ? "経営開始資金との併用はできません（経営開始資金を受けるなら、上の通常枠）。地域計画への位置付けは市町村・農業委員会に確認してください。"
      : "50歳以上は対象外です（49歳以下が条件）。",
  });

  // 4.5 新規就農者チャレンジ事業（令和7年度補正予算・常時案内）
  // 出典：src/data/subsidies.ts の福島県タブ（2026年9月1日に福島県農業担い手課に確認、農水省公開ページで裏付け）
  items.push({
    icon: "🏗️",
    name: "新規就農者チャレンジ事業（令和7年度補正予算）",
    amountText: "国庫補助3/10以内・上限1,500万円（個人）／3,000万円（法人）",
    badge: "req",
    note: "経営開始後5年以内の方の機械・施設整備向け。独立・自営就農時65歳未満で、青年等就農計画の認定を受けた方が対象（経営発展支援事業を使った方も、青年等就農計画の目標を達成済み、または達成できる見込みであれば利用可）。実施主体は市町村。",
    warn: "要件の詳細は市町村の農業担当窓口に確認してください。",
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

  // 6. ふくしま移住支援金（東京圏からの移住のみ）
  if (fromTokyo) {
    const isSingle = s.family === "single";
    items.push({
      icon: "🏠",
      name: `ふくしま移住支援金（${isSingle ? "単身60万円" : "家族100万円"}）`,
      amountText: isSingle ? "60万円（一時金）" : "100万円（一時金）",
      badge: "req",
      note: "東京23区に住んでいた人や、東京圏（東京・埼玉・千葉・神奈川）から23区へ通勤していた人などが移住したときに支給される一時金。",
      warn: "直近10年のうち5年以上の居住・通勤などの条件と、移住先での就業などの条件があります（自営で始める場合は、起業支援金の採択が条件になることがあります）。条件が多いので、上限の合計には入れていません。転入前に市町村窓口で必ず確認してください。",
    });
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


  const ageLbl = s.age ? ageLabelJa[s.age] : "";
  const famLbl = s.family ? familyLabelJa[s.family] : "";
  const titleText = `${ageLbl}・${famLbl}・目標年収${s.income}万円`;

  return {
    maxSubsidyText: maxTotal > 0 ? `最大${maxTotal.toLocaleString()}万円` : trainOk ? "いま足せる資金はありません" : "生活資金は対象外",
    maxSubsidyNote:
      maxTotal > 0
        ? `${countedNames.join("と")}の上限${countedNames.length > 1 ? "を足した" : "の"}目安です。条件と審査があります。`
        : trainOk
          ? "研修を終えて農業法人に就職する場合です。独立するときに改めて確かめてください。"
          : "機械・施設の制度や市町村の制度は、下の一覧で確かめてください。",
    durationEstimateText,
    initialCostEstimateText: INITIAL_COST_TEXT,
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

// 申し込みの時期と締め切りは出典が確かめられないため、確かめられるまで出さない（2026年10月27日）。
const SHOW_TIMING_ALERTS: boolean = false;

export function calcTimingAlerts(crops: CropKey[], currentMonth: number): TimingAlert[] {
  if (!SHOW_TIMING_ALERTS) return [];
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
        message: "就農支援センターへの相談を、ふくのうから申し込みましょう（オンライン相談も選べます）",
        url: "https://start-fukuagri.jp/syuno/",
      };
    default:
      return {
        message: "まずはふくのうの「就農までのステップ」で、全体の流れを確かめてみましょう",
        url: "https://start-fukuagri.jp/procedure/",
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
