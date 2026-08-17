// 共通UIコンポーネント：WarningBox
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// 左border付きカラーボックス。type: warn/info/tip

type WarningType = "warn" | "info" | "tip";

const typeClasses: Record<WarningType, string> = {
  warn: "border-gold bg-[#fbf3e3] text-[#6b5215]",
  info: "border-sky-900 bg-[#e8eef5] text-sky-900",
  tip: "border-green-700 bg-green-50 text-green-700",
};

type WarningBoxProps = {
  type?: WarningType;
  children: React.ReactNode;
  className?: string;
};

export function WarningBox({ type = "info", children, className = "" }: WarningBoxProps) {
  return (
    <div className={`rounded border-l-4 p-4 text-sm ${typeClasses[type]} ${className}`}>
      {children}
    </div>
  );
}
