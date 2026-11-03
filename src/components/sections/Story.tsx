import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

// Section 2：Story（なぜやるのか）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5、OLD版 index.html #256-334
// 数字3枚カード（新規就農者・受け手の決まっていない農地・果樹の経営体。出典は /admin 全体像と同じ）＋一言フック＋3つの機能訴求カード＋代表の語り（断念者の声3件は2026年10月28日に外した）
//
// 2026年8月21日：「サイト全体がつまらない・お堅い」というフィードバックを受け見直し。
// 機能カードが「何ができるか」の説明に終始していて「わくわく」が抜けていたため、
// 大貫さん自身の言葉（ヒアリング）を反映：
// ①福島県北は関係者同士が顔見知りで、一人紹介してもらえれば数珠つなぎで支援が広がる
//   （ただし「動く気」が前提条件。誰にでも自動で起きるわけではない）
// ②大貫さん自身、農業に縁がないまま移住したが、調べるほど支援の手厚さ・地域の優位性に驚いた
// 2026年11月3日：フックの本文が紹介の約束に読め、/soudan の「紹介をお約束するものではありません」と
// 食い違うため、「〜こともあります」の書き方に直した。本文で「大貫」を一人称の語り手にしない（大貫さんの指示）。
// 「動く気が前提」の条件は、見出しの「動いてみると」で残している。
// この2点を軸に、機能カードを「機能説明」から「これで何が起きるか」に寄せた。
// 誇大な断定（「誰でも成功する」等）は使わない・「動く気があれば」の条件付けは残す、という
// ガードレールも維持。

const featureCards = [
  {
    icon: "📋",
    title: "自分だけの「次の一歩」が3分でわかる",
    description:
      "年齢・家族構成・希望品目を入力するだけ。「もし農業を始めたら」の手順と、受け取れる補助金の目安が自動で出てきます。就農準備資金と経営開始資金で最大825万円の目安（研修後に独立・自営就農した場合）、東京圏からの移住なら移住支援金の案内も出ます。",
  },
  {
    icon: "🌾",
    title: "調べてみると、支援は思っていたより多い",
    description:
      "新規就農までのステップには、支援の制度が用意されています。福島県北は、桃などの果樹の産地です。このサイトは、農業未経験で地域の外から移り住んだ運営者が、同じ立場の人の目線で作っています。",
  },
  {
    icon: "🗺️",
    title: "地域ごとの強みを、迷わず比較できる",
    description:
      "支援制度は地域ごとにバラバラで、オンラインイベントは増えた一方で「どの地域が自分に合っているか」を比べられる場は、まだ多くありません。このサイトでは、その比較の材料をそろえています。",
  },
];

// 「わくわく」の核となる一言フック。ボックス（カード）にせず、余白の多いタイポグラフィだけで
// 見せることで、他の全セクションが同じ白いカード枠で単調になりがちな問題からも意図的に外す。
const hook = {
  headline: "動いてみると、話がつながっていく。",
  body: "福島県北は、関係者同士の顔が見える地域です。一人に話を聞くと、次に聞くとよい人を教えてもらえることもあります。",
};

// 数字は /admin の「全体像」（src/data/admin/adminOverview.ts）と同じ出典。2026年10月27日に差し替え
// （それまでの「67歳」「4割減」「情報不足」は出典がなかったため外した）。
const stats = [
  {
    value: "359人",
    label: "福島県の新規就農者（令和8年度調査。県の目標は380人）",
    note: "福島県「令和8年度の新規就農者数について」（2026年9月15日）",
  },
  {
    value: "48.3%",
    label: "将来の受け手が決まっていない農地（福島県。全国は31.7%）",
    note: "農林水産省 地域計画の策定状況（2025年4月末時点）",
  },
  {
    value: "5,189",
    label: "福島県の果樹の経営体（2020年。2010年は7,905）",
    note: "農林業センサス（2010年・2020年）",
  },
];

export function Story() {
  return (
    <section id="story" className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader title="「農業に興味があるのに踏み出せない人」と「後継者を探している農家さん」の間の情報格差" />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <Reveal key={stat.value} delayMs={i * 100}>
            <Card className="h-full text-center">
              <p className="font-serif text-3xl font-bold text-green-700">{stat.value}</p>
              <p className="mt-2 text-sm text-ink">{stat.label}</p>
              {stat.note && <p className="mt-1 text-xs text-muted">{stat.note}</p>}
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={50}>
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="font-serif text-2xl font-bold leading-snug text-green-800 sm:text-3xl">
            {hook.headline}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink">{hook.body}</p>
        </div>
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4">
        {featureCards.map((card, i) => (
          <Reveal key={card.title} delayMs={i * 100}>
            <div className="flex items-start gap-4 rounded-lg border border-green-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-200 text-2xl">
                {card.icon}
              </div>
              <div>
                <p className="font-bold text-ink">{card.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{card.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 断念者の声（3件）は作った声だったため2026年10月28日に外した */}
      {/* 運営者の言葉（署名付きの一人称の引用）は、ブログのようになるため2026年11月3日に外した（大貫さんの指示） */}
    </section>
  );
}
