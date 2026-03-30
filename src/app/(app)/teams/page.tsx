import { getTaskCountsByTeamIds } from "@/features/tasks/server/task.queries";
import { getWorkspaceSummary } from "@/features/teams/server/workspace.queries";
import { TeamsListClient } from "../../../features/teams/components/TeamsListClient";

export default async function TeamsPage() {
  const workspaceTeams = await getWorkspaceSummary();
  const taskCountsByTeam = await getTaskCountsByTeamIds(workspaceTeams.map((team) => team.id));

  const teams = workspaceTeams.map((team) => ({
    id: team.id,
    name: team.name,
    description: team.description ?? "",
    createdBy: team.created_by ?? "",
    taskCount: taskCountsByTeam[team.id] ?? 0,
    members: team.team_member ?? [],
  }));

  return <TeamsListClient teams={teams} />;
}