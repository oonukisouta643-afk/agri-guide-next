// Tool F：断念者の本音
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「Tool F：断念者の本音」
// 「就農を諦めた人の声6件・理由バッジ（情報格差/相談窓口不明/地域比較できない/収入不安/ロールモデル不在）」
// トップページStoryセクションの3件（仮データ）と同じ方針で、全件仮データ。
// 「AgriGuide_プロジェクト追記版_2026年8月」の通り、FORM 02の回答が集まり次第実データへ差し替え予定。

export type Reason = "情報格差" | "相談窓口不明" | "地域比較できない" | "収入不安" | "ロールモデル不在";

export type Voice = {
  id: string;
  quote: string;
  attribution: string;
  reasons: Reason[];
};

export const voices: Voice[] = [
  {
    id: "voice-1",
    quote: "何から調べればいいのか分からず、結局そのままになってしまいました。",
    attribution: "30代・会社員・東京都",
    reasons: ["情報格差"],
  },
  {
    id: "voice-2",
    quote: "農地を借りるハードルが高そうで、相談する勇気が出ませんでした。",
    attribution: "40代・自営業・神奈川県",
    reasons: ["相談窓口不明"],
  },
  {
    id: "voice-3",
    quote: "収入の見通しが立たず、家族を説得できませんでした。",
    attribution: "30代・会社員・埼玉県",
    reasons: ["収入不安"],
  },
  {
    id: "voice-4",
    quote: "どの地域が自分に合っているのか、比較する材料がありませんでした。",
    attribution: "20代・会社員・千葉県",
    reasons: ["地域比較できない"],
  },
  {
    id: "voice-5",
    quote: "自分と似た境遇で就農した人の話が聞けず、イメージが湧きませんでした。",
    attribution: "40代・会社員・大阪府",
    reasons: ["ロールモデル不在"],
  },
  {
    id: "voice-6",
    quote: "相談窓口がどこにあるのか分からず、情報を集めるだけで疲れてしまいました。",
    attribution: "30代・パート・宮城県",
    reasons: ["相談窓口不明", "情報格差"],
  },
];
