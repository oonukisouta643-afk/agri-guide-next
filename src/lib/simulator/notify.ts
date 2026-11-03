import type { SimulatorState } from "@/lib/simulator/types";
import { questions } from "@/lib/simulator/questions";

// シミュレーターの回答を運営者に知らせる（2026年11月3日、大貫さんの依頼で追加）
// 送り先は Google Apps Script のウェブアプリ（scripts/apps-script/simulator-notify.gs）。
// Apps Script がスプレッドシートに1行書き、運営者の Gmail に通知する。
// URL は Vercel の環境変数 NEXT_PUBLIC_SIMULATOR_NOTIFY_URL。未設定なら何も送らない（GA4 と同じ考え方）。
//   ・"result"：10問に答えて結果画面が出たとき。氏名・連絡先は含めない
//   ・"contact"：結果画面の「返事がほしい方」の欄から、本人が送ったときだけ。メールアドレスを含む

const NOTIFY_URL = process.env.NEXT_PUBLIC_SIMULATOR_NOTIFY_URL;

export const isNotifyEnabled = Boolean(NOTIFY_URL);

type AnswerKey = keyof Omit<SimulatorState, "income" | "crops">;

function labelOf(key: AnswerKey | "crops", value: string): string {
  for (const q of questions) {
    if (q.kind === "single" && q.key === key) return q.options.find((o) => o.value === value)?.label ?? value;
    if (q.kind === "multi" && key === "crops") {
      for (const g of q.groups) {
        const found = g.options.find((o) => o.value === value);
        if (found) return found.label;
      }
    }
    if (q.kind === "capIncome" && key === "cap") return q.options.find((o) => o.value === value)?.label ?? value;
    if (q.kind === "dual" && key === "worry") return q.worryOptions.find((o) => o.value === value)?.label ?? value;
    if (q.kind === "dual" && key === "timing") return q.timingOptions.find((o) => o.value === value)?.label ?? value;
  }
  return value;
}

/** 回答を、スプレッドシートの列にそのまま入る日本語のラベルにする */
export function describeAnswers(s: SimulatorState): Record<string, string> {
  const one = (key: AnswerKey) => (s[key] ? labelOf(key, s[key] as string) : "未回答");
  return {
    年代: one("age"),
    家族: one("family"),
    いまの住まい: one("loc"),
    品目: s.crops.map((c) => labelOf("crops", c)).join("・") || "未選択",
    農業の経験: one("exp"),
    就農の形: one("type"),
    規模: one("scale"),
    自己資金: one("cap"),
    目標の年収: `約${s.income}万円`,
    一番の不安: one("worry"),
    動きたい時期: one("timing"),
    知りたいこと: one("window"),
  };
}

type NotifyPayload =
  | { kind: "result"; answers: Record<string, string>; level: number }
  | { kind: "contact"; answers: Record<string, string>; level: number; email: string; message: string; website: string };

/** 送れたら true。URL 未設定・通信の失敗は false（画面は止めない） */
export async function sendSimulatorNotice(payload: NotifyPayload): Promise<boolean> {
  if (!NOTIFY_URL) return false;
  try {
    // Content-Type を text/plain にして、Apps Script が受けられる単純なリクエストにする
    const res = await fetch(NOTIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      keepalive: payload.kind === "result",
    });
    if (!res.ok) return false;
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return data?.ok === true;
  } catch {
    return false;
  }
}
