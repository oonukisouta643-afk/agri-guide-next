import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

// Section 3：How（3ステップ導線）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5

const steps = [
  {
    icon: "📅",
    step: "STEP 1",
    title: "農業カレンダー",
    description: "1年の生活リズムを知る",
  },
  {
    icon: "🌿",
    step: "STEP 2",
    title: "就農シミュレーター",
    description: "自分の条件で試算する",
  },
  {
    icon: "👨‍🌾",
    step: "STEP 3",
    title: "農家プロフィール",
    description: "似た属性の実例を探す",
  },
];

export function How() {
  return (
    <section className="bg-green-50 px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          title="シミュレーターの前にまず体感してみる"
          lead="農業カレンダー・補助金クイズ・コスト比較・適性チェックの7つのツールを用意しています"
        />
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        {steps.map((step, i) => (
          <div key={step.step} className="flex flex-1 items-center gap-4">
            <Reveal delayMs={i * 100} className="flex-1">
              <Card className="text-center">
                <p className="text-3xl">{step.icon}</p>
                <p className="mt-2 font-mono text-xs font-bold text-green-700">{step.step}</p>
                <p className="mt-1 font-bold text-ink">{step.title}</p>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </Card>
            </Reveal>
            {i < steps.length - 1 && (
              <span className="hidden text-2xl text-green-700 sm:block" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
