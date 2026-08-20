"use client";

import { useState } from "react";
import Link from "next/link";
import { WarningBox } from "@/components/ui/WarningBox";
import { timelinePhases } from "@/data/tools/timelineData";

// Tool E：就農タイムライン
// 旧サイト（agri-tools.html 326-345, 882-933行）の5フェーズ・接続された縦タイムライン・
// フェーズ毎3項目チェックリスト・現在地バナー（非該当フェーズを淡色化）を移植。

export function TimelineTool() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = timelinePhases[currentIndex];

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        「今日から就農まで」何をいつやればいいか。まず自分が今どのフェーズにいるかを確認してください。
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {timelinePhases.map((phase, i) => (
          <button
            key={phase.key}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              i === currentIndex
                ? "border-green-700 bg-green-700 text-white"
                : "border-green-200 bg-white text-ink hover:bg-green-50"
            }`}
          >
            {phase.icon} {phase.label}
          </button>
        ))}
      </div>

      {/* 現在地バナー */}
      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3.5 py-3 text-xs font-bold text-green-800">
        📍 あなたの現在地：{current.label}　→　次にやるべきことは「{current.nextAction}」です
      </div>

      {/* 接続された縦タイムライン */}
      <div className="relative mt-5 pl-8">
        <div className="absolute bottom-0 left-[13px] top-0 w-0.5 rounded bg-gradient-to-b from-green-400 to-green-100" />
        {timelinePhases.map((phase, i) => {
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;
          const opacity = isCurrent ? 1 : isPast ? 0.4 : 0.75;
          return (
            <div
              key={phase.key}
              className="relative mb-5 transition-all duration-300"
              style={{ opacity, transform: isCurrent ? "scale(1.01)" : undefined }}
            >
              <div
                className={`absolute -left-8 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-sm shadow ${
                  isCurrent ? "bg-green-600" : isPast ? "bg-gray-300" : phase.dotColorClass
                }`}
              >
                {phase.icon}
              </div>
              <div className="rounded border border-black/5 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] text-muted">{phase.months}</p>
                <p className="mt-0.5 text-sm font-bold text-ink">{phase.label}</p>
                <ul className="mt-2 space-y-1">
                  {phase.checklist.map((item) => (
                    <li key={item} className="border-b border-black/5 py-1 text-xs leading-relaxed text-ink last:border-b-0">
                      ・{item}
                    </li>
                  ))}
                </ul>
                {phase.link && (
                  (phase.link.href.startsWith("http") ? (
                    <a
                      href={phase.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-bold text-green-700 hover:underline"
                    >
                      {phase.link.text} →
                    </a>
                  ) : (
                    <Link href={phase.link.href} className="mt-2 inline-block text-xs font-bold text-green-700 hover:underline">
                      {phase.link.text} →
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <WarningBox type="warn" className="mt-2">
        ⚠️ 仮データです。実際のスケジュールは条件により異なります。ふくのうに相談して確認してください。
      </WarningBox>
    </div>
  );
}
