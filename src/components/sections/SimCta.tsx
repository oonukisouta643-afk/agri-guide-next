"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";

// SimCta：How直後に置く、シミュレーターへの単独グラデーションCTA
// 出典：OLD版 index.html #343-350（.sim-cta）
// "use client"：CTAクリックのGA4イベント送信（trackEvent）のため。

export function SimCta() {
  return (
    <section className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <div className="mx-auto max-w-3xl rounded-lg bg-gradient-to-br from-green-700 to-green-900 px-6 py-10 text-center text-white sm:px-10 sm:py-12">
          <p className="text-3xl" aria-hidden="true">
            🌿
          </p>
          <h3 className="mt-3 font-serif text-2xl font-bold">
            あなたの就農ロードマップを今すぐ作ってみる
          </h3>
          <p className="mt-3 text-sm text-white/85">
            農業経験ゼロでも大丈夫。3分で「もし農業をやったら」のシナリオと、もらえる補助金の目安がわかります。
          </p>
          <Link
            href="/simulator"
            onClick={() =>
              trackEvent("sim_cta_click", { source: "homepage_simcta" })
            }
            className="mt-6 inline-flex items-center justify-center gap-2 rounded bg-white px-6 py-3 text-base font-bold text-green-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow"
          >
            シミュレーターを試す →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
