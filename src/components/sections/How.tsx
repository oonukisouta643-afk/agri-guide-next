import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

// Section 3：How（使い方・3ステップ導線）
// 出典：OLD版 index.html #335-341（#how セクション）
// 2026年8月20日：移行時にTools.tsxの見出し文言と誤って重複していたバグを修正し、
// OLD版本来の「使い方」3ステップ紹介に差し替え。

const steps = [
  {
    num: "01",
    icon: "📋",
    title: "ロードマップを作る",
    description:
      "年齢・家族構成・希望品目・予算を入力するだけ。「もし福島県北地域で農業を始めたら」の手順と補助金の目安が3分で出ます。",
  },
  {
    num: "02",
    icon: "🌾",
    title: "農家のリアルを知る",
    description:
      "伊達市の農家さんの収支・1年の流れ・生活の実態を、移住者目線でまとめたコンテンツで解像度を上げていきます。",
  },
  {
    num: "03",
    icon: "🚶",
    title: "一歩目を踏み出す",
    description:
      "「体験してみたい」と思ったら、お試し就農体験・農家訪問・相談窓口への動線をご案内します。",
  },
];

export function How() {
  return (
    <section id="how" className="bg-green-50 px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          eye="使い方"
          title="3ステップで解像度が上がる"
          lead="決断は不要です。「もし農業をやったらどうなるか」を、リスクゼロで体感してみてください。"
        />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.num} delayMs={i * 100}>
            <Card className="h-full">
              <p className="font-mono text-3xl font-bold text-green-200">{step.num}</p>
              <p className="mt-2 text-2xl">{step.icon}</p>
              <p className="mt-2 font-bold text-ink">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
