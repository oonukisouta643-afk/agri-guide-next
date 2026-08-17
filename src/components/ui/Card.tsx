// 共通UIコンポーネント：Card
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// 白背景・radius・shadow-sm・border

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded border border-green-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
