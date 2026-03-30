import TaskSection from "@/features/tasks/components/TasksSection";
import getTasks from "@/features/tasks/server/task.queries";
import { getWorkspaceSummary } from "@/features/teams/server/workspace.queries";

export default async function TasksPage() {
  const tasks = await getTasks()
  const teams = await getWorkspaceSummary()
  return <TaskSection tasks={tasks} teams={teams} />
}