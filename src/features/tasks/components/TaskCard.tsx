"use client"

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";
import { cn } from "@/lib/utils";

export function TaskCard({ task, idx: _idx }: { task: TaskView, idx: number }) {
  const isOverdue = task.status === "Deadline Passed";

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <StatusBadge status={task.status} />
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span className={cn(isOverdue ? "text-rose-500" : "text-gray-600")}>{task.dueDate}</span>
            </span>
          </div>

          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{task.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">{task.description || "No description provided."}</p>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback>{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="max-w-28 truncate text-xs font-medium text-gray-700">{task.assignee.name}</p>
            </div>

            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-gray-500 hover:text-blue-600">
              Details
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
