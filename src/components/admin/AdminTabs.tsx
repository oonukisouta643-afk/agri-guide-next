"use client";

import { useState } from "react";
import { FukunouTab } from "@/components/admin/FukunouTab";
import { ImmigrationTab } from "@/components/admin/ImmigrationTab";
import { CollaborationTab } from "@/components/admin/CollaborationTab";
import { CompetitorTab } from "@/components/admin/CompetitorTab";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { EcosystemTab } from "@/components/admin/EcosystemTab";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";

// / admin　行政向け提案書：7タブ切り替え式
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ admin」（①〜⑤）
// ⑥は①〜⑤を踏まえた総括タブ（2026年8月17日追加・ユーザー依頼による）
// ⑦は2026年9月3日の合同相談会・9月5日の意義性整理を踏まえた支援体制マップ（2026年9月5日追加）
//
// 2026年10月26日（docs/INSTRUCTIONS_admin-overview.md 段階A）：
// ・先頭に「全体像」タブを足し、最初に開くタブにした。
// ・③需給ギャップの価値はタブの並びから外した（レポートは2026年10月16日に取り下げ。部品とデータのファイルは残す）。
// ・各タブの頭に「目指す状態とのつながり」を一文で出す（connection）。④は中身（レポートの無償提供・有償化の交渉）と
// 　案の一文が合わないため、⑥は「全体像」と重なるため、段階Aでは出さない。

type AdminTab = {
  id: string;
  label: string;
  Component: () => JSX.Element;
  /** 目指す状態とのつながり（一文）。出さないタブは undefined */
  connection?: string;
};

const tabs: AdminTab[] = [
  { id: "summary", label: "全体像", Component: AdminOverviewTab },
  {
    id: "fukunou",
    label: "①ふくのうとの関係",
    Component: FukunouTab,
    connection: "県の情報発信と、その手前の一歩が重ならず、つながるように",
  },
  {
    id: "immigration",
    label: "②移住者獲得への貢献",
    Component: ImmigrationTab,
    connection: "地域とのつながりがない人が、福島を選びやすくなるように",
  },
  { id: "collaboration", label: "④行政連携シナリオ", Component: CollaborationTab },
  {
    id: "competitor",
    label: "⑤競合ポジション",
    Component: CompetitorTab,
    connection: "すでにある窓口や取組と、役割が重ならないように",
  },
  { id: "overview", label: "⑥総括・ビジョン", Component: OverviewTab },
  {
    id: "ecosystem",
    label: "⑦支援体制マップ",
    Component: EcosystemTab,
    connection: "だれが、どの段階を担っているかが見えるように",
  },
];

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
        {active.connection && (
          <p className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            目指す状態とのつながり：{active.connection}
          </p>
        )}
        <ActiveComponent />
      </div>
    </div>
  );
}
