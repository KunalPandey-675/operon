"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function StatusBadge({ status, className }: { status: TaskStatus, className?: string }) {
  const statusStyles: Record<TaskStatus, string> = {
    'Pending': "bg-amber-50 text-amber-700 border-amber-200",
    'Completed': "bg-emerald-50 text-emerald-700 border-emerald-200",
    'Deadline Passed': "bg-rose-50 text-rose-700 border-rose-200"
  }

  return (
    <Badge
      variant="outline"
      className={cn("font-semibold uppercase text-[10px] tracking-widest px-2 py-0.5", statusStyles[status], className)}
    >
      {status}
    </Badge>
  )
}
