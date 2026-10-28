import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { siteConfig } from "@/data/site";

// /privacy　プライバシーポリシー
// GA4（Google アナリティクス）を使うにあたり、Google アナリティクス利用規約が求める
// 「Google アナリティクスを使っていること・データの収集と処理のしくみ」の開示を置くページ。
// サイトが実際に集めている情報は、2026年10月28日にコードで確かめた範囲で書いている：
//   ・GA4（components/GoogleAnalytics.tsx、lib/analytics.ts のカスタムイベント。氏名・連絡先は送らない）
//   ・お問い合わせは mailto（サイトのサーバーには保存しない。components/sections/Contact.tsx）
//   ・アンケートは Google フォームへのリンク（data/forms.ts）
//   ・シミュレーターの回答はブラウザの中で計算し、共有用URLに入るだけ（サーバーには保存しない）。
//     共有用URL（?sim=）は、開いたあと URL から消し、GA4 には ?sim= を外した URL を送る（2026年10月28日から）
//   ・シミュレーター結果の「メールで相談する」は mailto で、本文に回答の一部が入る（lib/simulator/calculations.ts）
//   ・一部の画像は images.unsplash.com から直接読み込む（components/sections/Hero.tsx、data/produce.ts）
// 外部リンクは2026年10月28日に開けることを確かめた。

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  alternates: { canonical: "/privacy" },
  description: "県北ふくしまAgri-Guide が集める情報と、その使い方について。",
};

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "1. アクセス解析（Google アナリティクス）",
    body: (
      <>
        <p>
          このサイトでは、利用状況を知り、サイトをよくするために、Google LLC の「Google アナリティクス」を使っています。Google アナリティクスは Cookie などを使って、ページの閲覧（開いたページのURLを含みます）、リンクのクリック、シミュレーターの利用などの情報を、氏名などを含まない統計の形で集めます。氏名やメールアドレスなど、個人を特定できる情報は送っていません。
        </p>
        <p className="mt-3">
          集めた情報は、Google のプライバシーポリシーに沿って Google が管理します。しくみは「
          <ExternalLink href="https://policies.google.com/technologies/partner-sites?hl=ja" className="text-green-700 underline">
            Google のサービスを使用するサイトやアプリから収集した情報の Google による使用
          </ExternalLink>
          」をご覧ください。
        </p>
        <p className="mt-3">
          収集を止めたい場合は、ブラウザの設定で Cookie を無効にするか、「
          <ExternalLink href="https://tools.google.com/dlpage/gaoptout?hl=ja" className="text-green-700 underline">
            Google アナリティクス オプトアウト アドオン
          </ExternalLink>
          」を使ってください。
        </p>
      </>
    ),
  },
  {
    title: "2. お問い合わせ",
    body: (
      <p>
        お問い合わせフォームは、入力した内容でお使いのメールソフトを開くしくみです。このサイトのサーバーには保存しません。いただいたお名前・メールアドレス・内容は、お返事のためだけに使います。
      </p>
    ),
  },
  {
    title: "3. アンケート",
    body: (
      <p>
        アンケートは Google フォームで受け付けています。回答の扱いは、それぞれのフォームに書いてある説明に沿います。集計した結果は、個人が分からない形で、サービスの改善や、行政・関係団体への説明に使うことがあります。
      </p>
    ),
  },
  {
    title: "4. 就農シミュレーター",
    body: (
      <p>
        シミュレーターの回答は、お使いのブラウザの中で計算します。このサイトのサーバーには保存しません。結果を共有するためのURLには、回答の内容（年代・品目・自己資金など）が入ります。氏名などは入りません。共有用URLでページを開いたときは、Google アナリティクスには、回答の内容を外したURLを送ります。
      </p>
    ),
  },
  {
    title: "5. シミュレーターの「メールで相談する」",
    body: (
      <p>
        結果画面の「メールで相談する」を押すと、お使いのメールソフトが開き、回答の一部（就農の時期・農業の経験・品目・自己資金・目標の年収）が本文に入った状態になります。送るかどうかは、送信の前にご自身で内容を確かめて決められます。送っていただいた内容は、お問い合わせと同じく、お返事のためだけに使います。
      </p>
    ),
  },
  {
    title: "6. 外部のサービスから読み込むもの",
    body: (
      <p>
        一部の画像は、外部のサービス（Unsplash）から読み込んでいます。そのため、ページを開いたときに、お使いの端末の IP アドレスやブラウザの種類などが、そのサービスに送られます。
      </p>
    ),
  },
  {
    title: "7. 第三者への提供",
    body: (
      <p>
        法令にもとづく場合を除き、ご本人の同意なく、個人を特定できる情報を第三者に渡しません。
      </p>
    ),
  },
  {
    title: "8. お問い合わせ先と改定",
    body: (
      <>
        <p>
          この方針についてのお問い合わせは、運営者（{siteConfig.fullName}）の
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-green-700 underline">
            {siteConfig.contactEmail}
          </a>
          までお送りください。ご自身の情報の開示・訂正・削除のご希望も、同じアドレスで受け付けます。
        </p>
        <p className="mt-3">内容を変えるときは、このページでお知らせします。</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <SectionHeader eye="privacy" title="プライバシーポリシー" lead="このサイトが集める情報と、その使い方について。" />
      <div className="mx-auto mt-8 flex max-w-content flex-col gap-8 text-sm leading-relaxed text-ink">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-2 text-base font-bold text-green-800">{s.title}</h2>
            {s.body}
          </section>
        ))}
        <p className="text-xs text-muted">制定：2026年10月28日</p>
      </div>
    </div>
  );
}
