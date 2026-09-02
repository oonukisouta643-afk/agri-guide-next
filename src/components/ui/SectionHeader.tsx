// 共通UIコンポーネント：SectionHeader
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// eye（小見出し・monospace小文字）・title・lead（リード文）

type SectionHeaderProps = {
  eye?: string;
  title: string;
  lead?: string;
  className?: string;
};

export function SectionHeader({ eye, title, lead, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mx-auto max-w-content text-center ${className}`}>
      {eye && (
        <p className="font-mono text-xs font-bold lowercase tracking-widest text-green-700">
          {eye}
        </p>
      )}
      <h2 className="mt-2 text-ink">{title}</h2>
      {lead && <p className="mt-3 text-muted">{lead}</p>}
    </div>
  );
}
