// 品目アイコン（線画・落ち着いたトーンのピクトグラム）
// 出典：ProduceShowcase.tsxで使用。
//
// 変遷：
// 2026年8月20日①：絵文字＋グラデーションの見た目が「しょぼい・AIっぽい」というフィードバック
// を受け、塗りつぶしのカラフルなSVGイラストに差し替え。
// 2026年8月20日②：塗りつぶしイラストが「イラスト感が増した・リアリティがない」という
// フィードバックを受け、彩度を落とした線画（ストローク中心）のピクトグラムに再調整。
// 塗りは最小限（陰影1色のみ）にし、行政資料のような控えめなトーンを目指した。

type IconProps = {
  className?: string;
};

const STROKE = 1.6;

export function PeachIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 10c-1.4-2-3.6-3.1-6-3.1-5.6 0-9.5 5.2-9.5 12 0 9 7.3 16.4 15.5 16.4S39.5 28 39.5 19c0-4.1-1.6-7.8-4.3-9.9"
        fill="none"
        stroke="#4A4238"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <path
        d="M24 8c0 7 0 20 0 27"
        stroke="#4A4238"
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M24 8c-.5-2.4 1-4.5 3.4-5.2"
        stroke="#6B7A50"
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function AppleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 16c-1.2-.9-2.6-1.3-4-1.1-5.3.7-9 6.1-8.2 12.6.9 6.5 5.8 11.8 10.8 11.8.9 0 1.7-.2 2.6-.5.8.3 1.7.5 2.5.5 5 0 9.9-5.3 10.8-11.8.8-6.5-2.9-11.9-8.2-12.6-1.4-.2-2.8.2-4 1.1"
        fill="none"
        stroke="#4A4238"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <path
        d="M24 15c-.3-2.8 1-5.2 3.3-6.7"
        stroke="#6B7A50"
        strokeWidth={STROKE}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function KakiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle
        cx="24"
        cy="27"
        r="13.5"
        fill="none"
        stroke="#4A4238"
        strokeWidth={STROKE}
      />
      <path
        d="M24 27c-2.4-3-2.4-7 0-11 2.4 4 2.4 8 0 11z"
        fill="none"
        stroke="#6B7A50"
        strokeWidth={STROKE * 0.85}
        strokeLinejoin="round"
      />
      <path
        d="M24 27c-4.6-.8-7.4-3.6-9.3-7.3 4.6.3 8 2.3 9.3 7.3z"
        fill="none"
        stroke="#6B7A50"
        strokeWidth={STROKE * 0.85}
        strokeLinejoin="round"
      />
      <path
        d="M24 27c4.6-.8 7.4-3.6 9.3-7.3-4.6.3-8 2.3-9.3 7.3z"
        fill="none"
        stroke="#6B7A50"
        strokeWidth={STROKE * 0.85}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KyuriIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect
        x="7"
        y="19"
        width="34"
        height="11"
        rx="5.5"
        fill="none"
        stroke="#4A4238"
        strokeWidth={STROKE}
        transform="rotate(-16 24 24)"
      />
      <g
        stroke="#4A4238"
        strokeWidth={STROKE * 0.7}
        strokeLinecap="round"
        opacity="0.55"
        transform="rotate(-16 24 24)"
      >
        <line x1="14" y1="20.5" x2="14" y2="28.5" />
        <line x1="22" y1="19.5" x2="22" y2="29.5" />
        <line x1="30" y1="19.5" x2="30" y2="29.5" />
      </g>
    </svg>
  );
}

export function RiceIcon({ className }: IconProps) {
  const grains: { cx: number; cy: number; angle: number }[] = [
    { cx: 24, cy: 11, angle: 0 },
    { cx: 20, cy: 14.5, angle: -32 },
    { cx: 28, cy: 14.5, angle: 32 },
    { cx: 18.5, cy: 20, angle: -40 },
    { cx: 29.5, cy: 20, angle: 40 },
    { cx: 20, cy: 25.5, angle: -30 },
    { cx: 28, cy: 25.5, angle: 30 },
  ];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 41V17"
        stroke="#4A4238"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      {grains.map((g, i) => (
        <ellipse
          key={i}
          cx={g.cx}
          cy={g.cy}
          rx="2.6"
          ry="4.6"
          fill="none"
          stroke="#8A6E2F"
          strokeWidth={STROKE * 0.8}
          transform={`rotate(${g.angle} ${g.cx} ${g.cy})`}
        />
      ))}
    </svg>
  );
}

export const produceIconByKey = {
  peach: PeachIcon,
  apple: AppleIcon,
  kaki: KakiIcon,
  kyuri: KyuriIcon,
  rice: RiceIcon,
} as const;
