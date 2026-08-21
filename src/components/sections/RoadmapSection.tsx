import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { businessRoadmapPhases, type BusinessRoadmapKey } from "@/data/businessRoadmap";

// RoadmapSection：展開計画（事業ロードマップ）。Regionsの直後・Contactの直前に配置。
// 出典：OLD版 index.html #585-592（#roadmap）
// ※ シミュレーターの「個人の就農ロードマップ」（src/data/roadmap.ts・simulator配下）とは別物。
//
// 2026年8月21日：「モバイルだとページが長い・事業計画の詳細は一般ユーザーには冗長」という
// フィードバックを受け、縦タイムライン＋各フェーズの箇条書き詳細を、
// 横並び3枚の要約カード（フェーズ名＋期間のみ）に圧縮。

const toneClassByKey: Record<BusinessRoadmapKey, string> = {
  now: "border-green-700 bg-green-700 text-white",
  next: "border-green-200 bg-green-50 text-green-700",
  future: "border-green-200 bg-white text-green-700",
};

export function RoadmapSection() {
  return (
    <section id="roadmap" className="px-5 py-10 sm:px-10 sm:py-12">
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

      <Reveal delayMs={100}>
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {businessRoadmapPhases.map((phase) => (
            <div
              key={phase.key}
              className={`rounded-lg border p-4 ${toneClassByKey[phase.key]}`}
            >
              <p className="text-xl" aria-hidden="true">
                {phase.icon}
              </p>
              <p className="mt-1 text-xs font-bold opacity-80">{phase.period}</p>
              <p className="mt-1 text-sm font-bold leading-snug">{phase.title}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
