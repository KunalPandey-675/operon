"use client";

import { useMemo } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserNotifications } from "@/components/providers/CurrentUserProvider";

function formatNotificationTime(value: string | null) {
  if (!value) return "Just now";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function renderNotificationLabel(notification: DbNotification) {
  if (notification.type === "task.assigned") {
    const title = typeof notification.data?.title === "string" ? notification.data.title : "a task";
    return `You were assigned to ${title}`;
  }

  return notification.type;
}

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    notificationsReady,
    markNotificationRead,
    markAllNotificationsRead,
  } = useCurrentUserNotifications();

  const latestNotifications = useMemo(() => notifications.slice(0, 15), [notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Notifications</span>
          {unreadCount > 0 ? (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => markAllNotificationsRead()}>
              Mark all read
            </Button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!notificationsReady ? (
          <div className="px-3 py-4 text-xs text-muted-foreground">Loading notifications...</div>
        ) : latestNotifications.length === 0 ? (
          <div className="px-3 py-4 text-xs text-muted-foreground">No notifications yet.</div>
        ) : (
          latestNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-1 py-3"
              onClick={() => markNotificationRead(notification.id)}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <p className={`text-sm ${notification.is_read ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                  {renderNotificationLabel(notification)}
                </p>
                {!notification.is_read ? <span className="mt-1 h-2 w-2 rounded-full bg-primary" /> : null}
              </div>
              <p className="text-[11px] text-muted-foreground">{formatNotificationTime(notification.created_at)}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
