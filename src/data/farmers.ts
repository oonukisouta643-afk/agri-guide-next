// 農家プロフィール（/farmers）データ
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ farmers 農家プロフィール」
// 「農家ヒアリング完了次第実データへ更新」（要件定義書に明記）の通り、全件仮データ。
// シミュレーター結果⑥「似た条件の人カード」（src/data/similarCases.ts）と
// 同一の4名を採用し、サイト内の一貫性を保っている。

export type FarmerProfile = {
  id: string;
  name: string;
  area: string;
  crop: string;
  beforeJob: string;
  ownCapital: string;
  farmingYears: string;
  incomeYear4: string;
  landSize: string;
  trainingPeriod: string;
  quote: string;
};

export const farmerProfiles: FarmerProfile[] = [
  {
    id: "farmer-a",
    name: "Aさん",
    area: "伊達市",
    crop: "桃農家",
    beforeJob: "都内IT企業・営業職",
    ownCapital: "280万円",
    farmingYears: "3年目",
    incomeYear4: "約320万円（見込み）",
    landSize: "0.8反",
    trainingPeriod: "1年（研修制度利用）",
    quote: "何も分からないまま飛び込みましたが、研修制度のおかげで何とかなりました。今は収穫の時期が一番の楽しみです。",
  },
  {
    id: "farmer-b",
    name: "Bさん",
    area: "二本松市",
    crop: "りんご農家",
    beforeJob: "会社員（家庭菜園歴10年）",
    ownCapital: "450万円",
    farmingYears: "2年目",
    incomeYear4: "約280万円（見込み）",
    landSize: "1.2反",
    trainingPeriod: "半年（実地研修）",
    quote: "家庭菜園の延長線で始められたのが、自分には合っていました。夫婦で協力しながらやっています。",
  },
  {
    id: "farmer-c",
    name: "Cさん",
    area: "国見町",
    crop: "さくらんぼ農家",
    beforeJob: "農業バイト経験あり・フリーランス",
    ownCapital: "180万円",
    farmingYears: "研修修了・独立準備中",
    incomeYear4: "未定（独立準備中）",
    landSize: "0.5反（予定）",
    trainingPeriod: "1年（くにみ農業ビジネス訓練所）",
    quote: "くにみ農業ビジネス訓練所の座学と実習で、ゼロから知識を積み上げられました。",
  },
  {
    id: "farmer-d",
    name: "Dさん",
    area: "大玉村",
    crop: "米農家",
    beforeJob: "会社員（定年退職）",
    ownCapital: "520万円",
    farmingYears: "1年目",
    incomeYear4: "未定（就農1年目）",
    landSize: "2.0反",
    trainingPeriod: "3ヶ月（短期集中研修）",
    quote: "定年後のセカンドキャリアとして、夫婦で新しい生活を始めました。地域の方々にとても助けられています。",
  },
];

export type ComingSoonCard = {
  id: string;
  category: string;
  beforeJob: string;
  note: string;
};

export const comingSoonProfiles: ComingSoonCard[] = [
  {
    id: "coming-vegetable",
    category: "野菜農家",
    beforeJob: "就農前職業：準備中",
    note: "収益データも含めて掲載予定です。",
  },
  {
    id: "coming-fruit",
    category: "果樹農家",
    beforeJob: "就農前職業：準備中",
    note: "収益データも含めて掲載予定です。",
  },
  {
    id: "coming-new",
    category: "新規就農者",
    beforeJob: "就農前職業：準備中",
    note: "収益データも含めて掲載予定です。",
  },
];

// 農家の1日（桃農家・繁忙期のスケジュール）
export type DaySchedule = {
  time: string;
  activity: string;
};

export const peachFarmerDay: DaySchedule[] = [
  { time: "4:30", activity: "起床・出荷準備" },
  { time: "5:00", activity: "収穫作業開始" },
  { time: "8:00", activity: "朝食・小休憩" },
  { time: "8:30", activity: "選別・箱詰め" },
  { time: "11:00", activity: "出荷（JA・直売所へ搬入）" },
  { time: "12:00", activity: "昼食・休憩" },
  { time: "13:30", activity: "園地管理（摘果・防除など）" },
  { time: "16:30", activity: "翌日の準備・事務作業" },
  { time: "18:00", activity: "終業" },
];
