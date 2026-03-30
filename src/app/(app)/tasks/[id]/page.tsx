import { getTaskById } from "@/features/tasks/server/task.queries";
import { getWorkspaceById } from "@/features/teams/server/workspace.queries";
import TaskDetailsClient from "@/features/tasks/components/TaskDetailsClient";

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await getTaskById(id);

  const workspace = task?.team_id
    ? await getWorkspaceById(task.team_id)
    : null;

  return <TaskDetailsClient task={task} workspace={workspace} />;
}
