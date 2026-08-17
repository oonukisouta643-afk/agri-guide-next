"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { voices, type Reason } from "@/data/tools/voicesData";

// Tool F：断念者の本音
// 「就農を諦めた人の声6件・理由バッジ」

const allReasons: Reason[] = ["情報格差", "相談窓口不明", "地域比較できない", "収入不安", "ロールモデル不在"];

export function VoicesTool() {
  const [filter, setFilter] = useState<Reason | null>(null);
  const filtered = filter ? voices.filter((v) => v.reasons.includes(filter)) : voices;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
            filter === null ? "border-green-700 bg-green-700 text-white" : "border-green-200 bg-white text-ink"
          }`}
        >
          すべて
        </button>
        {allReasons.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => setFilter(reason)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === reason ? "border-green-700 bg-green-700 text-white" : "border-green-200 bg-white text-ink"
            }`}
          >
            {reason}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((voice) => (
          <div key={voice.id} className="rounded border-l-[3px] border-green-700 bg-white p-4 shadow-sm">
            <p className="text-sm text-ink">「{voice.quote}」</p>
            <p className="mt-2 text-xs text-muted">{voice.attribution}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {voice.reasons.map((r) => (
                <Badge key={r} text={r} color="sky" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">
        ※仮データです。FORM 02の回答が集まり次第、実際の声に差し替えます。
      </p>
    </div>
  );
}
