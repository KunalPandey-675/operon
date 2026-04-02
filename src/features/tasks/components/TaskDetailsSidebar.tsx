"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskChatPanel from "@/features/tasks/components/TaskChatPanel";

type SidebarAssignee = {
  id: string;
  name: string | null;
  role: string | null;
  avatar_url: string | null;
};

type TaskDetailsSidebarProps = {
  taskId: string;
  taskTitle: string;
  currentUserId: string | null;
  messages: DbTaskMessageWithSender[];
  creatorName: string;
  creatorAvatar: string;
  assignees: SidebarAssignee[];
  createdAtLabel: string;
  dueDateLabel: string;
  isOverdue: boolean;
  progress: number;
  priority: { label: string; className: string };
};

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "NA";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function TaskDetailsSidebar({
  taskId,
  taskTitle,
  currentUserId,
  messages,
  creatorName,
  creatorAvatar,
  assignees,
  createdAtLabel,
  dueDateLabel,
  isOverdue,
  progress,
  priority,
}: TaskDetailsSidebarProps) {
  return (
    <Card className="rounded-2xl border-gray-100 bg-white shadow-xl shadow-slate-100">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
          <span className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Task Info</span>
          <TaskChatPanel taskId={taskId} taskTitle={taskTitle} currentUserId={currentUserId} messages={messages} />
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl border-gray-100 bg-gray-50/70 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-800">Created By</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3 rounded-xl border border-white bg-white p-3">
                <Avatar className="h-10 w-10 border border-white ring-2 ring-gray-100">
                  <AvatarImage src={creatorAvatar || undefined} />
                  <AvatarFallback>{toInitials(creatorName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{creatorName}</p>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 bg-gray-50/70 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-800">Assigned To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {assignees.length > 0 ? (
                assignees.map((assignee) => {
                  const assigneeName = assignee.name ?? "Unnamed member";
                  return (
                    <div key={assignee.id} className="flex items-center gap-3 rounded-xl border border-white bg-white p-3">
                      <Avatar className="h-9 w-9 border border-white ring-2 ring-gray-100">
                        <AvatarImage src={assignee.avatar_url || undefined} />
                        <AvatarFallback>{toInitials(assigneeName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{assigneeName}</p>
                        {assignee.role ? <p className="text-xs text-gray-500">{assignee.role}</p> : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="rounded-xl border border-dashed border-gray-200 bg-white p-3 text-xs text-gray-500">No assignees yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 bg-gray-50/70 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-800">Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-white bg-white px-3 py-2">
                <span className="text-gray-500">Start Date</span>
                <span className="font-semibold text-gray-900">{createdAtLabel}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white bg-white px-3 py-2">
                <span className="text-gray-500">Due Date</span>
                <span className={`font-semibold ${isOverdue ? "text-rose-600" : "text-gray-900"}`}>{dueDateLabel}</span>
              </div>
              {isOverdue ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">This task is overdue.</div> : null}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 bg-gray-50/70 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-800">Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-white bg-white p-3">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Completion</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-linear-to-r from-sky-500 to-blue-600" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-gray-100 bg-gray-50/70 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-800">Priority</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge variant="outline" className={`rounded-full px-3 py-1 font-semibold ${priority.className}`}>
                {priority.label}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}