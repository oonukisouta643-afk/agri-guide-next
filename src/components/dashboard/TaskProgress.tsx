import { Card } from "@/components/ui/Card";
import { pendingTasks, completedTasks } from "@/data/dashboard/tasks";

export function TaskProgress() {
  const total = pendingTasks.length + completedTasks.length;
  const percent = Math.round((completedTasks.length / total) * 100);

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between">
          <p className="font-bold text-ink">全体進捗</p>
          <p className="font-mono text-sm text-green-700">
            {completedTasks.length} / {total}（{percent}%）
          </p>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-sm bg-green-50">
          <div className="h-full bg-green-700 transition-all" style={{ width: `${percent}%` }} />
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold text-gold">PENDING（{pendingTasks.length}）</p>
          <ul className="space-y-2">
            {pendingTasks.map((t) => (
              <li key={t.id} className="flex items-start gap-2 text-sm text-ink">
                <span aria-hidden="true">☐</span>
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-green-700">COMPLETED（{completedTasks.length}）</p>
          <ul className="space-y-2">
            {completedTasks.map((t) => (
              <li key={t.id} className="flex items-start gap-2 text-sm text-muted line-through">
                <span aria-hidden="true" className="no-underline">✅</span>
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
