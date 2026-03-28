export type TeamSizeFilter = "All" | "Small" | "Medium" | "Large";

export type TeamListMember = {
  id?: string;
  user_id?: string;
  name?: string;
  email?: string;
  avatar?: string;
};

export type TeamListItem = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  taskCount: number;
  members: TeamListMember[];
};
