import { getWorkspace } from "@/features/teams/server/workspace.queries";
import { TeamsListClient } from "../../../features/teams/components/TeamsListClient";

export default async function TeamsPage() {
  const workspaceTeams = await getWorkspace();

  const teams = workspaceTeams.map((team) => ({
    id: team.id,
    name: team.name,
    description: team.description ?? "",
    taskCount: team.tasks?.length ?? 0,
    members: team.team_member ?? [],
  }));

  return <TeamsListClient teams={teams} />;
}