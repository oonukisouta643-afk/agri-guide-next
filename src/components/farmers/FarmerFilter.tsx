"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { FarmerCard } from "@/components/farmers/FarmerCard";
import type { ComingSoonCard, FarmerCategory, FarmerProfile } from "@/data/farmers";

// 農家プロフィール一覧の絞り込みフィルター
// 出典：旧サイト agri-farmers.html .filters / function filter()（すべて/🌳果樹/🥬野菜/🌱新規就農）
// 畜産ボタンは掲載対象がないため意図的に含めない（旧サイトで本日削除済み）

type FilterValue = "all" | FarmerCategory;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "fruit", label: "🌳 果樹" },
  { value: "veg", label: "🥬 野菜" },
  { value: "new", label: "🌱 新規就農" },
];

export function FarmerFilter({
  farmers,
  comingSoon,
}: {
  farmers: FarmerProfile[];
  comingSoon: ComingSoonCard[];
}) {
  const [active, setActive] = useState<FilterValue>("all");

  const visibleFarmers = farmers.filter(
    (f) => active === "all" || f.categories.includes(active)
  );
  const visibleComingSoon = comingSoon.filter(
    (c) => active === "all" || c.filterCategory === active
  );
  const count = visibleFarmers.length + visibleComingSoon.length;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActive(f.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
              active === f.value
                ? "border-green-700 bg-green-700 text-white"
                : "border-black/10 bg-white text-muted hover:border-green-400 hover:text-green-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-5xl items-center gap-3 font-mono text-xs uppercase tracking-widest text-green-700">
        掲載中の農家さん（{count}件）
        <span className="h-px flex-1 bg-green-100" aria-hidden />
      </div>

      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleFarmers.map((farmer, i) => (
          <Reveal key={farmer.id} delayMs={(i % 4) * 75}>
            <FarmerCard farmer={farmer} />
          </Reveal>
        ))}
      </div>

      {visibleComingSoon.length > 0 && (
        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {visibleComingSoon.map((c) => (
            <Reveal key={c.id}>
              <div className="flex h-full flex-col items-center justify-center rounded border border-dashed border-green-200 bg-green-50/50 p-6 text-center">
                <span className="text-3xl">{c.icon}</span>
                <p className="mt-2 font-bold text-ink">{c.category}（掲載準備中）</p>
                <p className="mt-2 text-xs text-muted">{c.beforeJob}</p>
                <p className="mt-1 text-xs text-muted">{c.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
