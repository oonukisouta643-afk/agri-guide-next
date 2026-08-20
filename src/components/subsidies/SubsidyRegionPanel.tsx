import { SubsidyProgramCard } from "@/components/subsidies/SubsidyProgramCard";
import type { SubsidyRegion } from "@/data/subsidies";

// / subsidies　1地域分（グループ見出し＋制度カード一覧＋出典）の表示

type SubsidyRegionPanelProps = {
  region: SubsidyRegion;
};

export function SubsidyRegionPanel({ region }: SubsidyRegionPanelProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-serif text-xl font-black text-green-700">{region.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{region.contact}</p>
      </div>

      {region.groups.map((group) => (
        <div key={group.label} className="mb-6 last:mb-0">
          <p className="mb-2 pl-0.5 text-xs font-bold tracking-widest text-muted">
            {group.label}
          </p>
          <div className="flex flex-col gap-3">
            {group.programs.map((program) => (
              <SubsidyProgramCard key={program.name} program={program} />
            ))}
          </div>
        </div>
      ))}

      <p className="mt-4 rounded-sm bg-green-50 p-3 text-xs leading-relaxed text-green-700">
        {region.sourceNote}
      </p>
    </div>
  );
}
