// 品目アイコン（線画風SVG）
// 出典：ProduceShowcase.tsxで使用。2026年8月20日、絵文字＋グラデーションの見た目が
// 「しょぼい・AIっぽい」というフィードバックを受けて、外部画像に依存しない
// オリジナルのライン風SVGアイコンに差し替え。
//
// 各アイコンは共通の視覚言語（丸みのある果実シルエット＋葉・軸のアクセント）で統一し、
// 品目ごとの特徴（桃の割れ目、りんごの凹み、あんぽ柿の萼、きゅうりの筋、稲穂の粒）で差別化した。

type IconProps = {
  className?: string;
};

export function PeachIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 9c-1.6-2.6-4.2-4-7-4-6.5 0-11 6-11 14 0 10.5 8.5 19 18 19s18-8.5 18-19c0-4.8-1.9-9-5-11.5"
        fill="#F6A15C"
      />
      <path
        d="M24 12c0 8 0 18 0 26"
        stroke="#D97A3A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M24 9c-.6-3 1.2-5.6 4.2-6.4"
        stroke="#5C8A3A"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="30.5"
        cy="4.3"
        rx="4.4"
        ry="2.2"
        fill="#7CB35C"
        transform="rotate(24 30.5 4.3)"
      />
    </svg>
  );
}

export function AppleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 15c-1.4-1-3-1.4-4.6-1.2-6.2.8-10.4 7-9.4 14.6 1 7.5 6.7 13.6 12.4 13.6 1 0 2-.2 3-.6.9.4 1.9.6 2.9.6 5.7 0 11.4-6.1 12.4-13.6 1-7.6-3.2-13.8-9.4-14.6-1.6-.2-3.2.2-4.6 1.2-.9-.6-1.7-1-2.7-1s-1.8.4-2.7 1z"
        fill="#E0554F"
      />
      <path
        d="M24 14c-.3-3.2 1.2-6 3.8-7.8"
        stroke="#7A4A2E"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="29.6"
        cy="5.2"
        rx="4.3"
        ry="2.2"
        fill="#6FA83F"
        transform="rotate(-18 29.6 5.2)"
      />
    </svg>
  );
}

export function KakiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="27" r="15.5" fill="#DB8E3A" />
      <path
        d="M24 27c-3-4-3-9.5 0-15 3 5.5 3 11 0 15z"
        fill="#8A9A4A"
        opacity="0.9"
      />
      <path
        d="M24 27c-6-1-9.5-4.7-12-9.5 6 .3 10.5 3 12 9.5z"
        fill="#8A9A4A"
        opacity="0.9"
      />
      <path
        d="M24 27c6-1 9.5-4.7 12-9.5-6 .3-10.5 3-12 9.5z"
        fill="#8A9A4A"
        opacity="0.9"
      />
      <circle cx="24" cy="18.5" r="1.6" fill="#5C6A2E" />
    </svg>
  );
}

export function KyuriIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect
        x="6"
        y="18"
        width="36"
        height="13"
        rx="6.5"
        fill="#8FC26B"
        transform="rotate(-18 24 24)"
      />
      <g
        stroke="#5C8A3A"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.6"
        transform="rotate(-18 24 24)"
      >
        <line x1="12" y1="20" x2="12" y2="29" />
        <line x1="20" y1="19" x2="20" y2="30" />
        <line x1="28" y1="19" x2="28" y2="30" />
        <line x1="36" y1="20" x2="36" y2="29" />
      </g>
      <ellipse
        cx="9"
        cy="15.3"
        rx="3.6"
        ry="1.9"
        fill="#6FA83F"
        transform="rotate(-40 9 15.3)"
      />
    </svg>
  );
}

export function RiceIcon({ className }: IconProps) {
  const grains = [
    { cx: 24, cy: 10, r: 0.2 },
    { cx: 19.5, cy: 13.5, r: -0.35 },
    { cx: 28.5, cy: 13.5, r: 0.35 },
    { cx: 18, cy: 19, r: -0.4 },
    { cx: 30, cy: 19, r: 0.4 },
    { cx: 19.5, cy: 24.5, r: -0.3 },
    { cx: 28.5, cy: 24.5, r: 0.3 },
  ];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 42V16"
        stroke="#C9A227"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {grains.map((g, i) => (
        <ellipse
          key={i}
          cx={g.cx}
          cy={g.cy}
          rx="3"
          ry="5"
          fill="#E7C24E"
          stroke="#C9A227"
          strokeWidth="0.75"
          transform={`rotate(${g.r * 90} ${g.cx} ${g.cy})`}
        />
      ))}
      <path
        d="M24 30c-3 2-5 5-5 5"
        stroke="#5C8A3A"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 33c3 2 5 5 5 5"
        stroke="#5C8A3A"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
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
