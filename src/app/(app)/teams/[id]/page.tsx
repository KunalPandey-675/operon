import React from "react";
import { getTasksByTeamId } from "@/features/tasks/server/task.queries";
import { getWorkspaceById } from "@/features/teams/server/workspace.queries";
import { fetchUsersByTeamId } from "@/features/members/server/member.queries";
import TeamClient from "@/features/teams/components/TeamClient";


export default async function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspace = await getWorkspaceById(id);

  if (!workspace) {
    return <TeamClient workspace={null} memberDirectory={[]} />;
  }

  const [tasks, members] = await Promise.all([
    getTasksByTeamId(id),
    fetchUsersByTeamId(id),
  ]);

  const workspaceWithTasks = workspace
    ? {
        ...workspace,
        tasks,
      }
    : null;

  return <TeamClient workspace={workspaceWithTasks} memberDirectory={members} />;
}
