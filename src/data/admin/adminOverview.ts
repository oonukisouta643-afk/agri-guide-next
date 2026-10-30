// タブ「全体像」：目指す状態と、いま起きていること（/admin を開いたときに最初に出るタブ）
// 出典：docs/INSTRUCTIONS_admin-overview.md「4.」（2026年10月25日）。文章はそのまま使う。
// 数字は docs/history/2026-10-12_提案ロジック_担い手課向け_v1.md の1章・2章と、
// 確認用xlsx「提案の根拠」シートで照合済み（2026年10月26日）。URLは同ファイルの「主な出典」から取った。
//
// 段階Aの間は、相談の行と「お聞きしたいこと」の4つ目を出さない（指示書 段階Bの条件4）。
// 「準備中」の項目にはパス（href）を持たせない。公開されたら href を足して「公開中」にする。

export const SHOW_SOUDAN_ITEMS = false;

export const overviewGoal = {
  title: "全体像：目指す状態と、いま起きていること",
  goal:
    "地域とのつながりがない人も、収入の見通しを持ち、人となりが伝わる状態で地域に迎えられること。そして、受け手が決まっていない農地や先輩の園地が、荒れる前に受け継がれること。",
  goalNote: "このページの各タブと、サイトの各ページは、この状態に近づくためにあります。",
};

export const overviewFacts = [
  {
    fact: "福島県の新規就農者は、令和8年度調査で359人でした。県の戦略にある令和8年度の目標380人を下回っています（令和12年度の目標は400人）",
    source: "福島県「令和8年度の新規就農者数について」（2026年9月15日）、「新規就農者の確保・育成に係る戦略」",
  },
  {
    fact: "県北地方は113人で、令和12年度の目標96人をすでに上回っています",
    source: "同上",
  },
  {
    fact: "農家出身でない新規参入者は、令和元年度の42人から、令和8年度調査では78人に増えています",
    source: "福島県「令和8年度の新規就農者数について」",
  },
  {
    fact: "雇用就農の5年後の定着率は45%で、自営就農の85%より低くなっています（5年前に就農した方の値で、年による振れが大きい数字です）",
    source: "同上",
  },
  {
    fact: "地域計画では、福島県の農地の48.3%で将来の受け手が位置付けられていません（全国は31.7%）",
    source: "農林水産省 地域計画の策定状況（2025年4月末時点）",
  },
  {
    fact: "果樹の経営体は、7,905（2010年）、6,422（2015年）、5,189（2020年）と減っています",
    source: "農林業センサス（2010年・2015年・2020年）",
  },
];

export const overviewFactsReading =
  "数字から考えること：受け手が決まっていない農地が多いため、地域の外から担い手を迎える必要性は高いと考えます。県北は人数では目標を上回っているので、次は人数だけでなく、どんな方が、どう地域に迎えられて定着するかが大切になると考えます。";

export const overviewSources = [
  {
    label: "福島県「令和8年度の新規就農者数について」（2026年9月15日）",
    url: "https://www.pref.fukushima.lg.jp/uploaded/life/917874_2718710_misc.pdf",
  },
  {
    label: "福島県「新規就農者の確保・育成に係る戦略」（概要）",
    url: "https://www.pref.fukushima.lg.jp/uploaded/life/897652_2649159_misc.pdf",
  },
  {
    label: "福島県「新規就農者の確保・育成に係る戦略」（本文）",
    url: "https://www.pref.fukushima.lg.jp/uploaded/life/897652_2649158_misc.pdf",
  },
  {
    label: "農林水産省 地域計画の策定状況（2025年4月末時点）",
    url: "https://www.maff.go.jp/j/keiei/koukai/attach/pdf/chiiki_keikaku-178.pdf",
  },
  {
    label: "2010年農林業センサス（福島県）",
    url: "https://www.maff.go.jp/j/tokei/census/afc/2010/pdf/07_fukushima.pdf",
  },
  {
    label: "2015年農林業センサス（福島県）",
    url: "https://www.pref.fukushima.lg.jp/uploaded/attachment/188580.pdf",
  },
  {
    label: "2020年農林業センサス（福島県）",
    url: "https://www.pref.fukushima.lg.jp/uploaded/attachment/484290.pdf",
  },
];

export const overviewHypothesis = {
  title: "見立て：まだ担当がはっきりしていない一歩（確かめている途中です）",
  paragraphs: [
    "県北で新しく農業を始める方は、地域おこし協力隊として来た方や、地元に戻ってきた方が多いと聞いています。情報を届ける仕組み（県の就農ポータルや就農フェア）と、就農した後の支え（普及指導員による支援や、市町村の支援制度）は、すでにあります。",
    "一方で、地域とのつながりがない人が、収入の見通しを持ち、人となりが伝わる状態になって、公的な窓口や地域につながるまでの一歩は、担当がはっきりしていないように見えます。これは運営者が県北で関係者のお話をうかがって立てた見立てで、確かめている途中です。",
  ],
};

export type OverviewResourceStatus = "公開中" | "準備中" | "このページ";

export type OverviewResource = {
  goal: string;
  resource: string;
  status: OverviewResourceStatus;
  /** 「公開中」のものだけに持たせる。「準備中」には持たせない。 */
  href?: string;
  /** 相談ページの行。段階Aでは SHOW_SOUDAN_ITEMS=false で出さない。 */
  soudan?: boolean;
};

export const overviewResources: OverviewResource[] = [
  {
    goal: "地域・品目を数字で比べられる",
    resource: "福島県59市町村の地域データ（出典つき）",
    status: "準備中",
  },
  {
    goal: "稼げるまでの年数の目安が分かる",
    resource: "果樹（もも・なし・りんご）の1〜10年目の所得の試算（新しく植える場合と、園地を受け継ぐ場合）",
    status: "準備中",
  },
  {
    goal: "支援制度が分かる",
    resource: "補助金・支援制度の一覧",
    status: "公開中",
    href: "/subsidies",
  },
  {
    goal: "自分に合う形を考えられる",
    resource: "就農シミュレーター",
    status: "公開中",
    href: "/simulator",
  },
  {
    goal: "地域とのつながりがない人が、最初に相談できる",
    resource: "地域とのつながりがない方の就農相談",
    status: "公開中",
    href: "/soudan",
    soudan: true,
  },
  {
    goal: "だれがどの段階を担っているかが見える",
    resource: "このページの「支援体制マップ」",
    status: "このページ",
  },
];

export const overviewQuestions: { text: string; soudan?: boolean }[] = [
  { text: "この見立てが、現場の実感と合っているか" },
  { text: "果樹の10a当たりの収量・単価・経営費について、県で使われている指標や参考にすべき資料" },
  { text: "果樹園地の継承の取組の実績で、公表できるもの" },
  { text: "相談で分かったこと（個人が分からない集計）を、どこにお届けするとよいか", soudan: true },
];
