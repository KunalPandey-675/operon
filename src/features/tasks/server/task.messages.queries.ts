"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

function toDisplayName(user: { name?: string | null; email?: string | null } | null, fallbackId?: string | null) {
  const preferredName = user?.name?.trim();
  if (preferredName) {
    return preferredName;
  }

  const email = user?.email?.trim();
  if (email) {
    return email;
  }

  if (fallbackId) {
    return `User ${fallbackId.slice(0, 6)}`;
  }

  return null;
}

export async function getTaskMessages(taskId: string): Promise<DbTaskMessageWithSender[]> {
  const supabase = await createSupabaseServerClient();

  const { data: messages, error } = await supabase
    .from("task_messages")
    .select("id, task_id, team_id, sender_id, content, created_at, updated_at, is_edited")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getTaskMessages failed:", error.message);
    return [];
  }

  const senderIds = Array.from(
    new Set((messages ?? []).map((message) => message.sender_id).filter((id): id is string => Boolean(id)))
  );

  let usersById = new Map<string, { name: string | null; email: string | null }>();
  if (senderIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email")
      .in("id", senderIds);

    if (usersError) {
      console.error("getTaskMessages users lookup failed:", usersError.message);
    } else {
      usersById = new Map(
        (users ?? []).map((user) => [
          user.id,
          {
            name: user.name ?? null,
            email: user.email ?? null,
          },
        ])
      );
    }
  }

  return (messages ?? []).map((message) => {
    const sender = usersById.get(message.sender_id) ?? null;

    return {
      ...(message as DbTaskMessage),
      content: message.content ?? "",
      is_edited: message.is_edited ?? false,
      sender: {
        id: message.sender_id,
        name: toDisplayName(sender, message.sender_id),
        email: sender?.email ?? null,
      },
    };
  });
}