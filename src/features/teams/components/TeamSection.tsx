import { TeamCardItem } from "@/features/teams/components/TeamCardItem";
import { TeamListItem } from "@/features/teams/components/teams-list.types";

type TeamSectionProps = {
  title: string;
  teams: TeamListItem[];
  emptyMessage: string;
};

export function TeamSection({ title, teams, emptyMessage }: TeamSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
        <span className="text-sm font-medium text-gray-500">{teams.length}</span>
      </div>
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <TeamCardItem key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-sm text-gray-500">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
