"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AvatarGroup({ users, max = 3, className }: { users: User[], max?: number, className?: string }) {
  const displayedUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={cn("flex -space-x-3 overflow-hidden", className)}>
      {displayedUsers.map((user, i) => (
        <Avatar key={i} className="inline-block border-2 border-white ring-2 ring-gray-100 h-8 w-8 transition-transform hover:scale-110 cursor-pointer">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-gray-600 ring-2 ring-gray-100 z-10 transition-transform hover:scale-110 cursor-pointer">
          +{remaining}
        </div>
      )}
    </div>
  )
}
