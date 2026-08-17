// GA4カスタムイベント送信ユーティリティ
//
// 背景：収益化検討（市町村への紹介料モデル）の第一歩として、
// 「シミュレーターで就農意欲レベルLv3に到達した人数」「特定の窓口・地域への遷移」を
// GA4上でリアルタイムに近い形で追えるようにする。個人を特定する情報（氏名・連絡先等）は
// 一切送信しない（GA4の利用規約上も禁止されているため）。あくまで匿名の行動集計用。
//
// GA4が未設定（NEXT_PUBLIC_GA_MEASUREMENT_ID未設定・components/GoogleAnalytics.tsx参照）の
// 場合は、window.gtagが存在しないため何も送信されない安全な設計。

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}
