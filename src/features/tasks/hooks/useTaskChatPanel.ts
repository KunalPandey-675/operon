"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { createClient } from "@/lib/supabase-client";

type UseTaskChatPanelArgs = {
  taskId: string;
  currentUserId: string | null;
  messages: DbTaskMessageWithSender[];
};

export function useTaskChatPanel({ taskId, currentUserId, messages }: UseTaskChatPanelArgs) {
  const [draft, setDraft] = useState("");
  const [messageList, setMessageList] = useState(messages);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function connectSocket() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted || !session?.access_token) {
        return;
      }

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL ?? "http://localhost:5000";
      const socket = io(socketUrl, {
        transports: ["websocket"],
        auth: {
          accessToken: session.access_token,
        },
      });

      socket.on("connect", () => {
        setSocketReady(true);
        socket.emit("task:join", { taskId }, (response: { ok: boolean; error?: string }) => {
          if (!response?.ok) {
            setError(response?.error || "Failed to join chat room");
          }
        });
      });

      socket.on("task:message-created", (incomingMessage: DbTaskMessageWithSender) => {
        setMessageList((currentMessages) => {
          const existingIndex = currentMessages.findIndex((message) => message.id === incomingMessage.id);

          if (existingIndex >= 0) {
            const nextMessages = [...currentMessages];
            nextMessages[existingIndex] = incomingMessage;
            return nextMessages;
          }

          return [...currentMessages, incomingMessage];
        });
      });

      socket.on("disconnect", () => {
        setSocketReady(false);
      });

      socketRef.current = socket;
    }

    connectSocket().catch(() => {
      if (isMounted) {
        setError("Unable to connect to the chat server");
      }
    });

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [taskId]);

  async function handleSendMessage(content: string) {
    if (isSending || !socketRef.current) {
      return false;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Write a message before sending.");
      return false;
    }

    const optimisticMessage: DbTaskMessageWithSender = {
      id: `temp-${Date.now()}`,
      task_id: taskId,
      team_id: "",
      sender_id: currentUserId ?? "current-user",
      content: trimmedContent,
      created_at: new Date().toISOString(),
      updated_at: null,
      is_edited: false,
      sender: {
        id: currentUserId ?? "current-user",
        name: "You",
        email: null,
      },
    };

    setIsSending(true);
    setError(null);
    setMessageList((currentMessages) => [...currentMessages, optimisticMessage]);

    return new Promise<boolean>((resolve) => {
      socketRef.current?.emit(
        "task:send",
        { taskId, content: trimmedContent },
        (response: { ok: boolean; error?: string; message?: DbTaskMessageWithSender }) => {
          if (!response?.ok || !response.message) {
            setMessageList((currentMessages) =>
              currentMessages.filter((message) => message.id !== optimisticMessage.id)
            );
            setError(response?.error || "Failed to send message");
            setIsSending(false);
            resolve(false);
            return;
          }

          setMessageList((currentMessages) =>
            currentMessages.map((message) =>
              message.id === optimisticMessage.id ? response.message! : message
            )
          );
          setIsSending(false);
          resolve(true);
        }
      );
    });
  }

  return {
    draft,
    setDraft,
    messageList,
    error,
    socketReady,
    isSending,
    handleSendMessage,
  };
}