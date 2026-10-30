"use client";

import { trackSoudanFormClick } from "@/lib/analytics";

// /soudan の「相談フォームを開く」ボタン
// 出典：docs/INSTRUCTIONS_soudan-page.md「5. 作り方」
// JavaScriptが動かなくても開けるように、ふつうの <a> にして、クリック時に計測だけ呼ぶ。

type SoudanFormButtonProps = {
  href: string;
};

export function SoudanFormButton({ href }: SoudanFormButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackSoudanFormClick()}
      className="inline-flex items-center justify-center gap-2 rounded bg-green-700 px-5 py-3 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
    >
      相談フォームを開く
      <span className="text-xs font-normal opacity-90">（Googleフォーム）</span>
    </a>
  );
}
