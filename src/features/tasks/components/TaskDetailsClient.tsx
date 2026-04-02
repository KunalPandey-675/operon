"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskDetailsHeader from "@/features/tasks/components/TaskDetailsHeader";
import TaskDetailsContent from "@/features/tasks/components/TaskDetailsContent";
import TaskDetailsSidebar from "@/features/tasks/components/TaskDetailsSidebar";
import type { TaskDetailsRecord } from "@/features/tasks/server/task.queries";

type TaskDetailsClientProps = {
  task: TaskDetailsRecord | null;
  workspace: DbTeamWithRelations | null;
  canEdit: boolean;
  currentUserId: string | null;
  messages: DbTaskMessageWithSender[];
};

const STATUS_CONFIG: Record<DbTaskStatus, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  in_progress: {
    label: "In Progress",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  done: {
    label: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

const PRIORITY_CONFIG: Record<DbTaskPriority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  medium: {
    label: "Medium",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  low: {
    label: "Low",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "NA";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return withTime ? "just now" : "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return withTime ? "just now" : "Not set";

  return new Intl.DateTimeFormat("en-US", withTime
    ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { month: "short", day: "numeric", year: "numeric" }
  ).format(date);
}

function getProgress(status: DbTaskStatus | null) {
  if (status === "done") return 100;
  if (status === "in_progress") return 68;
  return 24;
}

function getStatus(status: DbTaskStatus | null) {
  return (status && STATUS_CONFIG[status]) ?? { label: "Unknown", className: "border-gray-200 bg-gray-100 text-gray-700" };
}

function getPriority(priority: DbTaskPriority | null) {
  return (priority && PRIORITY_CONFIG[priority]) ?? { label: "Unset", className: "border-gray-200 bg-gray-100 text-gray-700" };
}

export default function TaskDetailsClient({ task, workspace, canEdit, currentUserId, messages }: TaskDetailsClientProps) {
  if (!task) {
    return (
      <Card className="mx-auto max-w-3xl rounded-2xl border-dashed border-gray-200 bg-gray-50/70 shadow-none">
        <CardContent className="space-y-5 px-8 py-16 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Task not found</h1>
          <p className="text-sm text-gray-600">This task may have been removed or you may not have access to it.</p>
          <div>
            <Link href="/tasks">
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">Back to Tasks</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = getStatus(task.status);
  const priority = getPriority(task.priority);
  const progress = getProgress(task.status);
  const creatorName = task.creator?.name ?? task.created_by_name ?? "Unknown creator";
  const creatorAvatar = task.creator?.avatar_url ?? "";

  const assignedUsers = task.assigned_users ?? [];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const isOverdue = !!task.deadline && task.status !== "done" && new Date(task.deadline).getTime() < todayStart.getTime();

  const comments = (messages && messages.length > 0)
    ? messages.map((m) => ({
        id: m.id,
        author: m.sender?.name ?? (m as any).sender_name ?? creatorName,
        avatar: "",
        timestamp: formatDate(m.created_at ?? new Date().toISOString(), true),
        text: (m as any).body ?? (m as any).text ?? "",
      }))
    : [
        {
          id: "c-1",
          author: creatorName,
          avatar: creatorAvatar,
          timestamp: formatDate(task.created_at ?? new Date().toISOString(), true),
          text: "I created this task to align the team on deliverables for this sprint.",
        },
      ];

  const backHref = task.team_id ? `/teams/${task.team_id}` : "/tasks";
  const backLabel = workspace ? `Back to ${workspace.name}` : "Back to Tasks";

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-8">
      <TaskDetailsHeader backHref={backHref} backLabel={backLabel} canEdit={canEdit} editHref={`/tasks/${task.id}/settings`} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <section className="space-y-6">
          <TaskDetailsContent
            task={task}
            status={status}
            comments={comments}
            createdAtLabel={formatDate(task.created_at, true)}
            creatorName={creatorName}
          />
        </section>

        <aside>
          <TaskDetailsSidebar
            taskId={task.id}
            taskTitle={task.title}
            currentUserId={currentUserId}
            messages={messages}
            creatorName={creatorName}
            creatorAvatar={creatorAvatar}
            assignees={assignedUsers}
            createdAtLabel={formatDate(task.created_at)}
            dueDateLabel={formatDate(task.deadline)}
            isOverdue={isOverdue}
            progress={progress}
            priority={priority}
          />
        </aside>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <CalendarClock className="h-4 w-4 text-blue-500" />
        Last updated {formatDate(task.updated_at)}
      </div>
    </div>
  );
}
