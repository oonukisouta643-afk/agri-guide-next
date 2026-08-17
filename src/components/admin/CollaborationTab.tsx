import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WarningBox } from "@/components/ui/WarningBox";
import {
  collaborationSteps,
  referralIdeas,
  supportingQuotes,
  expectedQA,
} from "@/data/admin/collaborationScenario";

const statusBadge = {
  done: { text: "実施済み", color: "green" as const },
  planned: { text: "計画中", color: "gold" as const },
  future: { text: "将来", color: "sky" as const },
};

export function CollaborationTab() {
  return (
    <div className="space-y-6">
      <WarningBox type="warn">
        このタブの連携シナリオ・想定Q&amp;Aは、要件定義書に文言の指定がなかったためClaudeが作成した案です（案C・Dとアンケートの声は実際の回答に基づきますが、サンプル数が少ない参考情報です）。行政へ提示する前に内容の確認をお願いします。
      </WarningBox>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">3ステップで信頼を積み上げる</p>
        <div className="space-y-3">
          {collaborationSteps.map((step) => (
            <Card key={step.step}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge text={statusBadge[step.status].text} color={statusBadge[step.status].color} />
                <span className="font-mono text-xs text-muted">{step.step}</span>
              </div>
              <p className="mt-2 font-bold text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">就農フェアとの連携案</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {referralIdeas.map((idea) => (
            <Card key={idea.id}>
              <p className="font-bold text-ink">{idea.title}</p>
              <p className="mt-1 text-sm text-muted">{idea.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">
          アンケート回答者の声（2026年7月26日フェア・サンプル数少）
        </p>
        <div className="space-y-3">
          {supportingQuotes.map((sq) => (
            <div key={sq.quote} className="rounded border-l-4 border-sky-900 bg-white p-4 shadow-sm">
              <p className="text-sm text-ink">「{sq.quote}」</p>
              <p className="mt-2 text-xs text-muted">
                {sq.role} ／ {sq.context}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">想定Q&amp;A</p>
        <div className="space-y-3">
          {expectedQA.map((qa) => (
            <Card key={qa.q}>
              <p className="font-bold text-ink">Q. {qa.q}</p>
              <p className="mt-2 text-sm text-muted">A. {qa.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
