import type { Metadata } from "next";
import Link from "next/link";
import { sources } from "@/kata";
import { fmtNumber } from "@/kata/format";
import {
  NEW_PLANTING_COST_FLOOR, NEW_PLANTING_YIELD_RATIO, RENT_YEN_PER_TEN_A, TAKEOVER_COST_FIXED_SHARE,
  TAKEOVER_ONE_TIME_YEN_PER_TEN_A, TAKEOVER_YIELD_RATIO,
} from "@/kata/roadmap";

export const metadata: Metadata = { title: "出典の一覧（見本）" };

const CROP_NAME: Record<string, string> = { momo: "もも", nashi: "なし", ringo: "りんご" };

export default function SourcesPage() {
  return (
    <main>
      <p className="text-sm"><Link href="/kata" className="underline decoration-gray-300 underline-offset-2">59市町村の一覧</Link></p>
      <h1 className="mt-2 text-2xl font-bold">出典の一覧</h1>
      <p className="mt-2 text-sm text-gray-700">
        数値は、県北ふくしまAgri-Guide「福島県59市町村 就農の地域データ」（2026年10月16日版）から取り込んでいます。元の資料は次のとおりです。利用条件は Phase 2 で資料ごとに確かめ直します。
      </p>

      <ul className="mt-6 space-y-4">
        {sources.map((s) => (
          <li key={s.id} id={s.id} className="scroll-mt-20 rounded border border-gray-200 p-3 text-sm">
            <p className="font-bold">{s.title}</p>
            <dl className="mt-1 grid grid-cols-[6rem_1fr] gap-x-2 gap-y-0.5 text-xs text-gray-700">
              <dt className="text-gray-500">発行</dt><dd>{s.publisher}</dd>
              <dt className="text-gray-500">データの年</dt><dd>{s.dataYear}</dd>
              {s.usedFor && (<><dt className="text-gray-500">使っている所</dt><dd>{s.usedFor}</dd></>)}
              <dt className="text-gray-500">利用条件</dt><dd>{s.license ?? "未確認（Phase 2 で確かめる）"}</dd>
              <dt className="text-gray-500">確かめた日</dt><dd>{s.accessedAt}</dd>
              <dt className="text-gray-500">URL</dt>
              <dd className="break-all"><a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.url}</a></dd>
            </dl>
          </li>
        ))}
      </ul>

      <section className="mt-10" id="formulas">
        <h2 className="mb-2 text-lg font-bold">計算式</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800">
          <li>部門別産出額の地方の合計＝所属する市町村の産出額の和。非公表・データなし・未取得の市町村は足さない</li>
          <li>産出額の県内順位＝令和5年の合計産出額を59市町村で大きい順に並べた順位</li>
          <li>農業所得＝販売額−経営費−地代。販売額＝成園の収量×収量の割合×単価×（面積÷10a）</li>
          <li>経営費（新しく植える）＝成園の経営費×（{NEW_PLANTING_COST_FLOOR}＋{fmtNumber(1 - NEW_PLANTING_COST_FLOOR, 1)}×収量の割合）×（面積÷10a）</li>
          <li>経営費（受け継ぐ）＝成園の経営費×（{TAKEOVER_COST_FIXED_SHARE}＋{fmtNumber(1 - TAKEOVER_COST_FIXED_SHARE, 1)}×収量の割合）×（面積÷10a）</li>
          <li>地代＝{fmtNumber(RENT_YEN_PER_TEN_A)}円/10a/年。受け継ぐときの一時金＝{fmtNumber(TAKEOVER_ONE_TIME_YEN_PER_TEN_A)}円/10a</li>
          {Object.entries(NEW_PLANTING_YIELD_RATIO).map(([id, r]) => (
            <li key={id}>新しく植える場合の収量の割合（{CROP_NAME[id] ?? id}、1〜{r?.length}年目）：{r?.map((x) => `${fmtNumber(x * 100)}%`).join("・")}</li>
          ))}
          <li>受け継ぐ場合の収量の割合（全品目、1〜{TAKEOVER_YIELD_RATIO.length}年目）：{TAKEOVER_YIELD_RATIO.map((x) => `${fmtNumber(x * 100)}%`).join("・")}</li>
          <li>補助金・国の支援・経営開始資金は、道のりの計算に入れていない</li>
        </ul>
        <p className="mt-2 text-xs text-gray-600">収量の割合・経営費の割合・地代・初期投資の根拠は、公開用データ08の「根拠・出典」の列に項目ごとに書いています。推測で置いた値を含みます。</p>
      </section>
    </main>
  );
}
