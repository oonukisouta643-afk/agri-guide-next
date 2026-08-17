// トップページのプレースホルダー
// Phase 2（全8セクションのLP実装）はまだ未着手。
// ここではPhase 1の成果物（デザイントークン・Header/Footer）が
// 正しく機能していることを確認するための最小限のスタブ。

export default function Home() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 text-center sm:px-10 sm:py-24">
      <h1 className="text-green-700">
        農業という生き方を、もっとリアルに。
      </h1>
      <p className="mt-4 text-muted">
        県北ふくしまAgri-Guideは現在Next.js 14への移行作業中です（Phase
        1：セットアップ・デザインシステム）。トップページ本体はPhase 2で実装予定です。
      </p>
    </div>
  );
}
