"use client"

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  MessageSquare,
  Paperclip,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { Task } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TaskCard({ task, idx }: { task: Task, idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Link href={`/tasks/${task.id}`}>
        <Card className="group hover:ring-2 hover:ring-blue-600/10 hover:shadow-xl hover:shadow-blue-50/30 transition-all duration-300 border border-gray-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <StatusBadge status={task.status} />
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1 leading-tight">
              {task.title}
            </h3>

            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10 mb-6 font-normal">
              {task.description}
            </p>

            <div className="flex items-center justify-between pt-5 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border-2 border-white ring-2 ring-gray-100">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback>{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-none">{task.assignee.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mt-1 truncate max-w-[80px]">Assignee</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-blue-500/70" />
                  <span className={cn(task.status === "Deadline Passed" ? "text-rose-500" : "text-gray-500")}>
                    {task.dueDate}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest pl-2 border-l">
                  Details <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
