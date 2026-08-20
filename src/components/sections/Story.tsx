import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

// Section 2：Story（なぜやるのか）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5、OLD版 index.html #256-334
// 数字3枚カード（67歳・4割減・情報不足）＋3つの機能訴求カード＋代表の語り＋断念者の声3件（仮データ）

const featureCards = [
  {
    icon: "📋",
    title: "補助金・ロードマップを3分でシミュレート",
    description:
      "年齢・家族構成・希望品目を入力するだけ。「もし農業を始めたら」の手順と、受け取れる補助金の目安が自動で出てきます。就農準備資金・移住支援金など最大750万円以上の試算が可能です。",
  },
  {
    icon: "🌾",
    title: "農家のリアルを移住者目線で知れる",
    description:
      "農家の1日・年収・生活の実態を、同じ農業未経験の移住者が取材・整理したコンテンツでお届けします。農家出身でも行政職員でもない「初心者目線」の情報です。",
  },
  {
    icon: "🗺️",
    title: "地域・品目選びの判断材料を揃える",
    description:
      "支援制度は地域ごとにバラバラで、オンラインイベントは増えた一方で「どの地域が自分に合っているか」を比較できる場がありません。このサービスはその情報格差を埋めます。",
  },
];

const stats = [
  {
    value: "67歳",
    label: "福島県の農業従事者平均年齢",
    note: "2020年農林業センサス",
  },
  {
    value: "4割減",
    label: "農業従事者数・過去10年間",
  },
  {
    value: "情報不足",
    label: "就農断念の主要因",
    note: "推計",
  },
];

// ※仮データ。FORM 02の回答が集まり次第、実際の声に差し替え予定。
const voices = [
  {
    quote: "何から調べればいいのか分からず、結局そのままになってしまいました。",
    attribution: "30代・会社員・東京都",
  },
  {
    quote: "農地を借りるハードルが高そうで、相談する勇気が出ませんでした。",
    attribution: "40代・自営業・神奈川県",
  },
  {
    quote: "収入の見通しが立たず、家族を説得できませんでした。",
    attribution: "30代・会社員・埼玉県",
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

      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-4">
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

      <Reveal delayMs={100}>
        <div className="mx-auto mt-6 flex max-w-5xl items-start gap-4 rounded-lg border border-green-200 bg-green-50 p-5 sm:p-6">
          <p className="shrink-0 text-3xl" aria-hidden="true">
            🌿
          </p>
          <div>
            <p className="text-sm leading-loose text-ink">
              「農業も伊達市も何も知らないまま移住して、最初の1年間で一番困ったのは、誰に何を聞けばいいかわからないことでした。同じ状態にいる人のために、農業未経験の移住者目線で作っています。」
            </p>
            <p className="mt-3 text-sm font-bold text-ink">
              大貫想太 / 県北ふくしまAgri-Guide準備室
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {voices.map((voice, i) => (
          <Reveal key={voice.attribution} delayMs={i * 100}>
            <div className="h-full rounded border-l-[3px] border-green-700 bg-white p-5 shadow-sm">
              <p className="text-sm text-ink">「{voice.quote}」</p>
              <p className="mt-3 text-xs text-muted">{voice.attribution}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-5xl text-center text-xs text-muted">
        ※仮データ。FORM 02の回答が集まり次第、実際の声に差し替えます。
      </p>
    </section>
  );
}
