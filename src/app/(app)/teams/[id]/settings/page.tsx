import { getCurrentUserId } from "@/lib/current-user";
import { getWorkspaceById } from "@/features/teams/server/workspace.queries";
import TeamSettingsClient from "@/features/teams/components/TeamSettingsClient";

export default async function TeamSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [workspace, userId] = await Promise.all([getWorkspaceById(id), getCurrentUserId()]);

  const isOwner = Boolean(workspace && userId && workspace.created_by === userId);

  return <TeamSettingsClient workspace={workspace} isOwner={isOwner} />;
}
