import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WarningBox } from "@/components/ui/WarningBox";
import { SubsidyTabs } from "@/components/subsidies/SubsidyTabs";

// / subsidies　補助金・支援制度一覧
// 出典：旧サイト（Netlify版）agri-subsidies.html（2026年8月20日調査・作成）をNext.js版へ移植。
// 福島県・県北6市町村（伊達市／桑折町／国見町／二本松市／大玉村／本宮市）・JAふくしま未来の
// 就農支援制度を地域タブで切り替えて確認できるページ。

export const metadata: Metadata = {
  title: "補助金・支援制度一覧",
  description:
    "福島県北6市町村＋県＋JAふくしま未来の新規就農・農業経営に関する補助金・支援制度を地域ごとにまとめた一覧です。",
};

export default function SubsidiesPage() {
  return (
    <div className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <SectionHeader
        eye="subsidy guide"
        title="県北6市町村＋県の補助金・支援制度一覧"
        lead="新規就農・農業経営に関する補助金は、市町村ごとに制度も窓口も異なります。地域を選んで、使えそうな制度を確認してください。"
      />

      <div className="mx-auto mt-6 max-w-5xl space-y-4">
        <WarningBox type="warn">
          掲載内容は2026年8月時点の公開情報をもとにした調査結果です。金額・要件は変更される場合があるため、申請前に必ず各窓口へ直接ご確認ください。「要確認」表示のある項目は、公式サイト上で金額や詳細が確認できなかったものです。
        </WarningBox>

        {/* 出典：ResultScreen.tsxの④.5と同内容。地域を比較検討するこのページでも
            同じ期待値調整メッセージを伝えるために追加（2026年9月5日）。 */}
        <WarningBox type="info">
          <p className="font-bold">🤝 地域に受け入れられるまでの実態</p>
          <p className="mt-1 leading-relaxed">
            補助金・制度と同じくらい重要なのが、地域のコミュニティとの関係づくりです。現地の農家・行政・JA・農業普及機関への取材を通じて見えてきたことですが、新規就農者は地域おこし協力隊や地元出身者（Uターン）のケースが中心で、農地や技術の引き継ぎも地域の人間関係の中で進むことが多いようです。比較検討の段階から、お試し就農体験などで早めに現地に顔を出しておくことをおすすめします。
          </p>
          <p className="mt-2 text-xs opacity-80">
            ※ 桑折町の新規就農者・行政関係者への取材をもとにした実態把握であり、網羅的な調査結果ではありません。
          </p>
        </WarningBox>
      </div>

      <div className="mx-auto mt-10 max-w-5xl">
        <SubsidyTabs />
      </div>

      <p className="mx-auto mt-10 max-w-5xl rounded-lg bg-white p-4 text-xs leading-relaxed text-muted shadow">
        このページは2026年8月20日時点の各自治体・県・JAの公開情報をもとに作成した参考情報です。制度は年度ごとに変更・終了する場合があります。実際の申請にあたっては、必ず各窓口に最新の内容をご確認ください。誤りにお気づきの場合はお問い合わせよりご連絡いただけると助かります。
      </p>
    </div>
  );
}
