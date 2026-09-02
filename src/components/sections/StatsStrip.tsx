import { Reveal } from "@/components/ui/Reveal";

// StatsStrip：Heroの直下に置く5項目の数字バンド
// 出典：OLD版 index.html #246-255（.stats-strip）の内容を移植。
// 「農業に興味はあるけど踏み出せていない」層に対して、制度・費用面の危機感と
// 追い風（2026年度の予算拡充）を数字で先に示す役割。

const stats = [
  {
    value: "35%",
    label: "福島県の農家数減少率 2010年比（2020年）",
  },
  {
    value: "400万円",
    label: "就農1年目の営農費用 中央値（令和6年度調査）",
  },
  {
    value: "494億円",
    label: "2026年度 農業構造転換 集中対策（前年度比2倍）",
  },
  {
    value: "600万円",
    label: "地域計画早期実現支援枠 上限（2026年度新設）",
  },
  {
    value: "0円",
    label: "利用料金（Phase 1 完全無料）",
  },
];

export function StatsStrip() {
  return (
    <section className="border-y border-green-200 bg-white px-5 py-8 sm:px-10">
      <Reveal>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-5 sm:gap-y-0">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl font-bold leading-tight text-green-700 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
