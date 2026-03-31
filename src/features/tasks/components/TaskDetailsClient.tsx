"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Paperclip,
  Send,
  ThumbsUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TaskDetailsRecord } from "@/features/tasks/server/task.queries";

type TaskDetailsClientProps = {
  task: TaskDetailsRecord | null;
  workspace: DbTeamWithRelations | null;
  canEdit: boolean;
};

type ChatMessage = {
  id: string;
  author: string;
  avatar?: string | null;
  text: string;
  timestamp: string;
  mine?: boolean;
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

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getProgress(status: DbTaskStatus | null) {
  if (status === "done") return 100;
  if (status === "in_progress") return 68;
  return 24;
}

function getStatus(status: DbTaskStatus | null) {
  if (!status) {
    return {
      label: "Unknown",
      className: "border-gray-200 bg-gray-100 text-gray-700",
    };
  }
  return STATUS_CONFIG[status];
}

function getPriority(priority: DbTaskPriority | null) {
  if (!priority) {
    return {
      label: "Unset",
      className: "border-gray-200 bg-gray-100 text-gray-700",
    };
  }
  return PRIORITY_CONFIG[priority];
}

export default function TaskDetailsClient({ task, workspace, canEdit }: TaskDetailsClientProps) {
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
  const creatorAvatar = (task.creator as any)?.avatar_url ?? "";
  const assignedUsers = task.assigned_users ?? [];

  const isOverdue =
    !!task.deadline &&
    task.status !== "done" &&
    new Date(task.deadline).getTime() < new Date().setHours(0, 0, 0, 0);

  const comments = [
    {
      id: "c-1",
      author: creatorName,
      avatar: creatorAvatar,
      timestamp: formatDateTime(task.created_at ?? new Date().toISOString()),
      text: "I created this task to align the team on deliverables for this sprint.",
    },
    {
      id: "c-2",
      author: assignedUsers[0]?.name ?? "Team Member",
      avatar: (assignedUsers[0] as any)?.avatar_url ?? "",
      timestamp: "2h ago",
      text: "Current implementation is in review. I will share updated screenshots in Files.",
    },
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: "m-1",
      author: creatorName,
      avatar: creatorAvatar,
      text: "Can we finalize this before standup tomorrow?",
      timestamp: "9:12 AM",
    },
    {
      id: "m-2",
      author: assignedUsers[0]?.name ?? "You",
      avatar: (assignedUsers[0] as any)?.avatar_url ?? "",
      text: "Yes, I am pushing the remaining fixes this afternoon.",
      timestamp: "9:17 AM",
      mine: true,
    },
    {
      id: "m-3",
      author: assignedUsers[1]?.name ?? "Design",
      avatar: (assignedUsers[1] as any)?.avatar_url ?? "",
      text: "I have uploaded the latest icon variants for the sidebar states.",
      timestamp: "9:29 AM",
    },
    {
      id: "m-4",
      author: assignedUsers[0]?.name ?? "You",
      avatar: (assignedUsers[0] as any)?.avatar_url ?? "",
      text: "Perfect. I will merge and update this thread once deployed.",
      timestamp: "9:33 AM",
      mine: true,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={task.team_id ? `/teams/${task.team_id}` : "/tasks"}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {workspace ? `Back to ${workspace.name}` : "Back to Tasks"}
        </Link>

        <div className="flex items-center gap-2">
          {canEdit ? (
            <Link href={`/tasks/${task.id}/settings`}>
              <Button variant="outline" className="rounded-xl border-gray-200 bg-white">
                Edit Task
              </Button>
            </Link>
          ) : null}
          <Button className="rounded-xl bg-emerald-600 px-5 font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Mark Completed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <section className="space-y-6">
          <Card className="rounded-2xl border-gray-100 bg-white/90 shadow-xl shadow-slate-100">
            <CardContent className="space-y-8 p-8 lg:p-10">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${status.className}`}>
                    {status.label}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    Task #{task.id.slice(0, 8)}
                  </Badge>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-gray-950 lg:text-4xl">{task.title}</h1>

                <div className="rounded-2xl border border-slate-100 bg-linear-to-r from-slate-50 via-white to-blue-50/50 p-5">
                  <p className="text-base leading-7 text-slate-600">
                    {task.description?.trim() || "No task description yet. Add context so everyone stays aligned."}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="h-11 rounded-xl border border-gray-100 bg-gray-50 p-1">
                  <TabsTrigger value="comments" className="rounded-lg px-4 font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600">
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-lg px-4 font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600">
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="files" className="rounded-lg px-4 font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600">
                    Files
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="mt-6 space-y-6">
                  <div className="space-y-5">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Avatar className="h-10 w-10 border border-white ring-2 ring-gray-100">
                          <AvatarImage src={comment.avatar || undefined} />
                          <AvatarFallback>{toInitials(comment.author)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                            <span className="text-xs font-medium text-gray-400">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm leading-6 text-gray-600">{comment.text}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <Button variant="ghost" size="sm" className="h-8 rounded-lg px-2 text-xs font-semibold text-gray-500 hover:text-blue-600">
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 rounded-lg px-2 text-xs font-semibold text-gray-500 hover:text-blue-600">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              Like
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <MessageCircle className="h-3.5 w-3.5 text-blue-500" />
                      Add Comment
                    </div>
                    <textarea
                      placeholder="Share an update with your team..."
                      className="min-h-28 w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 outline-none ring-blue-200 transition focus:ring-2"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg px-2 text-gray-500 hover:text-blue-600">
                        <Paperclip className="h-4 w-4" />
                        Attach
                      </Button>
                      <Button className="rounded-xl bg-blue-600 px-4 font-semibold hover:bg-blue-700">Post Comment</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock3 className="h-4 w-4 text-blue-500" />
                      <span>Task created by {creatorName}</span>
                      <span className="text-xs text-gray-400">{formatDate(task.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock3 className="h-4 w-4 text-blue-500" />
                      <span>Status moved to {status.label}</span>
                      <span className="text-xs text-gray-400">Today</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock3 className="h-4 w-4 text-blue-500" />
                      <span>Team discussion updated in Chat</span>
                      <span className="text-xs text-gray-400">Just now</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="mt-6">
                  <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Paperclip className="h-4 w-4 text-blue-500" />
                        UI-wireframes-v2.fig
                      </div>
                      <span className="text-xs text-gray-400">2.4 MB</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Paperclip className="h-4 w-4 text-blue-500" />
                        acceptance-criteria.md
                      </div>
                      <span className="text-xs text-gray-400">38 KB</span>
                    </div>
                    <p className="pt-2 text-xs text-gray-500">Attach more files from Comments when needed.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <aside>
          <Card className="rounded-2xl border-gray-100 bg-white shadow-xl shadow-slate-100">
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                <span className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Task Info</span>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="h-8 rounded-lg bg-blue-600 px-3 text-xs font-semibold hover:bg-blue-700">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat (2)
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full border-l border-gray-200 p-0 sm:max-w-2xl">
                    <div className="flex h-full flex-col bg-gray-50">
                      <SheetHeader className="space-y-1 border-b border-gray-200 bg-white px-6 py-4">
                        <SheetTitle className="flex items-center gap-2 text-base text-gray-900">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          Task Chat
                        </SheetTitle>
                        <SheetDescription className="text-xs text-gray-500">
                          Discussion for {task.title}
                        </SheetDescription>
                      </SheetHeader>

                      <ScrollArea className="flex-1 px-5 py-5">
                        <div className="space-y-4 pb-2">
                          {chatMessages.map((message) => {
                            const author = message.author || "Member";
                            return (
                              <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                                    message.mine
                                      ? "border border-blue-200 bg-blue-600 text-white"
                                      : "border border-gray-100 bg-white text-gray-700"
                                  }`}
                                >
                                  <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold">
                                    {!message.mine ? (
                                      <Avatar className="h-5 w-5 border border-white">
                                        <AvatarImage src={message.avatar || undefined} />
                                        <AvatarFallback>{toInitials(author)}</AvatarFallback>
                                      </Avatar>
                                    ) : null}
                                    <span>{author}</span>
                                    <span className={message.mine ? "text-blue-100" : "text-gray-400"}>{message.timestamp}</span>
                                  </div>
                                  <p className="text-sm leading-6">{message.text}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>

                      <div className="border-t border-gray-200 bg-white px-5 py-4">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 py-2">
                          <input
                            type="text"
                            placeholder="Write a message..."
                            className="h-9 flex-1 border-none bg-transparent px-2 text-sm text-gray-700 outline-none"
                          />
                          <Button size="sm" className="rounded-lg bg-blue-600 px-3 hover:bg-blue-700">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
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
                      {assignedUsers.length > 0 ? (
                        assignedUsers.map((assignee) => {
                          const assigneeName = assignee.name ?? "Unnamed member";
                          return (
                            <div key={assignee.id} className="flex items-center gap-3 rounded-xl border border-white bg-white p-3">
                              <Avatar className="h-9 w-9 border border-white ring-2 ring-gray-100">
                                <AvatarImage src={(assignee as any).avatar_url || undefined} />
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
                        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-3 text-xs text-gray-500">
                          No assignees yet.
                        </p>
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
                        <span className="font-semibold text-gray-900">{formatDate(task.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white bg-white px-3 py-2">
                        <span className="text-gray-500">Due Date</span>
                        <span className={`font-semibold ${isOverdue ? "text-rose-600" : "text-gray-900"}`}>
                          {formatDate(task.deadline)}
                        </span>
                      </div>
                      {isOverdue ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                          This task is overdue.
                        </div>
                      ) : null}
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
                          <div
                            className="h-full rounded-full bg-linear-to-r from-sky-500 to-blue-600"
                            style={{ width: `${progress}%` }}
                          />
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
        </aside>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <CalendarClock className="h-4 w-4 text-blue-500" />
        Last updated {formatDate(task.updated_at)}
      </div>
    </div>
  );
}
