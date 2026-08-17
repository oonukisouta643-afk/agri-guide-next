import { Card } from "@/components/ui/Card";
import { gapHypotheses, gapValueProposition } from "@/data/admin/supplyDemandGap";

export function GapTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-bold text-ink">{gapValueProposition.headline}</h3>
        <p className="mt-2 text-sm text-ink">{gapValueProposition.description}</p>
      </Card>

      <div className="space-y-4">
        {gapHypotheses.map((h) => (
          <Card key={h.topic}>
            <p className="font-bold text-ink">{h.topic}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded bg-sky-900/5 p-3">
                <p className="text-xs font-bold text-sky-900">行政・一般的な想定</p>
                <p className="mt-1 text-sm text-ink">{h.officialAssumption}</p>
              </div>
              <div className="rounded bg-green-50 p-3">
                <p className="text-xs font-bold text-green-700">現場ヒアリングでの実態</p>
                <p className="mt-1 text-sm text-ink">{h.actualReality}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
