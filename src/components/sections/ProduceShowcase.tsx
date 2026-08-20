import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { produceItems, type ProduceKey } from "@/data/produce";
import { produceIconByKey } from "@/components/ui/ProduceIcons";

// ProduceShowcase：福島県北の特産品カード（Fieldセクションの直後に独立セクションとして配置）
// 出典：OLD版 index.html #440-467（.produce-strip）
// 2026年8月20日：絵文字＋グラデーションの見た目が「しょぼい・AIっぽい」というフィードバックを
// 受け、オリジナルのライン風SVGアイコン（ProduceIcons.tsx）に差し替え。

const gradientByKey: Record<ProduceKey, string> = {
  peach: "from-[#FDDCB5] to-[#F9A878]",
  apple: "from-[#FBE3E0] to-[#F2A6A0]",
  kaki: "from-[#F7DDB0] to-[#DE9A4E]",
  kyuri: "from-[#E2F5D3] to-[#A3DB8C]",
  rice: "from-[#F6EFD2] to-[#E2D08C]",
};

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
          {produceItems.map((item) => {
            const Icon = produceIconByKey[item.key];
            return (
              <div
                key={item.key}
                className="w-40 shrink-0 overflow-hidden rounded-lg border border-green-200 bg-white shadow-sm sm:w-auto"
              >
                <div
                  className={`flex h-28 items-center justify-center bg-gradient-to-br ${gradientByKey[item.key]}`}
                >
                  <Icon className="h-16 w-16 text-ink drop-shadow-sm" />
                </div>
                <div className="p-3">
                  <p className="font-bold text-ink">{item.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
                  <span className="mt-2 inline-block rounded-sm bg-green-50 px-2 py-0.5 text-xs text-green-700">
                    {item.season}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
