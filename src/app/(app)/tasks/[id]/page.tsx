import { getTaskById } from "@/features/tasks/server/task.queries";
import { getTaskMessages } from "@/features/tasks/server/task.messages.queries";
import { getWorkspaceById } from "@/features/teams/server/workspace.queries";
import TaskDetailsClient from "@/features/tasks/components/TaskDetailsClient";
import { getCurrentUserId } from "@/lib/current-user";

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [task, userId, messages] = await Promise.all([getTaskById(id), getCurrentUserId(), getTaskMessages(id)]);

  const workspace = task?.team_id
    ? await getWorkspaceById(task.team_id)
    : null;

  const canEdit = Boolean(workspace && userId && workspace.created_by === userId);

  return <TaskDetailsClient task={task} workspace={workspace} canEdit={canEdit} currentUserId={userId} messages={messages} />;
}
