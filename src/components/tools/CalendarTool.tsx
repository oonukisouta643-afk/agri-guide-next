"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { calendarCrops } from "@/data/tools/calendarData";

// Tool A：農業カレンダー
// 「品目から住む場所を考える」4ステップ：①品目選択 → ②産地確認 → ③カレンダー表示 → ④安定化提案

const monthNames = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);

export function CalendarTool() {
  const [selectedKey, setSelectedKey] = useState(calendarCrops[0].key);
  const crop = calendarCrops.find((c) => c.key === selectedKey) ?? calendarCrops[0];
  const taskByMonth = new Map(crop.monthlyTasks.map((t) => [t.month, t]));

  return (
    <div>
      <p className="text-sm text-muted">
        ① 品目を選択 → ② 産地を確認 → ③ カレンダーを見る → ④ 収益を安定化させるヒントを知る
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {calendarCrops.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setSelectedKey(c.key)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              c.key === selectedKey
                ? "border-green-700 bg-green-700 text-white"
                : "border-green-200 bg-white text-ink hover:bg-green-50"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <h4 className="font-bold text-ink">② 主な産地</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {crop.productionAreas.map((area) => (
            <Badge key={area} text={area} color="green" />
          ))}
        </div>

        <h4 className="mt-6 font-bold text-ink">③ 年間カレンダー</h4>
        <div className="mt-3 grid grid-cols-6 gap-1 sm:grid-cols-12">
          {monthNames.map((label, i) => {
            const month = i + 1;
            const task = taskByMonth.get(month);
            return (
              <div
                key={month}
                className={`rounded-sm p-1.5 text-center text-[10px] ${
                  task ? "bg-green-700 text-white" : "bg-green-50 text-muted"
                }`}
                title={task?.task}
              >
                <div>{label}</div>
              </div>
            );
          })}
        </div>
        <ul className="mt-3 space-y-1 text-xs text-muted">
          {crop.monthlyTasks.map((t) => (
            <li key={t.month}>
              {t.month}月：{t.task}
            </li>
          ))}
        </ul>

        <h4 className="mt-6 font-bold text-ink">④ 収益を安定化させるヒント</h4>
        <p className="mt-2 text-sm text-ink">{crop.stabilizationTip}</p>
      </Card>

      <p className="mt-3 text-xs text-muted">
        ※品種・地域・気候により実際の時期は前後します。目安としてご覧ください。
      </p>
    </div>
  );
}
