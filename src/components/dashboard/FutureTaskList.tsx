import { Badge } from "@/components/ui/Badge";
import { futureTasks } from "@/data/dashboard/futureTasks";

export function FutureTaskList() {
  return (
    <div className="space-y-3">
      {futureTasks.map((task) => (
        <div
          key={task.id}
          className="rounded border border-green-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge text={task.status === "done" ? "完了" : "計画中"} color={task.status === "done" ? "green" : "gold"} />
            <span className="font-mono text-xs text-muted">{task.id}</span>
            <span className="font-bold text-ink">{task.title}</span>
          </div>
          <p className="mt-2 text-sm text-muted">{task.description}</p>
          <p className="mt-1 text-xs text-muted">時期目安：{task.timing}</p>
        </div>
      ))}
    </div>
  );
}
