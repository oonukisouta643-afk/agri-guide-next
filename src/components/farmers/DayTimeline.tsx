import type { DaySchedule } from "@/data/farmers";

// 農家の1日（桃農家・繁忙期のスケジュール）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ farmers」／旧サイト agri-farmers.html var schedule
// 4:30〜18:00の9ステップ・タイムライン表示（時刻＋アイコン＋見出し＋説明文）

export function DayTimeline({ schedule }: { schedule: DaySchedule[] }) {
  return (
    <ol className="relative">
      <span
        aria-hidden
        className="absolute left-[10px] top-1 bottom-1 w-0.5 bg-gradient-to-b from-green-200 to-green-50"
      />
      {schedule.map((item) => (
        <li key={item.time} className="relative mb-5 flex items-start gap-4 last:mb-0">
          <span className="w-12 shrink-0 pt-1.5 text-right font-mono text-xs text-muted">
            {item.time}
          </span>
          <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-green-200 bg-green-50 text-sm">
            {item.icon}
          </span>
          <div className="flex-1 rounded border border-black/5 bg-white p-3 shadow-sm">
            <p className="text-sm font-bold text-ink">{item.activity}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
