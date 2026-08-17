import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { tools } from "@/data/tools";
import Link from "next/link";

// Section 5：Tools（ツール一覧）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5
// 見出しは要件定義書の記載通りHowセクションと同一文言（原文ママ）

export function Tools() {
  return (
    <section className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          title="シミュレーターの前にまず体感してみる"
          lead="農業カレンダー・補助金クイズ・コスト比較・適性チェックの7つのツールを用意しています"
        />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool, i) => (
          <Reveal
            key={tool.id}
            delayMs={(i % 4) * 75}
            className={tool.wide ? "sm:col-span-2" : undefined}
          >
            <Link href={tool.href} className="block h-full">
              <Card className="h-full transition-shadow hover:shadow">
                <p className="text-2xl">{tool.icon}</p>
                <p className="mt-2 font-bold text-ink">{tool.title}</p>
                <p className="mt-1 text-sm text-muted">{tool.description}</p>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button href="/tools" variant="secondary">
          ツール集をすべて見る →
        </Button>
      </div>
    </section>
  );
}
