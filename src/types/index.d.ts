type AppUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
} | null;

type AppShellProps = {
  children: React.ReactNode;
  user: AppUser;
};

type DbTaskStatus = "todo" | "in_progress" | "done";

type TaskStatus = "Pending" | "Completed" | "Deadline Passed";

type TaskAssigneeView = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
};

type TaskView = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: TaskAssigneeView;
  dueDate: string;
  teamId: string;
};

type DbTaskPriority = "low" | "medium" | "high";

type DbTask = {
  id: string;
  title: string;
  description: string | null;
  status: DbTaskStatus | null;
  priority: DbTaskPriority | null;
  created_by: string | null;
  created_by_name?: string | null;
  team_id: string | null;
  deadline: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type DbTeamMember = {
  id: string;
  user_id: string;
  role: string;
};

type DbTeam = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  created_by: string;
  created_at: string;
};

type DbTeamWithRelations = DbTeam & {
  team_member: DbTeamMember[];
  tasks: DbTask[];
};