import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

// Section 8：Contact（お問い合わせ）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5

export function Contact() {
  return (
    <section className="bg-green-50 px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader
          title="お問い合わせ"
          lead="就農や移住について話を聞いてみたい方・農業関係者でアンケートに協力いただける方はお気軽にご連絡ください。"
        />
      </Reveal>
      <Reveal delayMs={100}>
        <div className="mx-auto mt-6 max-w-content text-center">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-lg font-bold text-green-700 hover:underline"
          >
            {siteConfig.contactEmail}
          </a>
          <p className="mt-2 text-sm text-muted">{siteConfig.url}</p>
        </div>
      </Reveal>
    </section>
  );
}
