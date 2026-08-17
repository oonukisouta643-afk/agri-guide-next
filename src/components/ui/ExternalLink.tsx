// 共通UIコンポーネント：ExternalLink
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// 新タブ・rel=noopener
// onClickは任意（GA4イベント送信など、遷移を妨げない副作用のためのフック）

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function ExternalLink({ href, children, className = "", onClick }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
