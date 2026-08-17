import { competitorHeadline, competitors } from "@/data/admin/competitorMap";

export function CompetitorTab() {
  return (
    <div>
      <div className="rounded border-l-4 border-green-700 bg-green-50 p-4">
        <p className="font-bold text-ink">{competitorHeadline}</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-green-200 text-left text-xs text-muted">
              <th className="py-2 pr-4">サービス</th>
              <th className="py-2 pr-4">ターゲット層</th>
              <th className="py-2 pr-4">Agriとの関係</th>
              <th className="py-2">特徴</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr
                key={c.service}
                className={`border-b border-green-100 ${c.isSelf ? "bg-green-50" : ""}`}
              >
                <td className="py-3 pr-4 font-bold text-ink">{c.service}</td>
                <td className="py-3 pr-4 text-ink">{c.target}</td>
                <td className="py-3 pr-4 text-ink">{c.relation}</td>
                <td className="py-3 text-muted">{c.feature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
