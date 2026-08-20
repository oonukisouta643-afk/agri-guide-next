// 共通UIコンポーネント：Card
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// 白背景・radius-lg・shadow（tailwind.config.tsに定義済みだが未使用だったトークンを採用）
// カードが「独立した触れるアイテム」として一目で分かるよう、角丸を大きく・影を明確にし、
// 境界線は影に役割を譲って外した。

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow ${className}`}>{children}</div>
  );
}
