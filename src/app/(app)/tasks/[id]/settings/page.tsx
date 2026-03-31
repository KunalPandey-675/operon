import { getCurrentUserId } from "@/lib/current-user";
import { getTaskById } from "@/features/tasks/server/task.queries";
import { getWorkspaceById } from "@/features/teams/server/workspace.queries";
import TaskSettingsClient from "@/features/tasks/components/TaskSettingsClient";

export default async function TaskSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [task, userId] = await Promise.all([getTaskById(id), getCurrentUserId()]);
  const workspace = task?.team_id ? await getWorkspaceById(task.team_id) : null;

  const isOwner = Boolean(workspace && userId && workspace.created_by === userId);

  return <TaskSettingsClient task={task} isOwner={isOwner} />;
}
