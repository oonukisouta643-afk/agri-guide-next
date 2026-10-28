import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { serviceOverview, valueSummary, futureVision } from "@/data/admin/overview";

// 2026年10月28日：画面の注意書きから、内部向けの依頼文（「Claudeが作成」「行政へ提示する前に確認を」）を外した（⑦と同じ扱い）。
// 中身は Claude が作った案のままなので、行政に見せる前に大貫さんが確かめる（ハンドブック第6章）。
export function OverviewTab() {
  return (
    <div className="space-y-6">
      <WarningBox type="warn">
        このタブは、各タブを踏まえた Agri-Guide の総括の案です。
      </WarningBox>

      <Card>
        <h3 className="font-bold text-ink">{serviceOverview.headline}</h3>
        <p className="mt-2 text-sm text-ink">{serviceOverview.description}</p>
        <p className="mt-3 border-t border-green-200 pt-3 text-sm text-muted">
          {serviceOverview.background}
        </p>
      </Card>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">提供価値（各タブより）</p>
        <div className="space-y-3">
          {valueSummary.map((v) => (
            <Card key={v.point}>
              <div className="flex items-start gap-3">
                <span className="rounded-sm bg-sky-900 px-2 py-0.5 text-xs font-bold text-white">
                  {v.from}
                </span>
                <div>
                  <p className="font-bold text-ink">{v.point}</p>
                  <p className="mt-1 text-sm text-muted">{v.detail}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">今後の展開</p>
        <div className="space-y-3">
          {futureVision.map((f) => (
            <div key={f.phase} className="rounded border-l-4 border-green-700 bg-green-50 p-4">
              <p className="font-mono text-xs font-bold text-green-700">{f.phase}</p>
              <p className="mt-1 text-sm text-ink">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
