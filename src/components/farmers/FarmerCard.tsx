import { Badge } from "@/components/ui/Badge";
import type { FarmerProfile } from "@/data/farmers";
import { siteConfig } from "@/data/site";

// 農家プロフィールカード
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ farmers」／旧サイト agri-farmers.html .profile-card
// プロフィールカード：絵文字アバター・品目/規模タグ・就農前職業・自己資金・農業収入（4年目）・
// 農地規模・研修期間・就農のきっかけの6データ＋農家ごとの「話を聞いてみたい」CTA付き仮データカード

export function FarmerCard({ farmer }: { farmer: FarmerProfile }) {
  const scaleTag = farmer.landSize;
  const statusTag = farmer.farmingYears.includes("独立準備中") ? "独立準備中" : "新規就農";

  const mailSubject = encodeURIComponent(`${farmer.name}の話を聞いてみたい`);
  const mailBody = encodeURIComponent(`気になった農家さん：${farmer.name}\n聞いてみたいこと：`);
  const mailtoHref = `mailto:${siteConfig.contactEmail}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded border border-green-200 bg-white shadow-sm">
      <div className="flex items-start gap-3.5 p-5 pb-4">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-2xl">
          {farmer.avatar}
        </div>
        <div className="flex-1">
          <p className="font-serif text-[17px] font-bold text-ink">
            {farmer.name}（{farmer.area}）
          </p>
          <p className="mt-0.5 text-xs text-muted">{farmer.farmingYears}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge color="gold" text={`${farmer.avatar} ${farmer.crop.replace("農家", "")}`} />
            <Badge color="green" text={scaleTag} />
            <Badge color="green" text={statusTag} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 px-5 pb-1 text-sm">
        <dl className="contents">
          <dt className="text-muted">就農前職業</dt>
          <dd className="text-right text-ink">{farmer.beforeJob}</dd>
          <dt className="text-muted">自己資金</dt>
          <dd className="text-right text-ink">{farmer.ownCapital}</dd>
          <dt className="text-muted">農業収入（4年目）</dt>
          <dd className="text-right text-ink">{farmer.incomeYear4}</dd>
          <dt className="text-muted">農地規模</dt>
          <dd className="text-right text-ink">{farmer.landSize}</dd>
          <dt className="text-muted">研修期間</dt>
          <dd className="text-right text-ink">{farmer.trainingPeriod}</dd>
          <dt className="text-muted">就農のきっかけ</dt>
          <dd className="text-right text-ink">{farmer.trigger}</dd>
        </dl>
      </div>

      <p className="mt-3 border-t border-green-200 px-5 pb-4 pt-3 text-sm italic text-ink">
        「{farmer.quote}」
      </p>

      <div className="mt-auto flex items-center justify-between bg-green-50 px-5 py-3">
        <span className="text-xs text-muted">📍 {farmer.area}</span>
        <a
          href={mailtoHref}
          className="rounded-full border border-green-200 bg-white px-3.5 py-1.5 text-xs font-bold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
        >
          話を聞いてみたい
        </a>
      </div>
    </div>
  );
}
