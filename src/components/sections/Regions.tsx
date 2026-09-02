"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { regions } from "@/data/regions";
import { trackEvent } from "@/lib/analytics";

// Section 6：Regions（福島県北の就農支援施策）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5
// "use client"：GA4イベント送信（onClick）のため。詳細はsrc/lib/analytics.ts参照。

export function Regions() {
  return (
    <section id="chiiki" className="bg-green-50 px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader title="連携している地域" />
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4">
        {regions.map((region, i) => (
          <Reveal key={region.key} delayMs={(i % 3) * 100}>
            <div className="rounded border-l-4 border-green-700 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-ink">{region.name}</p>
                  <Badge text={region.tag} color="green" />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {region.crops.map((crop) => (
                    <span
                      key={crop}
                      className="rounded-sm bg-green-50 px-2 py-0.5 text-xs text-green-700"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted">{region.description}</p>
              </div>
              <ExternalLink
                href={region.link}
                className="mt-4 inline-block shrink-0 text-sm font-bold text-green-700 hover:underline sm:mt-0"
                onClick={() =>
                  trackEvent("region_referral_click", {
                    region_key: region.key,
                    region_name: region.name,
                    source: "homepage",
                  })
                }
              >
                詳細を確認する →
              </ExternalLink>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-muted">
        2026年7月26日就農フェアにて各行政担当者より掲載許可をいただいた情報です。
      </p>
    </section>
  );
}
