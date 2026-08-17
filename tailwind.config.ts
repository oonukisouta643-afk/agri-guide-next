import type { Config } from "tailwindcss";

// デザイントークン出典：AgriGuide_Next移行_要件定義書v2.0 §3（デザインシステム）
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 要件定義書のブレークポイント名（mobile/tablet/desktop）はTailwindの
    // デフォルト（sm/md/lg/xl/2xl）と役割が重なるため、標準スケールに
    // tablet=640px(sm)・desktop=1024px(lg)を対応させてそのまま利用する。
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        green: {
          50: "var(--g1)", // 背景・カード
          200: "var(--g3)", // ボーダー・区切り
          600: "var(--g5)", // ホバー状態・アクセント
          700: "var(--g6)", // メインカラー・CTA・見出し
          900: "var(--g9)", // Footer背景
        },
        gold: "var(--gold)", // 警告・注意・次点
        sky: {
          900: "var(--sky)", // 行政向け・情報系
        },
        red: {
          DEFAULT: "var(--red)", // エラー・禁止（控えめに使う）
        },
        ink: "var(--ink)", // 本文テキスト
        muted: "var(--muted)", // 補足テキスト
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-jp)", "serif"],
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)", // 14px カード・ボタン角丸
        sm: "var(--radius-sm)", // 10px 小さいチップ・バッジ
        lg: "var(--radius-lg)", // 18px モーダル・大きいカード
      },
      boxShadow: {
        sm: "var(--shadow-sm)", // カード
        DEFAULT: "var(--shadow)", // 浮いているUI要素
      },
      maxWidth: {
        content: "640px", // コンテンツ幅（中央寄せ）
      },
    },
  },
  plugins: [],
};
export default config;
