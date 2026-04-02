"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Paperclip, ThumbsUp, Clock3 } from "lucide-react";
import type { TaskDetailsRecord } from "@/features/tasks/server/task.queries";

type CommentItem = {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
};

type TaskDetailsContentProps = {
  task: TaskDetailsRecord;
  status: { label: string; className: string };
  comments: CommentItem[];
  createdAtLabel: string;
  creatorName: string;
};

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "NA";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function TaskDetailsContent({ task, status, comments, createdAtLabel, creatorName }: TaskDetailsContentProps) {
  return (
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
                <span className="text-xs text-gray-400">{createdAtLabel}</span>
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
  );
}