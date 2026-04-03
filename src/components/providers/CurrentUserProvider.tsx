"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { createClient } from "@/lib/supabase-client";

type CurrentUserContextValue = {
  userId: string | null;
  notifications: DbNotification[];
  unreadCount: number;
  notificationsReady: boolean;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

type CurrentUserProviderProps = {
  children: React.ReactNode;
  userId: string | null;
};

export function CurrentUserProvider({ children, userId }: CurrentUserProviderProps) {
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [notificationsReady, setNotificationsReady] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setNotificationsReady(true);
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    let isMounted = true;
    const supabase = createClient();

    async function loadNotificationsAndConnect() {
      try {
        const response = await fetch("/api/notifications?limit=30", { cache: "no-store" });
        const result = (await response.json()) as { notifications?: DbNotification[] };
        if (isMounted) {
          setNotifications(Array.isArray(result.notifications) ? result.notifications : []);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setNotificationsReady(true);
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted || !session?.access_token) {
        return;
      }

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL ?? "http://localhost:4600";
      const socket = io(socketUrl, {
        transports: ["websocket"],
        auth: {
          accessToken: session.access_token,
        },
      });

      socket.on("notification:created", (incoming: DbNotification) => {
        setNotifications((current) => {
          const alreadyExists = current.some((item) => item.id === incoming.id);
          if (alreadyExists) {
            return current;
          }

          return [incoming, ...current].slice(0, 100);
        });
      });

      socketRef.current = socket;
    }

    loadNotificationsAndConnect();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, notification) => count + (notification.is_read ? 0 : 1), 0),
    [notifications]
  );

  async function markNotificationRead(notificationId: string) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId
          ? { ...item, is_read: true, read_at: item.read_at ?? new Date().toISOString() }
          : item
      )
    );

    await fetch("/api/notifications/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId }),
    });
  }

  async function markAllNotificationsRead() {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        is_read: true,
        read_at: item.read_at ?? new Date().toISOString(),
      }))
    );

    await fetch("/api/notifications/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  const value = useMemo(
    () => ({
      userId,
      notifications,
      unreadCount,
      notificationsReady,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [notifications, notificationsReady, unreadCount, userId]
  );

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUserId() {
  const context = useContext(CurrentUserContext);
  return context?.userId ?? null;
}

export function useCurrentUserNotifications() {
  const context = useContext(CurrentUserContext);

  return {
    notifications: context?.notifications ?? [],
    unreadCount: context?.unreadCount ?? 0,
    notificationsReady: context?.notificationsReady ?? false,
    markNotificationRead: context?.markNotificationRead ?? (async () => {}),
    markAllNotificationsRead: context?.markAllNotificationsRead ?? (async () => {}),
  };
}