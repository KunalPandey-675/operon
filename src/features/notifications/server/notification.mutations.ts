"use server";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";

type CreateNotificationInput = {
  userId: string;
  actorId?: string | null;
  type: string;
  data?: Record<string, unknown>;
};

function getSocketServerInternalUrl() {
  return process.env.SOCKET_SERVER_INTERNAL_URL ?? "http://localhost:4600";
}

async function emitNotificationsToSocket(notifications: DbNotification[]) {
  if (notifications.length === 0) {
    return;
  }

  const socketServerUrl = getSocketServerInternalUrl();

  try {
    const response = await fetch(`${socketServerUrl}/internal/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": process.env.SOCKET_SERVER_INTERNAL_TOKEN ?? "",
      },
      body: JSON.stringify({ notifications }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("emitNotificationsToSocket failed:", response.status, await response.text());
    }
  } catch (error) {
    console.error("emitNotificationsToSocket request failed:", error);
  }
}

export async function createNotification(input: CreateNotificationInput) {
  const notifications = await createNotificationsForUsers({
    userIds: [input.userId],
    actorId: input.actorId,
    type: input.type,
    data: input.data,
  });

  return notifications[0] ?? null;
}

export async function createNotificationsForUsers(input: {
  userIds: string[];
  actorId?: string | null;
  type: string;
  data?: Record<string, unknown>;
}) {
  const uniqueUserIds = Array.from(new Set(input.userIds.filter(Boolean)));

  if (uniqueUserIds.length === 0) {
    return [] as DbNotification[];
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const insertRows = uniqueUserIds.map((userId) => ({
    user_id: userId,
    actor_id: input.actorId ?? null,
    type: input.type,
    data: input.data ?? {},
  }));

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .insert(insertRows)
    .select("id, user_id, actor_id, type, data, is_read, created_at, read_at");

  if (error) {
    console.error("createNotificationsForUsers failed:", error.message);
    return [];
  }

  const notifications = (data ?? []) as DbNotification[];
  await emitNotificationsToSocket(notifications);

  return notifications;
}
