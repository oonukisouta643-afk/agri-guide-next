// データの種類バッジ。色だけで区別しないよう、必ず文字で種類を書く。
import type { DataKind } from "../types";
import { KIND_LABEL } from "../format";

const STYLE: Record<DataKind, string> = {
  official: "border-sky-300 bg-sky-50 text-sky-900",
  estimate: "border-amber-300 bg-amber-50 text-amber-900",
  field: "border-emerald-300 bg-emerald-50 text-emerald-900",
  placeholder: "border-dashed border-gray-400 bg-gray-50 text-gray-700",
};

export function KindBadge({ kind }: { kind: DataKind }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-bold leading-none ${STYLE[kind]}`}>
      {KIND_LABEL[kind]}
    </span>
  );
}
