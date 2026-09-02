// シミュレーターのプログレスバー
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6／agri-simulator-v4.html（旧版）updProg()（398〜407行目）
// 上部固定・緑で塗りつぶし・「Q○ / 10」＋ステップごとの励ましラベルを表示

type ProgressBarProps = {
  current: number;
  total: number;
};

// 旧版のlabels配列（405行目）をそのまま移植。index 0は使わず、ステップ番号(1〜10)に対応。
const stepLabels: string[] = [
  "",
  "まずは基本情報から",
  "基本情報",
  "基本情報",
  "農業のことを教えてください",
  "農業のことを教えてください",
  "就農のイメージ",
  "就農のイメージ",
  "資金のことを教えてください",
  "あと少し！",
  "最後の質問です！",
];

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  const label = stepLabels[current] ?? "";
  return (
    <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur px-5 py-3 shadow-sm">
      <div className="mx-auto max-w-content">
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-muted">{label}</p>
          <p className="font-mono text-xs font-bold text-green-700">
            Q{current} / {total}（{percent}%）
          </p>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-green-100"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`質問 ${current} / ${total}`}
        >
          <div
            className="h-full bg-green-700 transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
