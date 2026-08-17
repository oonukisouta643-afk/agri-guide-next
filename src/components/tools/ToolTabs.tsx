"use client";

import { useEffect, useState } from "react";
import { CalendarTool } from "@/components/tools/CalendarTool";
import { QuizTool } from "@/components/tools/QuizTool";
import { CostCompareTool } from "@/components/tools/CostCompareTool";
import { AptitudeTool } from "@/components/tools/AptitudeTool";
import { TimelineTool } from "@/components/tools/TimelineTool";
import { VoicesTool } from "@/components/tools/VoicesTool";
import { ProfitTool } from "@/components/tools/ProfitTool";

// / tools　農業ツール集：7ツール（タブ切り替え式）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ tools」

const tabs = [
  { id: "calendar", label: "農業カレンダー", icon: "📅", Component: CalendarTool },
  { id: "quiz", label: "補助金クイズ", icon: "🎓", Component: QuizTool },
  { id: "cost", label: "コスト比較", icon: "🏙️", Component: CostCompareTool },
  { id: "aptitude", label: "農業適性チェック", icon: "🌱", Component: AptitudeTool },
  { id: "timeline", label: "就農タイムライン", icon: "🕒", Component: TimelineTool },
  { id: "voices", label: "断念者の本音", icon: "💬", Component: VoicesTool },
  { id: "profit", label: "品目別収益モデル", icon: "💰", Component: ProfitTool },
] as const;

export function ToolTabs() {
  const [activeId, setActiveId] = useState<string>(tabs[0].id);

  // ホームページのツールカードから「/tools#calendar」等のハッシュ付きリンクで
  // 遷移してきた場合、該当タブを初期選択する。
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (tabs.some((t) => t.id === hash)) {
      setActiveId(hash);
    }
  }, []);

  function handleSelect(id: string) {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const ActiveComponent = active.Component;

  return (
    <div>
      <div role="tablist" aria-label="農業ツール一覧" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => handleSelect(tab.id)}
            className={`rounded border px-3 py-2 text-sm font-bold transition-colors ${
              tab.id === activeId
                ? "border-green-700 bg-green-700 text-white"
                : "border-green-200 bg-white text-ink hover:bg-green-50"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-live="polite" className="mt-8">
        <ActiveComponent />
      </div>
    </div>
  );
}
