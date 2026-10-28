// 果樹の1年（月ごとの忙しさ・収穫の時期・年間の労働時間）
// 出典：docs/data/open/ の CSV
// - 忙しさ：10_果樹の作業の時期.csv（◎=3 ○=2 △=1）。他県などの資料（ももは山口県、なしは農林水産省、
//   りんごは農林水産省と鳥取県、ぶどうは滋賀・福岡・岩手の作業暦）を福島の時期に合わせた目安（推測）
// - 収穫の時期：ももは福島県 果樹情報 令和2年度第9号の平年（はつひめ〜ゆうぞら）。ほかは 12_果樹の収穫時期_福島.csv（推測）
// - 年間の労働時間：11_果樹の年間労働時間.csv（福島県果樹農業振興計画書、令和8年3月）

export type Busy = 1 | 2 | 3;

export type FruitYear = {
  key: string;
  name: string;
  busy: readonly Busy[]; // 1月〜12月
  harvest: readonly number[];
  harvestText: string;
  harvestGuess: boolean; // 収穫の時期が推測か
  busyBasis: string; // 忙しさの元にした品種（10_果樹の作業の時期.csv の行）
  hours: string; // 10aあたりの年間の労働時間（福島県）
  inProfitTool: boolean; // /tools#profit（品目別収益モデル）に載っているか
};

export const FRUIT_YEAR: FruitYear[] = [
  {
    key: "peach",
    name: "もも",
    busy: [1, 1, 1, 2, 3, 2, 2, 3, 1, 1, 1, 1],
    harvest: [7, 8, 9],
    harvestText: "7月上旬〜9月上旬（はつひめ〜ゆうぞらと品種をずらした場合。福島県 果樹情報 令和2年度第9号の平年）",
    harvestGuess: false,
    busyBasis: "あかつき・川中島白桃",
    hours: "225時間（あかつき）",
    inProfitTool: true,
  },
  {
    key: "pear",
    name: "なし",
    busy: [1, 1, 1, 2, 2, 2, 1, 2, 3, 1, 1, 1],
    harvest: [8, 9],
    harvestText: "8月中旬〜9月中旬（幸水・豊水。推測）",
    harvestGuess: true,
    busyBasis: "幸水・豊水",
    hours: "259〜269時間（幸水・豊水）",
    inProfitTool: true,
  },
  {
    key: "grape",
    name: "ぶどう",
    busy: [1, 1, 1, 1, 2, 3, 3, 1, 3, 2, 1, 1],
    harvest: [9, 10],
    harvestText: "9月中旬〜10月（シャインマスカット。推測）",
    harvestGuess: true,
    busyBasis: "シャインマスカット",
    hours: "249時間（シャインマスカット）",
    inProfitTool: false,
  },
  {
    key: "apple",
    name: "りんご",
    busy: [1, 1, 1, 1, 2, 3, 1, 1, 1, 2, 3, 1],
    harvest: [11],
    harvestText: "11月（ふじ。推測）",
    harvestGuess: true,
    busyBasis: "ふじ",
    hours: "197時間（ふじ）",
    inProfitTool: true,
  },
];

export const BUSY_WORD: Record<Busy, string> = { 1: "少ない", 2: "忙しい", 3: "とても忙しい" };

/** その月の、その果樹の様子（収穫の時期なら「収穫」、そうでなければ忙しさ） */
export function monthState(f: FruitYear, month: number): { word: string; harvest: boolean; busy: Busy } {
  const busy = f.busy[month - 1];
  const harvest = f.harvest.includes(month);
  return { word: harvest ? "収穫の時期" : BUSY_WORD[busy], harvest, busy };
}
