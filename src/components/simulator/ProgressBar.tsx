// シミュレーターのプログレスバー
// 出典：AgriGuide_Next移行_要件定義書v2.0 §6
// 上部固定・緑で塗りつぶし・「Q○ / 10」テキスト（%表示なし）

type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur px-5 py-3 shadow-sm">
      <div className="mx-auto max-w-content">
        <p className="text-center font-mono text-xs font-bold text-green-700">
          Q{current} / {total}
        </p>
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
