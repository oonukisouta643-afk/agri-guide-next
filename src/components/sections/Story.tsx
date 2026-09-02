import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

// Section 2：Story（なぜやるのか）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5
// 数字3枚カード（67歳・4割減・情報不足）＋断念者の声3件（仮データ）

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
