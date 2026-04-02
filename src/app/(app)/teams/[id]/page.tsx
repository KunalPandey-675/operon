import React from "react";
import { getTasksByTeamId } from "@/features/tasks/server/task.queries";
import { getWorkspaceById } from "@/features/teams/server/workspace.queries";
import { fetchUsersByTeamId } from "@/features/members/server/member.queries";
import TeamClient from "@/features/teams/components/TeamClient";
import { getCurrentUserId } from "@/lib/current-user";


export default async function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [workspace, userId] = await Promise.all([getWorkspaceById(id), getCurrentUserId()]);
  const isOwner = Boolean(workspace && userId && workspace.created_by === userId);

  if (!workspace) {
    return <TeamClient workspace={null} memberDirectory={[]} isOwner={false} />;
  }

  const [tasks, members] = await Promise.all([
    getTasksByTeamId(id, {
      currentUserId: userId,
      isOwner,
    }),
    fetchUsersByTeamId(id),
  ]);

  const workspaceWithTasks = workspace
    ? {
        ...workspace,
        tasks,
      }
    : null;

  return <TeamClient workspace={workspaceWithTasks} memberDirectory={members} isOwner={isOwner} />;
}
