import { Card } from "@/components/ui/Card";
import { WarningBox } from "@/components/ui/WarningBox";
import { ecosystemRoles, ecosystemGapInsight, validationStatus } from "@/data/admin/ecosystemMap";

export function EcosystemTab() {
  return (
    <div className="space-y-6">
      <WarningBox type="warn">
        このタブは2026年9月3日の合同相談会（伊達市・JA・普及所・県）の内容をもとにした整理で、大貫さんの見立てとしての仮説段階です。地域の農家コミュニティ組織については直接ヒアリング前のため、固有名詞を出さず一般的な表現に留めています。行政・JAへ提示する前に内容の確認をお願いします。
      </WarningBox>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">新規就農前フェーズの役割分担</p>
        <div className="space-y-3">
          {ecosystemRoles.map((role) => (
            <Card key={role.org}>
              <p className="font-bold text-ink">{role.org}</p>
              <p className="mt-2 text-sm text-ink">
                <span className="font-bold text-green-700">できていること：</span>
                {role.strength}
              </p>
              <p className="mt-1 text-sm text-muted">
                <span className="font-bold text-gold">手薄なこと：</span>
                {role.gap}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-green-700 bg-green-50 p-5">
        <p className="font-bold text-green-700">{ecosystemGapInsight.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">{ecosystemGapInsight.body}</p>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-muted">検証状況（★未確定の点）</p>
        <ul className="space-y-2">
          {validationStatus.map((item) => (
            <li key={item} className="rounded border-l-4 border-sky-900 bg-white p-3 text-sm text-ink shadow-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
