// 共通UIコンポーネント：Badge
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// 小さいラベルチップ。color: green/gold/sky/red

type BadgeColor = "green" | "gold" | "sky" | "red";

const colorClasses: Record<BadgeColor, string> = {
  green: "bg-green-50 text-green-700 border-green-200",
  gold: "bg-[#fbf3e3] text-gold border-[#e8d5a8]",
  sky: "bg-[#e8eef5] text-sky-900 border-[#c3d3e3]",
  red: "bg-[#f7e6e6] text-red border-[#e5b8b8]",
};

type BadgeProps = {
  text: string;
  color?: BadgeColor;
  className?: string;
};

export function Badge({ text, color = "green", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-1 text-xs font-bold ${colorClasses[color]} ${className}`}
    >
      {text}
    </span>
  );
}
