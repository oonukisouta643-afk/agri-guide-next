import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { targetTiers, kpiImpactNote } from "@/data/admin/immigrationImpact";

export function ImmigrationTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-bold text-ink">{kpiImpactNote.headline}</h3>
        <p className="mt-2 text-sm text-ink">{kpiImpactNote.description}</p>
      </Card>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">ターゲット3層構造</p>
        <div className="space-y-3">
          {targetTiers.map((tier) => (
            <Card key={tier.level}>
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-green-700 px-2 py-0.5 text-xs font-bold text-white">
                  {tier.level}
                </span>
                <span className="font-bold text-ink">{tier.label}</span>
              </div>
              <p className="mt-2 text-sm text-ink">{tier.definition}</p>
              <p className="mt-1 text-xs text-muted">主なアクション：{tier.action}</p>
            </Card>
          ))}
        </div>
      </div>

      <WarningBox type="info">{kpiImpactNote.dataStatus}</WarningBox>
    </div>
  );
}
