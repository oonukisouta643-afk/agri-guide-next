// Tool A：農業カレンダー
// 2026年10月28日に作り直した。それまでの7品目（初期費用・黒字化・相性・産地・説明文、出典なし）は外し、
// 果樹4品目の月ごとの忙しさと収穫時期だけにした。
// 出典：県北ふくしまAgri-Guide「福島県59市町村 就農の地域データ」（2026年10月16日版）の
// 10_果樹の作業の時期.csv・12_果樹の収穫時期_福島.csv（docs/data/open/）。月の割り当てには推定を含む（basis を画面に出す）。

export type Busy = "high" | "mid" | "low";

export type CalendarCrop = {
  key: string;
  label: string;
  emoji: string;
  variety: string;
  /** 1〜12月の忙しさ（◎=high ○=mid △=low） */
  months: Busy[];
  /** 福島での収穫時期 */
  harvest: string[];
  /** 根拠（10・12 CSV の「根拠」の列） */
  basis: string;
};

const H: Busy = "high";
const M: Busy = "mid";
const L: Busy = "low";

export const calendarCrops: CalendarCrop[] = [
  {
    key: "momo",
    label: "もも",
    emoji: "🍑",
    variety: "あかつき・川中島白桃",
    months: [L, L, L, M, H, M, M, H, L, L, L, L],
    harvest: ["あかつき：8月上旬（8/3〜8/11、盛り8/6。福島県果樹研究所の年平均）", "川中島白桃：8月中旬〜下旬（推測）"],
    basis:
      "山口県の月別労働時間（5月41.2h・7月72.4h）をもとに、摘果期は福島の時期（仕上げ摘果5月中旬）に合わせ、収穫期は約1か月後ろ（あかつき収穫8/3〜8/11）へずらした",
  },
  {
    key: "nashi",
    label: "なし",
    emoji: "🍐",
    variety: "幸水・豊水",
    months: [L, L, L, M, M, M, L, M, H, L, L, L],
    harvest: ["幸水：8月中旬〜下旬（推測）", "豊水：9月上旬〜中旬（推測）"],
    basis: "農水省資料の月別作業時間（4月38・5月44・6月36・8月38・9月54h）。月の割り当ては推定で、地域・年は不明。福島の開花時期と照合",
  },
  {
    key: "budou",
    label: "ぶどう",
    emoji: "🍇",
    variety: "シャインマスカット",
    months: [L, L, L, L, M, H, H, L, H, M, L, L],
    harvest: ["シャインマスカット：9月中旬〜10月（推測）"],
    basis:
      "滋賀・福岡・岩手の作業暦から（房づくり・摘粒が6〜7月、収穫は福島では9月中旬〜10月と推測）。農水省の数値は月の割り当てに疑問があり参考程度",
  },
  {
    key: "ringo",
    label: "りんご",
    emoji: "🍎",
    variety: "ふじ",
    months: [L, L, L, L, M, H, L, L, L, M, H, L],
    harvest: ["ふじ：11月（推測。福島のりんごの出荷は12月中旬まで）"],
    basis: "農水省資料のふじ わい化294h（5月45・6月64・10月29・11月60h）と、鳥取県の作業期間、福島の満開4/30で照合",
  },
];
