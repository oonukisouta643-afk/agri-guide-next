import { Button } from "@/components/ui/Button";

// Section 1：Hero（ファーストビュー）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5
// 背景：農村風景の写真＋グラデーションオーバーレイ（可読性確保のため）。
// 出典：Unsplash（フリー素材）

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-10 sm:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-green-900/60 to-green-900/80"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-content text-center">
        <h1 className="text-white">農業という生き方を、もっとリアルに。</h1>
        <p className="mt-4 text-white/90">
          農業に興味はある。でも、まだ踏み出せていない。そんなあなたへ——福島県北に住む移住経験者が「農家人生のリアル」を一緒に解き明かします。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button href="/simulator" size="md" className="w-full sm:w-auto">
            🌿 就農シミュレーターを試す（無料・3分）
          </Button>
          <Button href="/tools" variant="ghost" size="sm" className="text-white hover:bg-white/10">
            まず農業カレンダーで1年を見てみる
          </Button>
        </div>
      </div>
    </section>
  );
}
