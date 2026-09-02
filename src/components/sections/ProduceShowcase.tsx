import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { produceItems } from "@/data/produce";

// ProduceShowcase：福島県北の特産品カード（Fieldセクションの直後に独立セクションとして配置）
// 出典：OLD版 index.html #440-467（.produce-strip）
//
// 変遷：
// 2026年8月20日①：絵文字＋グラデーションの見た目が「しょぼい・AIっぽい」というフィードバックを
// 受け、塗りつぶしのカラフルなSVGイラストに差し替え。
// 2026年8月20日②：「イラスト感が増した・リアリティがない」というフィードバックを受け、
// Unsplashの実写真（無料ライセンス）に差し替え。next/imageは使わずimgタグで直接指定
// （Hero.tsxの背景画像と同じ方式。next.config.mjsに画像ドメイン設定が不要なため）。

export function ProduceShowcase() {
  return (
    <section className="bg-green-50 px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          eye="福島県北の特産品"
          title={
            <>
              農業の<span className="font-bold text-green-700">豊かさ</span>を知っていますか？
            </>
          }
          lead="盆地の寒暖差と豊かな水が、桃・りんご・梨・さくらんぼ・きゅうりなど多様な品目を育てます。東京から新幹線で約80分の立地です。"
        />
      </Reveal>

      <Reveal delayMs={100}>
        <div className="mx-auto mt-8 flex max-w-5xl gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
          {produceItems.map((item) => (
            <div
              key={item.key}
              className="w-40 shrink-0 overflow-hidden rounded-lg border border-green-200 bg-white shadow-sm sm:w-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photoUrl}
                alt={item.name}
                loading="lazy"
                className="h-28 w-full object-cover"
              />
              <div className="p-3">
                <p className="font-bold text-ink">
                  {item.emoji} {item.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
                <span className="mt-2 inline-block rounded-sm bg-green-50 px-2 py-0.5 text-xs text-green-700">
                  {item.season}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
