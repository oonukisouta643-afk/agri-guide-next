"use client";

import { useState, type FormEvent } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

// Section 8：Contact（お問い合わせ）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5、OLD版 index.html #615-627・#645-657（submitContactForm）
// バックエンドを持たない静的サイトのため、OLD版と同じくmailto:リンク生成方式で送信する。
// "use client"：フォーム入力状態・送信時のバリデーション/mailto遷移のため。

const inquiryTypes = [
  "βテスターとして登録したい",
  "農業・就農について相談したい",
  "行政・JA連携についての相談",
  "取材・メディアのご依頼",
  "その他",
];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      window.alert("お名前とメッセージは必須項目です。ご入力のうえ、もう一度お試しください。");
      return;
    }

    const subject = `【Agri-Guideサイト】お問い合わせ${type ? `（${type}）` : ""}`;
    const body = [
      `お名前：${trimmedName}`,
      `メールアドレス：${email.trim() || "（未入力）"}`,
      `お問い合わせ種別：${type || "（未選択）"}`,
      "",
      "【メッセージ】",
      trimmedMessage,
    ].join("\n");

    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className="bg-green-50 px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          title="お問い合わせ"
          lead="就農や移住について話を聞いてみたい方・農業関係者でアンケートに協力いただける方はお気軽にご連絡ください。"
        />
      </Reveal>
      <Reveal delayMs={100}>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-content rounded-lg border border-green-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-5">
            <label className="block text-sm" htmlFor="cf-name">
              <span className="font-bold text-ink">
                お名前<span className="text-red">*</span>
              </span>
              <input
                id="cf-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="mt-1.5 w-full rounded border border-green-200 px-3 py-2.5 text-sm text-ink"
              />
            </label>

            <label className="block text-sm" htmlFor="cf-email">
              <span className="font-bold text-ink">
                メールアドレス<span className="text-red">*</span>
              </span>
              <input
                id="cf-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="mt-1.5 w-full rounded border border-green-200 px-3 py-2.5 text-sm text-ink"
              />
            </label>

            <label className="block text-sm" htmlFor="cf-type">
              <span className="font-bold text-ink">
                お問い合わせ種別<span className="text-red">*</span>
              </span>
              <select
                id="cf-type"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1.5 w-full rounded border border-green-200 bg-white px-3 py-2.5 text-sm text-ink"
              >
                <option value="">選択してください</option>
                {inquiryTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm" htmlFor="cf-message">
              <span className="font-bold text-ink">
                メッセージ<span className="text-red">*</span>
              </span>
              <textarea
                id="cf-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="農業に関心を持ったきっかけや、気になっていることを教えてください"
                className="mt-1.5 w-full rounded border border-green-200 px-3 py-2.5 text-sm text-ink"
              />
            </label>

            <Button type="submit" className="w-full">
              送信する 🌿
            </Button>

            <p className="text-xs leading-relaxed text-muted">
              送信するとお使いのメールソフトが起動します。うまく開かない場合は{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-bold text-green-700 hover:underline"
              >
                {siteConfig.contactEmail}
              </a>{" "}
              へ直接メールをお送りください。
              <br />
              いただいた個人情報はお問い合わせへの返答にのみ使用します。
            </p>
          </div>
        </form>
      </Reveal>
    </section>
  );
}
