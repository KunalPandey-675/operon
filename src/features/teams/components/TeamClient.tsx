"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  Plus,
  Settings,
  Users,
  UserPlus,
  Layout,
  Filter,
  Search,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { AvatarGroup } from "@/features/teams/components/AvatarGroup";
import { Task, TaskStatus } from "@/lib/mock-data";
function toTaskStatus(task: DbTask): TaskStatus {
  const normalized = (task.status ?? "").trim().toLowerCase();
  const isDone = normalized === "done";
  const isOverdue = !!task.deadline && new Date(task.deadline).getTime() < Date.now();

  if (isDone) return "Completed";
  if (isOverdue) return "Deadline Passed";
  return "Pending";
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No deadline";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "No deadline";
  return date.toLocaleDateString();
}

type TeamMemberDetails = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
};

type TeamClientProps = {
  workspace: DbTeamWithRelations | null;
  memberDirectory: TeamMemberDetails[];
};

export default function TeamClient({ workspace, memberDirectory }: TeamClientProps) {
  const [filter, setFilter] = useState("All");
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!workspace) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-12 text-center">
        <p className="font-semibold text-gray-700">Team not found.</p>
      </div>
    );
  }

  const workspaceMembers = workspace.team_member ?? [];
  const fallbackAssignee = {
    id: workspaceMembers[0]?.user_id ?? "unassigned",
    name: workspaceMembers[0]?.user_id ? `User ${workspaceMembers[0].user_id.slice(0, 6)}` : "Unassigned",
    email: "",
    avatar: "",
  };

  const normalizedTasks: Task[] = (workspace.tasks ?? []).map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description ?? "No description provided.",
    status: toTaskStatus(task),
    assignee: {
      ...fallbackAssignee,
      id: task.created_by ?? fallbackAssignee.id,
      name: task.created_by_name ?? fallbackAssignee.name,
    },
    dueDate: formatDeadline(task.deadline),
    teamId: workspace.id,
  }));

  const filteredTasks = filter === "All"
    ? normalizedTasks
    : normalizedTasks.filter((t) => t.status === filter);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(workspace.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/teams"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Teams
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 px-3 border-gray-200">
            <Settings className="mr-2 h-4 w-4" /> Team Config
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Team Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{workspace.name}</h1>
          </div>
          <p className="text-lg text-gray-500 leading-relaxed font-normal">{workspace.description}</p>

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            {workspaceMembers.length > 0 ? (
              <AvatarGroup users={workspaceMembers} max={4} />
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <Users className="h-3.5 w-3.5 text-blue-500" />
                0 Members
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => setShowInvitePanel((prev) => !prev)}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Invite Members
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => setShowMembersList((prev) => !prev)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showMembersList ? "Hide Members" : "View Members"}
            </Button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <Layout className="h-4 w-4 text-blue-500" />
              {normalizedTasks.length} Active Tasks
            </div>
          </div>

          {showInvitePanel ? (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Team Code</p>
                <p className="text-lg font-extrabold tracking-widest text-blue-900">{workspace.code}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-blue-200 bg-white text-blue-700 hover:bg-blue-100"
                onClick={handleCopyCode}
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied" : "Copy to Clipboard"}
              </Button>
            </div>
          ) : null}

          {showMembersList ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-3">
                <p className="text-sm font-semibold text-gray-700">Team Members</p>
              </div>
              {memberDirectory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {memberDirectory.map((member) => (
                        <tr key={member.id}>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {member.name?.trim() || "Unknown user"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {member.email?.trim() || "No email"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                              {member.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-4 py-6 text-sm text-gray-500">No members found for this team yet.</p>
              )}
            </div>
          ) : null}
        </div>

        <Link href="/tasks/create">
          <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 font-bold transition-all hover:scale-105 active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Create Task
          </Button>
        </Link>
      </div>

      {/* Tabs and Filtering */}
      <Tabs defaultValue="All" className="w-full" onValueChange={setFilter}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
          <TabsList className="bg-gray-100/50 p-1 rounded-xl h-11 self-start md:self-auto border border-gray-100">
            <TabsTrigger value="All" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="Completed" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">Completed</TabsTrigger>
            <TabsTrigger value="Pending" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm">Pending</TabsTrigger>
            <TabsTrigger value="Deadline Passed" className="rounded-lg px-6 h-9 font-bold data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm">Deadlines</TabsTrigger>
          </TabsList>

          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-9 h-11 bg-white border-gray-100 rounded-xl" />
            </div>
            <Button variant="outline" className="h-11 px-4 border-gray-100 bg-white rounded-xl font-bold uppercase text-[10px] tracking-widest">
              <Filter className="mr-2 h-4 w-4 text-blue-500" /> Sort
            </Button>
          </div>
        </div>

        <TabsContent value={filter} className="mt-8">
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTasks.map((task, idx) => (
                <TaskCard key={task.id} task={task} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed">
              <div className="h-16 w-16 rounded-full bg-blue-100/50 flex items-center justify-center mb-6">
                <Layout className="h-8 w-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 max-w-sm font-normal">
                Try adjusting your filters or create a new task for this team workspace.
              </p>
              <Link href="/tasks/create" className="mt-8">
                <Button variant="outline" className="h-11 px-6 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold uppercase text-[10px] tracking-widest">
                  Create First Task
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
