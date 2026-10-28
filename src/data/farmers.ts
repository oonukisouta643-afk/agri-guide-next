// /farmers の「農家の1日」データ
// 2026年10月28日：架空の農家プロフィール4人（farmerProfiles・comingSoonProfiles）は外した。残すのは農家の1日だけ。
// 農家の1日（桃農家・繁忙期のスケジュール）
// 出典：agri-farmers.html（旧サイト）var schedule（9ステップ・アイコン＆説明文つき）
// 2026年10月28日：トップ（src/data/farmSeasons.ts）に合わせ、「圃場」を「畑」に、終わりを 18:00 から 17:00 に（運営者の判断）。
// 収穫期に「摘果」は不自然なので、14:00 は摘果を外し、「防除・見回り」（次に収穫する木の色づきを見る）にした。
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
    activity: "起床・畑の様子を見る",
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
    activity: "防除・見回り",
    description: "病害虫の防除や、次に収穫する木の色づきの見回り。品質に直結するので手を抜けない。",
  },
  {
    time: "16:00",
    icon: "📋",
    activity: "翌日の準備・記録",
    description: "作業記録をつける。補助金の申請や農業委員会への報告書にも使う大切な記録。",
  },
  {
    time: "17:00",
    icon: "🌙",
    activity: "作業を終える",
    description: "作業を終え、家族と夕食。収穫期は体力的にハードだが「自分が作ったものが売れる」実感がある。",
  },
];
