// 農家プロフィール（/farmers）データ
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ farmers 農家プロフィール」
// 「農家ヒアリング完了次第実データへ更新」（要件定義書に明記）の通り、全件仮データ。
// シミュレーター結果⑥「似た条件の人カード」（src/data/similarCases.ts）と
// 同一の4名を採用し、サイト内の一貫性を保っている。

// 農家プロフィールの分類（フィルターボタン用）。畜産は掲載対象がないため意図的に含めない。
export type FarmerCategory = "fruit" | "veg" | "new";

export type FarmerProfile = {
  id: string;
  name: string;
  area: string;
  crop: string;
  /** フィルターボタン（すべて/🌳果樹/🥬野菜/🌱新規就農）で使う分類。複数可。 */
  categories: FarmerCategory[];
  /** カード左上に表示する絵文字アバター */
  avatar: string;
  beforeJob: string;
  ownCapital: string;
  farmingYears: string;
  incomeYear4: string;
  landSize: string;
  trainingPeriod: string;
  /** 就農のきっかけ */
  trigger: string;
  quote: string;
};

export const farmerProfiles: FarmerProfile[] = [
  {
    id: "farmer-a",
    name: "Aさん",
    area: "伊達市",
    crop: "桃農家",
    categories: ["fruit", "new"],
    avatar: "🍑",
    beforeJob: "都内IT企業・営業職",
    ownCapital: "280万円",
    farmingYears: "3年目",
    incomeYear4: "約320万円（見込み）",
    landSize: "0.8反",
    trainingPeriod: "1年（研修制度利用）",
    trigger: "福島県主催の農業体験ツアーに参加→移住を決意",
    quote: "何も分からないまま飛び込みましたが、研修制度のおかげで何とかなりました。今は収穫の時期が一番の楽しみです。",
  },
  {
    id: "farmer-b",
    name: "Bさん",
    area: "二本松市",
    crop: "りんご農家",
    categories: ["fruit", "new"],
    avatar: "🍎",
    beforeJob: "会社員（家庭菜園歴10年）",
    ownCapital: "450万円",
    farmingYears: "2年目",
    incomeYear4: "約280万円（見込み）",
    landSize: "1.2反",
    trainingPeriod: "半年（実地研修）",
    trigger: "家庭菜園の延長で市民農園に通ううち→本格就農を決意",
    quote: "家庭菜園の延長線で始められたのが、自分には合っていました。夫婦で協力しながらやっています。",
  },
  {
    id: "farmer-c",
    name: "Cさん",
    area: "国見町",
    crop: "さくらんぼ農家",
    categories: ["fruit", "new"],
    avatar: "🍒",
    beforeJob: "農業バイト経験あり・フリーランス",
    ownCapital: "180万円",
    farmingYears: "研修修了・独立準備中",
    incomeYear4: "未定（独立準備中）",
    landSize: "0.5反（予定）",
    trainingPeriod: "1年（くにみ農業ビジネス訓練所）",
    trigger: "農業バイトで面白さに目覚める→くにみ農業ビジネス訓練所へ入所",
    quote: "くにみ農業ビジネス訓練所の座学と実習で、ゼロから知識を積み上げられました。",
  },
  {
    id: "farmer-d",
    name: "Dさん",
    area: "大玉村",
    crop: "米農家",
    categories: ["veg", "new"],
    avatar: "🌾",
    beforeJob: "会社員（定年退職）",
    ownCapital: "520万円",
    farmingYears: "1年目",
    incomeYear4: "未定（就農1年目）",
    landSize: "2.0反",
    trainingPeriod: "3ヶ月（短期集中研修）",
    trigger: "定年退職→地域の空き農地を紹介されたことがきっかけ",
    quote: "定年後のセカンドキャリアとして、夫婦で新しい生活を始めました。地域の方々にとても助けられています。",
  },
];

export type ComingSoonCard = {
  id: string;
  category: string;
  /** フィルターボタン用の分類 */
  filterCategory: FarmerCategory;
  icon: string;
  beforeJob: string;
  note: string;
};

export const comingSoonProfiles: ComingSoonCard[] = [
  {
    id: "coming-vegetable",
    category: "野菜農家",
    filterCategory: "veg",
    icon: "🥒",
    beforeJob: "就農前職業：準備中",
    note: "収益データも含めて掲載予定です。",
  },
  {
    id: "coming-fruit",
    category: "果樹農家",
    filterCategory: "fruit",
    icon: "🍎",
    beforeJob: "就農前職業：準備中",
    note: "収益データも含めて掲載予定です。",
  },
  {
    id: "coming-new",
    category: "新規就農者",
    filterCategory: "new",
    icon: "🌱",
    beforeJob: "就農前職業：準備中",
    note: "収益データも含めて掲載予定です。",
  },
];

// 農家の1日（桃農家・繁忙期のスケジュール）
// 出典：agri-farmers.html（旧サイト）var schedule（9ステップ・アイコン＆説明文つき）
export type DaySchedule = {
  time: string;
  icon: string;
  activity: string;
  description: string;
};

export const peachFarmerDay: DaySchedule[] = [
  {
    time: "4:30",
    icon: "🌅",
    activity: "起床・圃場確認",
    description: "夜明け前から起きて農地の状態を確認。今日の収穫量と作業量を頭の中で組み立てる。",
  },
  {
    time: "5:00",
    icon: "🍑",
    activity: "収穫作業開始",
    description: "気温が上がる前に収穫を終わらせる。桃は傷みやすく、朝の涼しい時間帯が勝負。",
  },
  {
    time: "8:00",
    icon: "🥛",
    activity: "朝食・一息",
    description: "家族と食事。収穫した桃の選果（サイズ・品質でわける）作業の準備をする。",
  },
  {
    time: "9:00",
    icon: "📦",
    activity: "選果・出荷準備",
    description: "収穫した桃を1個ずつ手で確認しながら箱詰め。JAへの出荷分と直売分を分ける。",
  },
  {
    time: "11:00",
    icon: "🚚",
    activity: "JAへ出荷",
    description: "午前中に出荷を終わらせる。この時間に次の作業の段取りも確認。",
  },
  {
    time: "12:00",
    icon: "🍱",
    activity: "昼食・休憩",
    description: "暑さが最も厳しい時間帯は作業を控える。これが農業の知恵。",
  },
  {
    time: "14:00",
    icon: "💊",
    activity: "防除・管理作業",
    description: "病害虫の防除や摘果など管理作業。品質に直結するので手を抜けない。",
  },
  {
    time: "16:00",
    icon: "📋",
    activity: "翌日の準備・記録",
    description: "作業記録をつける。補助金の申請や農業委員会への報告書にも使う大切な記録。",
  },
  {
    time: "18:00",
    icon: "🌙",
    activity: "終業・入浴",
    description: "家族との夕食。収穫期は体力的にハードだが「自分が作ったものが売れる」実感がある。",
  },
];
