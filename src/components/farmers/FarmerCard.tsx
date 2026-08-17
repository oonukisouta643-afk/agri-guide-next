import { Card } from "@/components/ui/Card";
import type { FarmerProfile } from "@/data/farmers";

// 農家プロフィールカード
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ farmers」
// プロフィールカード：就農前職業・農業収入（4年目）・農地規模・研修期間の4データ付き仮データカード

export function FarmerCard({ farmer }: { farmer: FarmerProfile }) {
  return (
    <Card className="h-full">
      <div className="flex items-baseline justify-between">
        <p className="font-serif text-lg font-bold text-ink">
          {farmer.name}（{farmer.area}）
        </p>
        <span className="text-xs text-muted">{farmer.crop}</span>
      </div>
      <p className="mt-1 text-xs text-muted">{farmer.farmingYears}</p>

      <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
        <dt className="text-muted">就農前職業</dt>
        <dd className="text-right text-ink">{farmer.beforeJob}</dd>
        <dt className="text-muted">自己資金</dt>
        <dd className="text-right text-ink">{farmer.ownCapital}</dd>
        <dt className="text-muted">農業収入（4年目）</dt>
        <dd className="text-right text-ink">{farmer.incomeYear4}</dd>
        <dt className="text-muted">農地規模</dt>
        <dd className="text-right text-ink">{farmer.landSize}</dd>
        <dt className="text-muted">研修期間</dt>
        <dd className="text-right text-ink">{farmer.trainingPeriod}</dd>
      </dl>

      <p className="mt-4 border-t border-green-200 pt-3 text-sm text-ink">「{farmer.quote}」</p>
    </Card>
  );
}
