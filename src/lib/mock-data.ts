export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  members: User[];
  taskCount: number;
};

export type TaskStatus = 'Pending' | 'Completed' | 'Deadline Passed';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: User;
  dueDate: string;
  teamId: string;
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://github.com/shadcn.png' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', avatar: 'https://github.com/shadcn.png' },
  { id: '3', name: 'James Wilson', email: 'james@example.com', avatar: 'https://github.com/shadcn.png' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: 'https://github.com/shadcn.png' },
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Product Design',
    description: 'Working on the core SaaS platform design system.',
    members: MOCK_USERS.slice(0, 3),
    taskCount: 12,
  },
  {
    id: 'team-2',
    name: 'Frontend Engine',
    description: 'Developing the Next.js application and UI components.',
    members: MOCK_USERS.slice(1, 4),
    taskCount: 8,
  },
  {
    id: 'team-3',
    name: 'Growth & Marketing',
    description: 'Focused on user acquisition and landing page funnels.',
    members: [MOCK_USERS[0], MOCK_USERS[3]],
    taskCount: 5,
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement Navigation Drawer',
    description: 'Create a responsive navigation drawer for mobile users.',
    status: 'Completed',
    assignee: MOCK_USERS[0],
    dueDate: '2024-03-25',
    teamId: 'team-1',
  },
  {
    id: 'task-2',
    title: 'Refactor Auth Hook',
    description: 'Improve the performance of the session validation.',
    status: 'Pending',
    assignee: MOCK_USERS[1],
    dueDate: '2024-03-28',
    teamId: 'team-2',
  },
  {
    id: 'task-3',
    title: 'Landing Page SEO Opt.',
    description: 'Optimize meta tags and heading structure for search engines.',
    status: 'Deadline Passed',
    assignee: MOCK_USERS[2],
    dueDate: '2024-03-20',
    teamId: 'team-3',
  },
  {
    id: 'task-4',
    title: 'Team Dashboard Grid',
    description: 'Implement a responsive grid for the workspaces dashboard.',
    status: 'Pending',
    assignee: MOCK_USERS[3],
    dueDate: '2024-03-30',
    teamId: 'team-1',
  },
];
