import type { DaySchedule } from "@/data/farmers";

// 農家の1日（桃農家・繁忙期のスケジュール）
// 出典：AgriGuide_Next移行_要件定義書v2.0 §2「/ farmers」
// 4:30〜18:00の9ステップ・タイムライン表示

export function DayTimeline({ schedule }: { schedule: DaySchedule[] }) {
  return (
    <ol className="relative border-l-2 border-green-200 pl-6">
      {schedule.map((item) => (
        <li key={item.time} className="mb-6 last:mb-0">
          <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-green-700" />
          <p className="font-mono text-sm font-bold text-green-700">{item.time}</p>
          <p className="text-sm text-ink">{item.activity}</p>
        </li>
      ))}
    </ol>
  );
}
