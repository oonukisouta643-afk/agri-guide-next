// 共通UIコンポーネント：ExternalLink
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// 新タブ・rel=noopener

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className = "" }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
