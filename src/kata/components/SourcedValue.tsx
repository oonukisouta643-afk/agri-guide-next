// 出典つきの値を1つ表示する部品と、それを並べる表。
// 値・データの種類バッジ・出典（年）を必ずいっしょに出す。
import type { Source, Sourced } from "../types";
import { missingText } from "../format";
import { KindBadge } from "./KindBadge";

type SourceLookup = (id: string) => Source | undefined;

export function SourceRef({ sourceId, getSource, sourcesHref, year }: {
  sourceId: string;
  getSource: SourceLookup;
  /** 出典一覧のページ（`${sourcesHref}#${id}` にリンク） */
  sourcesHref: string;
  year?: number;
}) {
  const s = getSource(sourceId);
  return (
    <a href={`${sourcesHref}#${sourceId}`} className="text-xs text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-gray-900">
      {s ? s.publisher : sourceId}
      {year ? `（${year}年）` : ""}
    </a>
  );
}

export function SourcedValue({ s, format }: { s: Sourced<number>; format: (n: number) => string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {s.value === null ? (
        <span className="text-gray-500">{missingText(s)}</span>
      ) : (
        <span className="font-mono font-bold text-gray-900">{format(s.value)}</span>
      )}
      <KindBadge kind={s.kind} />
    </span>
  );
}

export type SourcedRow = { label: string; s: Sourced<number>; format: (n: number) => string; extra?: string };

export function SourcedTable({ rows, getSource, sourcesHref, caption }: {
  rows: SourcedRow[];
  getSource: SourceLookup;
  sourcesHref: string;
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        {caption && <caption className="mb-2 text-left text-xs text-gray-600">{caption}</caption>}
        <thead>
          <tr className="border-b border-gray-300 text-left text-xs text-gray-600">
            <th className="py-2 pr-3 font-medium">項目</th>
            <th className="py-2 pr-3 font-medium">値</th>
            <th className="py-2 font-medium">出典・注記</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-gray-200 align-top">
              <th scope="row" className="py-2 pr-3 text-left font-normal text-gray-800">{r.label}</th>
              <td className="py-2 pr-3"><SourcedValue s={r.s} format={r.format} /></td>
              <td className="py-2 text-xs text-gray-600">
                <SourceRef sourceId={r.s.sourceId} getSource={getSource} sourcesHref={sourcesHref} year={r.s.year} />
                {r.s.note && <span className="block">{r.s.note}</span>}
                {r.extra && <span className="block">{r.extra}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
