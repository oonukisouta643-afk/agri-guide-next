import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { SubsidyProgram } from "@/data/subsidies";

// / subsidies　制度カード（1件分）
// 「要確認」項目は左ボーダー＋バッジで明示する（旧ページの.card.unclear / .tag-unclearに対応）。

type SubsidyProgramCardProps = {
  program: SubsidyProgram;
};

export function SubsidyProgramCard({ program }: SubsidyProgramCardProps) {
  const amountLines = program.amount.split("\n");

  return (
    <Card
      className={program.unclear ? "border-l-4 border-gold" : ""}
    >
      <div className="flex flex-wrap items-start gap-2">
        <p className="font-serif text-base font-black text-ink">{program.name}</p>
        {program.unclear && (
          <Badge text={program.unclearNote ?? "要確認"} color="gold" />
        )}
      </div>
      <p className="mt-2 inline-block rounded-sm bg-green-50 px-2.5 py-1 font-mono text-xs font-bold text-green-700">
        {amountLines.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
      {program.description && (
        <p className="mt-2 text-sm leading-relaxed text-ink">{program.description}</p>
      )}
      {program.meta && <p className="mt-2 text-xs text-muted">{program.meta}</p>}
    </Card>
  );
}
