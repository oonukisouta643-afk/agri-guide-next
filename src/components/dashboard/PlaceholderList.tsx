import { Card } from "@/components/ui/Card";
import { placeholderItems } from "@/data/dashboard/placeholderData";

export function PlaceholderList() {
  return (
    <div className="space-y-3">
      {placeholderItems.map((item) => (
        <Card key={item.area}>
          <p className="font-bold text-ink">{item.area}</p>
          <p className="mt-1 text-sm text-muted">{item.detail}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span>📁 {item.file}</span>
            <span>⏳ 必要な情報：{item.needsFrom}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
