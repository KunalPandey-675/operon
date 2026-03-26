type AppUser = {
  id?: string;
  auth0_id?: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
} | null;

type AppShellProps = {
  children: React.ReactNode;
  user: AppUser;
};

type DbTaskStatus = "todo" | "in_progress" | "done";

type DbTaskPriority = "low" | "medium" | "high";

type DbTask = {
  id: string;
  title: string;
  description: string | null;
  status: DbTaskStatus | null;
  priority: DbTaskPriority | null;
  created_by: string | null;
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