import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";

const PORT = Number(process.env.SOCKET_SERVER_PORT ?? 4600);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY for socket-server");
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

function createSupabaseForUser(accessToken) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}

async function getAuthedUser(accessToken) {
  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseForUser(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) {
    return null;
  }

  return data.user;
}

async function getTaskContext(taskId, accessToken) {
  const supabase = createSupabaseForUser(accessToken);

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id, team_id")
    .eq("id", taskId)
    .maybeSingle();

  if (taskError || !task?.team_id) {
    return null;
  }

  return task;
}

async function canAccessTaskChat(taskId, accessToken) {
  const supabase = createSupabaseForUser(accessToken);
  const { data, error } = await supabase.rpc("can_access_task_chat", {
    p_task_id: taskId,
  });

  if (error) {
    return false;
  }

  return Boolean(data);
}

async function loadSenderProfile(userId, accessToken) {
  const supabase = createSupabaseForUser(accessToken);
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return {
      id: userId,
      name: `User ${userId.slice(0, 6)}`,
      email: null,
    };
  }

  return {
    id: data.id,
    name: data.name?.trim() || data.email?.trim() || `User ${userId.slice(0, 6)}`,
    email: data.email ?? null,
  };
}

io.use(async (socket, next) => {
  try {
    const accessToken = socket.handshake.auth?.accessToken;
    const user = await getAuthedUser(accessToken);

    if (!user?.id) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      id: user.id,
      email: user.email ?? null,
      accessToken,
    };

    return next();
  } catch (error) {
    return next(error);
  }
});

io.on("connection", (socket) => {
  socket.on("task:join", async ({ taskId }, ack) => {
    const userId = socket.data.user?.id;
    const accessToken = socket.data.user?.accessToken;
    if (!userId) {
      ack?.({ ok: false, error: "Unauthorized" });
      return;
    }

    const task = await getTaskContext(taskId, accessToken);

    if (!task?.team_id) {
      ack?.({ ok: false, error: "Task not found" });
      return;
    }

    const canAccess = await canAccessTaskChat(taskId, accessToken);
    if (!canAccess) {
      ack?.({ ok: false, error: "You can only join tasks you are assigned to or own" });
      return;
    }

    const room = `task:${taskId}`;
    socket.join(room);
    ack?.({ ok: true, room });
  });

  socket.on("task:send", async ({ taskId, content }, ack) => {
    const userId = socket.data.user?.id;
    const accessToken = socket.data.user?.accessToken;
    if (!userId) {
      ack?.({ ok: false, error: "Unauthorized" });
      return;
    }

    const message = typeof content === "string" ? content.trim() : "";
    if (!message) {
      ack?.({ ok: false, error: "Message cannot be empty" });
      return;
    }

    if (message.length > 4000) {
      ack?.({ ok: false, error: "Message is too long" });
      return;
    }

    const supabase = createSupabaseForUser(accessToken);
    const task = await getTaskContext(taskId, accessToken);

    if (!task?.team_id) {
      ack?.({ ok: false, error: "Task not found or not allowed" });
      return;
    }

    const canAccess = await canAccessTaskChat(taskId, accessToken);
    if (!canAccess) {
      ack?.({ ok: false, error: "You can only message tasks you are assigned to or own" });
      return;
    }

    const { data: insertedMessage, error: insertError } = await supabase
      .from("task_messages")
      .insert({
        task_id: taskId,
        team_id: task.team_id,
        sender_id: userId,
        content: message,
        is_edited: false,
      })
      .select("id, task_id, team_id, sender_id, content, created_at, updated_at, is_edited")
      .single();

    if (insertError || !insertedMessage) {
      ack?.({ ok: false, error: insertError?.message ?? "Failed to send message" });
      return;
    }

    const sender = await loadSenderProfile(userId, accessToken);
    const payload = {
      ...insertedMessage,
      content: insertedMessage.content ?? "",
      is_edited: insertedMessage.is_edited ?? false,
      sender,
    };

    socket.to(`task:${taskId}`).emit("task:message-created", payload);
    ack?.({ ok: true, message: payload });
  });
});

server.listen(PORT, () => {
  console.log(`socket-server running at http://localhost:${PORT}`);
});