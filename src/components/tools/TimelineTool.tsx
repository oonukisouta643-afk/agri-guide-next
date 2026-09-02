"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { timelinePhases } from "@/data/tools/timelineData";

// Tool E：就農タイムライン
// 「4フェーズ選択→現在地強調表示」

export function TimelineTool() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = timelinePhases.find((p) => p.key === selectedKey);

  return (
    <div>
      <p className="text-sm text-muted">今のご自身に一番近いものを選んでください。</p>

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {timelinePhases.map((phase, i) => (
          <div key={phase.key} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedKey(phase.key)}
              className={`flex-1 rounded border px-4 py-4 text-center text-sm font-bold transition-colors ${
                phase.key === selectedKey
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-green-200 bg-white text-ink hover:bg-green-50"
              }`}
            >
              {phase.label}
            </button>
            {i < timelinePhases.length - 1 && (
              <span className="hidden text-green-700 sm:block" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <Card className="mt-6">
          <p className="font-bold text-ink">{selected.label}</p>
          <p className="mt-2 text-sm text-ink">{selected.description}</p>
          <p className="mt-3 text-sm text-muted">{selected.suggestion}</p>
          {selected.link.href.startsWith("http") ? (
            <a
              href={selected.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-bold text-green-700 hover:underline"
            >
              {selected.link.text} →
            </a>
          ) : (
            <Link href={selected.link.href} className="mt-3 inline-block text-sm font-bold text-green-700 hover:underline">
              {selected.link.text} →
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
