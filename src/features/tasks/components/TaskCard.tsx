"use client"

import React from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";
import { cn } from "@/lib/utils";

export function TaskCard({ task, idx }: { task: TaskView, idx: number }) {
  const isOverdue = task.status === "Deadline Passed";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Link href={`/tasks/${task.id}`}>
        <Card className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-blue-50/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardContent className="relative p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <StatusBadge status={task.status} />

              <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                <Calendar className="h-3.5 w-3.5 text-blue-500/80" />
                <span className={cn(isOverdue ? "text-rose-500" : "text-gray-600")}>{task.dueDate}</span>
              </div>
            </div>

            <h3 className="mb-2 line-clamp-1 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-700">
              {task.title}
            </h3>

            <p className="mb-6 min-h-11 line-clamp-2 text-sm font-normal leading-relaxed text-gray-500">
              {task.description || "No description provided."}
            </p>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-white ring-2 ring-gray-100">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback>{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="max-w-34 truncate text-xs font-bold leading-none text-gray-900">{task.assignee.name}</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Assignee</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:bg-transparent hover:text-blue-600"
              >
                Details
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
