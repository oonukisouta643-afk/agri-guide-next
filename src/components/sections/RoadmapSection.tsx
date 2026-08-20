import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { businessRoadmapPhases, type BusinessRoadmapKey } from "@/data/businessRoadmap";

// RoadmapSection：展開計画（事業ロードマップ）の垂直タイムライン。Regionsの直後・Contactの直前に配置。
// 出典：OLD版 index.html #585-592（#roadmap）
// ※ シミュレーターの「個人の就農ロードマップ」（src/data/roadmap.ts・simulator配下）とは別物。

const dotClassByKey: Record<BusinessRoadmapKey, string> = {
  now: "bg-green-700 text-white",
  next: "bg-green-200 text-green-700",
  future: "border border-green-200 bg-white text-green-700",
};

export function RoadmapSection() {
  return (
    <section id="roadmap" className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          eye="展開計画"
          title={
            <>
              2026〜2027年の<span className="font-bold text-green-700">ロードマップ</span>
            </>
          }
          lead="調査フェーズから始め、データに基づいてサービスを育てます。"
        />
      </Reveal>

      <div className="mx-auto mt-10 max-w-3xl">
        {businessRoadmapPhases.map((phase, i) => {
          const isLast = i === businessRoadmapPhases.length - 1;
          return (
            <Reveal key={phase.key} delayMs={i * 100}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${dotClassByKey[phase.key]}`}
                    aria-hidden="true"
                  >
                    {phase.icon}
                  </span>
                  {!isLast && <span className="mt-1 w-px flex-1 bg-green-200" aria-hidden="true" />}
                </div>
                <div className={isLast ? "pb-0" : "pb-10"}>
                  <p className="font-mono text-xs font-bold text-green-700">{phase.period}</p>
                  <p className="mt-1 font-bold text-ink">{phase.title}</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {phase.details.map((detail) => (
                      <li key={detail} className="text-sm text-muted">
                        ・{detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
