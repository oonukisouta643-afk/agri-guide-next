import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

// Section 7：Team（チーム）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §5
// 写真なし（仮データ期間中）・テキストカード2枚

const members = [
  {
    role: "PROJECT LEAD",
    name: "大貫 想太",
    bio: "代表・伊達市在住。ギークス株式会社でToB営業をフルリモートで担当。農業経験ゼロの移住者。",
  },
  {
    role: "FIELD PARTNER",
    name: "渡辺（協力者）",
    bio: "現場担当。果樹研究所勤務・桑折町出身。就農を目指して修行中。",
  },
];

export function Team() {
  return (
    <section className="px-5 py-14 sm:px-10 sm:py-[72px]">
      <Reveal>
        <SectionHeader title="チーム" />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {members.map((member, i) => (
          <Reveal key={member.name} delayMs={i * 100}>
            <Card className="h-full">
              <p className="font-mono text-xs font-bold text-green-700">{member.role}</p>
              <p className="mt-2 font-serif text-lg font-bold text-ink">{member.name}</p>
              <p className="mt-2 text-sm text-muted">{member.bio}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-5xl text-center text-xs text-muted">
        ※写真が撮れ次第、差し替え予定です。
      </p>
    </section>
  );
}
