// 差し込み口：現地での聞き取り。データがないときは何も出さない。
// 公開の了承がないもの（consentToPublish === false）は index.ts で落としてあるが、ここでも出さない。
import type { FieldNote } from "../types";
import { KindBadge } from "./KindBadge";

export function FieldNotesSlot({ notes, heading = "現地の聞き取り" }: { notes?: FieldNote[]; heading?: string }) {
  const shown = (notes ?? []).filter((n) => n.consentToPublish === true);
  if (shown.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold">{heading}</h2>
      <ul className="space-y-3">
        {shown.map((n) => (
          <li key={n.id} className="rounded border border-gray-200 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{n.title}</span>
              <KindBadge kind="field" />
            </div>
            <p className="mt-1 text-sm">{n.body}</p>
            <p className="mt-1 text-xs text-gray-600">
              {n.collectedBy}が{n.collectedAt}に{n.respondents}人に聞き取り
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
