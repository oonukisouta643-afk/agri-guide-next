// 道のりグラフ（手書きのSVG）と、同じ内容の表。
// 線は色だけでなく、線の種類（実線・破線）と点の形（丸・四角）でも区別する。
import type { YearPoint } from "../types";
import { fmtMan, fmtNumber } from "../format";

export type RoadmapSeries = { label: string; points: YearPoint[] };

const STYLES = [
  { stroke: "#1f6f4a", dash: undefined, marker: "circle" as const },
  { stroke: "#9a5b13", dash: "6 4", marker: "square" as const },
];

const W = 640;
const H = 300;
const PAD = { top: 16, right: 16, bottom: 36, left: 64 };

function niceStep(range: number) {
  const raw = range / 5;
  const mag = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
}

export function RoadmapChart({ series, title }: { series: RoadmapSeries[]; title: string }) {
  const years = series[0]?.points.length ?? 0;
  const values = series.flatMap((s) => s.points.map((p) => p.income / 10000)); // 万円
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const step = niceStep(max - min || 1);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const x = (year: number) => PAD.left + ((year - 1) / Math.max(1, years - 1)) * (W - PAD.left - PAD.right);
  const y = (man: number) => PAD.top + ((hi - man) / (hi - lo || 1)) * (H - PAD.top - PAD.bottom);
  const ticks: number[] = [];
  for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(v);

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}（同じ内容を下の表に載せている）`} className="h-auto w-full">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#555" : "#ddd"} strokeWidth={t === 0 ? 1.5 : 1} />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#555">{fmtNumber(t)}</text>
          </g>
        ))}
        <text x={12} y={PAD.top + 4} fontSize="11" fill="#555">万円</text>
        {Array.from({ length: years }, (_, i) => (
          <text key={i} x={x(i + 1)} y={H - PAD.bottom + 18} textAnchor="middle" fontSize="11" fill="#555">{i + 1}年目</text>
        ))}
        {series.map((s, si) => {
          const st = STYLES[si % STYLES.length];
          const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(p.income / 10000).toFixed(1)}`).join(" ");
          return (
            <g key={s.label}>
              <path d={d} fill="none" stroke={st.stroke} strokeWidth={2.5} strokeDasharray={st.dash} />
              {s.points.map((p) =>
                st.marker === "circle" ? (
                  <circle key={p.year} cx={x(p.year)} cy={y(p.income / 10000)} r={4} fill={st.stroke} />
                ) : (
                  <rect key={p.year} x={x(p.year) - 4} y={y(p.income / 10000) - 4} width={8} height={8} fill={st.stroke} />
                ),
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-4 text-xs text-gray-700">
        {series.map((s, si) => {
          const st = STYLES[si % STYLES.length];
          return (
            <span key={s.label} className="inline-flex items-center gap-1.5">
              <svg width="28" height="10" aria-hidden="true">
                <line x1="0" x2="28" y1="5" y2="5" stroke={st.stroke} strokeWidth="2.5" strokeDasharray={st.dash} />
                {st.marker === "circle" ? <circle cx="14" cy="5" r="3.5" fill={st.stroke} /> : <rect x="10.5" y="1.5" width="7" height="7" fill={st.stroke} />}
              </svg>
              {s.label}（{st.marker === "circle" ? "実線・丸" : "破線・四角"}）
            </span>
          );
        })}
        <span>縦軸：農業所得（販売額−経営費−地代）</span>
      </figcaption>
    </figure>
  );
}

export function RoadmapTable({ series }: { series: RoadmapSeries[] }) {
  const years = series[0]?.points.length ?? 0;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-xs text-gray-600">
            <th className="py-2 pr-2 text-left font-medium">年目</th>
            {series.map((s) => (
              <th key={s.label} colSpan={3} className="py-2 pr-2 text-left font-medium">{s.label}</th>
            ))}
          </tr>
          <tr className="border-b border-gray-300 text-xs text-gray-600">
            <th />
            {series.map((s) => (
              <SubHeads key={s.label} />
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: years }, (_, i) => (
            <tr key={i} className="border-b border-gray-200">
              <th scope="row" className="py-1.5 pr-2 text-left font-normal">{i + 1}</th>
              {series.map((s) => {
                const p = s.points[i];
                return (
                  <SeriesCells key={s.label} p={p} />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubHeads() {
  return (
    <>
      <th className="py-1 pr-2 text-left font-normal">収量の割合</th>
      <th className="py-1 pr-2 text-right font-normal">農業所得</th>
      <th className="py-1 pr-2 text-right font-normal">一時の費用を引いた後</th>
    </>
  );
}

function SeriesCells({ p }: { p: YearPoint }) {
  return (
    <>
      <td className="py-1.5 pr-2 font-mono">{fmtNumber(p.yieldRatio * 100)}%</td>
      <td className="py-1.5 pr-2 text-right font-mono">{fmtMan(p.income)}</td>
      <td className="py-1.5 pr-2 text-right font-mono">{fmtMan(p.cashBeforeSupport)}</td>
    </>
  );
}
