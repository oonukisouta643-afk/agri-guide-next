import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { surveyForms, type SurveyForm } from "@/data/forms";

// Section 4：Field（アンケート・フィールド調査）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5

const badgeColorByForm: Record<string, "green" | "sky" | "gold" | "red"> = {
  "FORM 01": "green",
  "FORM 02": "sky",
  "FORM 03": "sky", // 紫指定だがBadgeコンポーネントの色トークンに紫がないためskyで代用
  "FORM 04": "gold",
  "FORM 05": "red",
};

function FormRow({ form }: { form: SurveyForm }) {
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-green-200 py-3 last:border-b-0">
      <Badge text={form.id} color={badgeColorByForm[form.id] ?? "green"} />
      <span className="text-sm font-medium text-ink">{form.target}</span>
      <span className="text-xs text-muted">
        {form.questionCount}問・{form.duration}
      </span>
      <ExternalLink
        href={form.url}
        className="ml-auto text-sm font-bold text-green-700 hover:underline"
      >
        回答する →
      </ExternalLink>
    </li>
  );
}

export function Field() {
  return (
    <section className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader title="あなたの声が農業の未来を変える" />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Reveal>
          <Card>
            <p className="font-bold text-ink">データを社会に届ける</p>
            <p className="mt-2 text-sm text-muted">
              みなさんの回答は、行政や関係団体への提案資料としても活用され、支援制度の充実につながります。
            </p>
          </Card>
        </Reveal>
        <Reveal delayMs={100}>
          <Card>
            <p className="font-bold text-ink">転送で思わぬ人に届く</p>
            <p className="mt-2 text-sm text-muted">
              周りに就農・移住に興味がありそうな方がいたら、ぜひアンケートを転送してください。
            </p>
          </Card>
        </Reveal>
      </div>

      <Reveal delayMs={150}>
        <ul className="mx-auto mt-8 max-w-5xl rounded border border-green-200 bg-white px-5 shadow-sm">
          {surveyForms.map((form) => (
            <FormRow key={form.id} form={form} />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
