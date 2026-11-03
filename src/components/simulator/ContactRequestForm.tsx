"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { SimulatorState } from "@/lib/simulator/types";
import { describeAnswers, sendSimulatorNotice } from "@/lib/simulator/notify";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/data/site";

// 結果画面の「返事がほしい方」の欄（2026年11月3日に追加）
// メールアドレスは任意。送ったときだけ、回答と一緒に運営者に届く（lib/simulator/notify.ts）。
// 扱いは /privacy の「4. 就農シミュレーター」に書いてある。

const MESSAGE_MAX = 1000;

type Props = { answers: SimulatorState; level: number };

export function ContactRequestForm({ answers, level }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  // ボット除け（人には見えない欄。入っていたら Apps Script 側で捨てる）
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!agreed || status === "sending") return;
    setStatus("sending");
    const ok = await sendSimulatorNotice({
      kind: "contact",
      answers: describeAnswers(answers),
      level,
      email: email.trim(),
      message: message.trim(),
      website,
    });
    setStatus(ok ? "sent" : "error");
    if (ok) trackEvent("simulator_contact_submit", { motivation_level: level });
  }

  if (status === "sent") {
    return (
      <Card>
        <h3 className="font-bold text-ink">送りました</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          いただいたメールアドレスに、運営者からお返事します。数日かかることがあります。届かないときは、迷惑メールのフォルダも確かめてください。
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-bold text-ink">この結果について、運営者から返事がほしい方へ</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink">
        メールアドレスを書いて送ると、この結果の回答と一緒に運営者に届きます。入力は任意です。お返事は、制度や相談先のご案内が中心です。地域の方の紹介や園地をお約束するものではありません。
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block text-sm">
          <span className="font-bold text-ink">メールアドレス</span>
          <input
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-1 block w-full rounded border border-green-200 bg-white px-3 py-2 text-base"
          />
        </label>
        <label className="block text-sm">
          <span className="font-bold text-ink">聞きたいこと（任意。お名前などは書かなくて大丈夫です）</span>
          <textarea
            maxLength={MESSAGE_MAX}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded border border-green-200 bg-white px-3 py-2 text-base"
          />
        </label>
        <div aria-hidden="true" className="hidden">
          <label>
            website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>
        <label className="flex items-start gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <span>
            メールアドレスと回答をお返事のために使うことに同意します（
            <Link href="/privacy" className="text-green-700 underline">
              プライバシーポリシー
            </Link>
            ）
          </span>
        </label>
        <button
          type="submit"
          disabled={!agreed || status === "sending"}
          className="rounded bg-green-700 px-5 py-2 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50"
        >
          {status === "sending" ? "送っています…" : "送る"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-700">
            送れませんでした。お手数ですが、下の「メールで相談する」か、{siteConfig.contactEmail} あてにお送りください。
          </p>
        )}
      </form>
    </Card>
  );
}
