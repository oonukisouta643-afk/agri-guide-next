"use client";

import { useState } from "react";
import { SubsidyRegionPanel } from "@/components/subsidies/SubsidyRegionPanel";
import { subsidyRegions } from "@/data/subsidies";
import type { SubsidyRegionKey } from "@/data/subsidies";

// / subsidies　地域タブ切り替え（福島県／6市町村／JA、計8タブ）
// src/components/tools/ToolTabs.tsx のタブ実装パターンに準拠。

export function SubsidyTabs() {
  const [activeKey, setActiveKey] = useState<SubsidyRegionKey>(subsidyRegions[0].key);

  const activeRegion =
    subsidyRegions.find((r) => r.key === activeKey) ?? subsidyRegions[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="地域別 補助金一覧"
        className="flex flex-wrap gap-2"
      >
        {subsidyRegions.map((region) => (
          <button
            key={region.key}
            type="button"
            role="tab"
            aria-selected={region.key === activeKey}
            onClick={() => setActiveKey(region.key)}
            className={`rounded border px-3 py-2 text-sm font-bold transition-colors ${
              region.key === activeKey
                ? "border-green-700 bg-green-700 text-white"
                : "border-green-200 bg-white text-ink hover:bg-green-50"
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-live="polite" className="mt-8">
        <SubsidyRegionPanel region={activeRegion} />
      </div>
    </div>
  );
}
