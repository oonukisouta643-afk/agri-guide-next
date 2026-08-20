import Link from "next/link";
import { navLinks, siteConfig } from "@/data/site";
import { surveyForms } from "@/data/forms";

// 共通Footer
// 出典：AgriGuide_Next移行_要件定義書v2.0 §4
// 背景 green-900・白文字。ロゴ・サービス説明1行・ナビリンク群・連絡先・
// アンケート5種へのテキストリンク・著作権表記。

export function Footer() {
  return (
    <footer className="bg-green-900 px-5 py-12 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div>
          <p className="font-serif text-lg font-bold">
            🌿 {siteConfig.fullName}
          </p>
          <p className="mt-2 text-sm text-white/80">
            農業という生き方を、もっとリアルに。福島県北地域への就農・移住を考える人の伴走サービスです。
          </p>
        </div>

        <nav
          aria-label="フッターナビゲーション"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">
            アンケートにご協力ください
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {surveyForms.map((form) => (
              <li key={form.id}>
                <a
                  href={form.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {form.id}：{form.target}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-white/80">
          <a href={`mailto:${siteConfig.contactEmail}`} className="hover:underline">
            {siteConfig.contactEmail}
          </a>
          <span className="mx-2">/</span>
          <a
            href={siteConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {siteConfig.url}
          </a>
        </div>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} 大貫想太 / {siteConfig.fullName}
        </p>
      </div>
    </footer>
  );
}
