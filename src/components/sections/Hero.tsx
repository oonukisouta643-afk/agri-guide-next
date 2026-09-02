import { Button } from "@/components/ui/Button";

// Section 1：Hero（ファーストビュー）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5

export function Hero() {
  return (
    <section className="bg-green-50 px-5 py-14 sm:px-10 sm:py-[72px]">
      <div className="mx-auto max-w-content text-center">
        <h1 className="text-green-700">農業という生き方を、もっとリアルに。</h1>
        <p className="mt-4 text-muted">
          農業に興味はある。でも、まだ踏み出せていない。そんなあなたへ——福島県北に住む移住経験者が「農家人生のリアル」を一緒に解き明かします。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button href="/simulator" size="md" className="w-full sm:w-auto">
            🌿 就農シミュレーターを試す（無料・3分）
          </Button>
          <Button href="/tools" variant="ghost" size="sm">
            まず農業カレンダーで1年を見てみる
          </Button>
        </div>
      </div>
    </section>
  );
}
