"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const statusStyles: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
    'Pending': { 
      bg: "bg-amber-500/10 border-amber-500/20", 
      text: "text-amber-600 dark:text-amber-400", 
      dot: "bg-amber-500" 
    },
    'Completed': { 
      bg: "bg-emerald-500/10 border-emerald-500/20", 
      text: "text-emerald-600 dark:text-emerald-400", 
      dot: "bg-emerald-500" 
    },
    'Deadline Passed': { 
      bg: "bg-rose-500/10 border-rose-500/20", 
      text: "text-rose-600 dark:text-rose-400", 
      dot: "bg-rose-500" 
    }
  }

  const current = statusStyles[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 flex items-center gap-1.5 border-none",
        current.bg,
        current.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", current.dot)} />
      {status}
    </Badge>
  )
}

