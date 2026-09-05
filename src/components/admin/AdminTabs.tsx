"use client";

import { useState } from "react";
import { FukunouTab } from "@/components/admin/FukunouTab";
import { ImmigrationTab } from "@/components/admin/ImmigrationTab";
import { GapTab } from "@/components/admin/GapTab";
import { CollaborationTab } from "@/components/admin/CollaborationTab";
import { CompetitorTab } from "@/components/admin/CompetitorTab";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { EcosystemTab } from "@/components/admin/EcosystemTab";

// / admin　行政向け提案書：7タブ切り替え式
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ admin」（①〜⑤）
// ⑥は①〜⑤を踏まえた総括タブ（2026年8月17日追加・ユーザー依頼による）
// ⑦は2026年9月3日の合同相談会・9月5日の意義性整理を踏まえた支援体制マップ（2026年9月5日追加）

const tabs = [
  { id: "fukunou", label: "①ふくのうとの関係", Component: FukunouTab },
  { id: "immigration", label: "②移住者獲得への貢献", Component: ImmigrationTab },
  { id: "gap", label: "③需給ギャップの価値", Component: GapTab },
  { id: "collaboration", label: "④行政連携シナリオ", Component: CollaborationTab },
  { id: "competitor", label: "⑤競合ポジション", Component: CompetitorTab },
  { id: "overview", label: "⑥総括・ビジョン", Component: OverviewTab },
  { id: "ecosystem", label: "⑦支援体制マップ", Component: EcosystemTab },
] as const;

export function AdminTabs() {
  const [activeId, setActiveId] = useState<string>(tabs[0].id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const ActiveComponent = active.Component;

  return (
    <div>
      <div role="tablist" aria-label="行政向け提案書タブ" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => setActiveId(tab.id)}
            className={`rounded border px-3 py-2 text-sm font-bold transition-colors ${
              tab.id === activeId
                ? "border-sky-900 bg-sky-900 text-white"
                : "border-green-200 bg-white text-ink hover:bg-green-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-live="polite" className="mt-8">
        <ActiveComponent />
      </div>
    </div>
  );
}
