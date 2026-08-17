import { Card } from "@/components/ui/Card";
import { fukunouIssues, complementaryRole } from "@/data/admin/fukunouRelation";

export function FukunouTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-bold text-ink">{complementaryRole.headline}</h3>
        <p className="mt-2 text-sm text-ink">{complementaryRole.description}</p>
      </Card>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">ふくのうサイトの現状課題（運営者ヒアリングより）</p>
        <div className="space-y-3">
          {fukunouIssues.map((issue) => (
            <Card key={issue.title}>
              <p className="font-bold text-ink">{issue.title}</p>
              <p className="mt-1 text-sm text-muted">{issue.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
