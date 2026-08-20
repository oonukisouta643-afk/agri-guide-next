// Tool G：品目別収益モデル
// 出典：旧サイト（netlify-0816/agri-tools.html）PROFIT_CROPS（966-972行）を移植。
// NEWは総収入（グロス）の右肩上がりの仮データになっていたが、旧サイトは初期投資回収前の
// 赤字年を含む「実際の手取り年間農業収入（ネット）」の推移データだった。金額・年数・noteは
// 全て旧サイトの実データをそのまま移植したもの（Claudeによる新規の推測値は含まない）。
// 単位：万円（1反または10aあたり）。仮データである旨はページ内に明記する。

export type ProfitCrop = {
  key: string;
  label: string;
  emoji: string;
  /** 初期費用目安（万円） */
  initialCostManYen: number;
  /** 黒字化の目安（年目） */
  breakEvenYear: number;
  scale: string;
  /** 1〜5年目の想定純収支（万円・赤字年はマイナス） */
  yearlyNet: number[];
  note: string;
};

export const profitCrops: ProfitCrop[] = [
  {
    key: "momo",
    label: "桃",
    emoji: "🍑",
    initialCostManYen: 100,
    breakEvenYear: 4,
    scale: "1反",
    yearlyNet: [-80, -20, 80, 180, 280],
    note: "初期費用は高めだが単価が高い。糖度の高さでブランド力がある。",
  },
  {
    key: "apple",
    label: "りんご",
    emoji: "🍎",
    initialCostManYen: 80,
    breakEvenYear: 6,
    scale: "1反",
    yearlyNet: [-60, -10, 50, 130, 220],
    note: "収益化まで時間がかかるが長期安定。桃の後の秋〜冬の収入になる。",
  },
  {
    key: "kyu",
    label: "きゅうり",
    emoji: "🥒",
    initialCostManYen: 80,
    breakEvenYear: 2,
    scale: "10a",
    yearlyNet: [20, 80, 120, 150, 160],
    note: "果樹より早く収入になる。年2回収穫可能。体力的にはハード。",
  },
  {
    key: "rice",
    label: "米",
    emoji: "🌾",
    initialCostManYen: 50,
    breakEvenYear: 3,
    scale: "10a",
    yearlyNet: [-30, 10, 60, 90, 110],
    note: "機械化しやすく体力的負担が少ない。冬は農閑期になる。",
  },
  {
    key: "nashi",
    label: "梨",
    emoji: "🍐",
    initialCostManYen: 90,
    breakEvenYear: 5,
    scale: "1反",
    yearlyNet: [-70, -15, 60, 150, 230],
    note: "桃とりんごの間の8〜9月収穫。組み合わせると年間収入が安定する。",
  },
];
