"use client";

import { useEffect, useMemo, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskChatPanel } from "@/features/tasks/hooks/useTaskChatPanel";

type TaskChatPanelProps = {
  taskId: string;
  taskTitle: string;
  currentUserId: string | null;
  messages: DbTaskMessageWithSender[];
};

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "NA";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatAuthor(name: string | null) {
  return name?.trim() || "Member";
}

function formatMessageTime(value: string | null) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function TaskChatPanel({ taskId, taskTitle, currentUserId, messages }: TaskChatPanelProps) {
  const { draft, setDraft, messageList, error, socketReady, isSending, handleSendMessage } = useTaskChatPanel({
    taskId,
    currentUserId,
    messages,
  });
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const triggerLabel = useMemo(() => `Chat (${messageList.length})`, [messageList.length]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messageList.length]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-8 rounded-lg bg-blue-600 px-3 text-xs font-semibold hover:bg-blue-700">
          <MessageCircle className="h-3.5 w-3.5" />
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full border-l border-gray-200 p-0 sm:max-w-2xl">
        <div className="flex h-full flex-col bg-gray-50">
          <SheetHeader className="space-y-1 border-b border-gray-200 bg-white px-6 py-4">
            <SheetTitle className="flex items-center gap-2 text-base text-gray-900">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              Task Chat
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-500">Discussion for {taskTitle}</SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 px-5 py-5">
            <div className="space-y-4 pb-2">
              {messageList.length > 0 ? (
                messageList.map((message) => {
                  const mine = message.sender_id === currentUserId;
                  const author = mine ? "You" : formatAuthor(message.sender.name);

                  return (
                    <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                          mine
                            ? "border border-blue-200 bg-blue-600 text-white"
                            : "border border-gray-100 bg-white text-gray-700"
                        }`}
                      >
                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold">
                          {!mine ? (
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-gray-100 text-[10px] text-gray-500">
                                {toInitials(author)}
                              </AvatarFallback>
                            </Avatar>
                          ) : null}
                          <span>{author}</span>
                          <span className={mine ? "text-blue-100" : "text-gray-400"}>{formatMessageTime(message.created_at)}</span>
                          {message.is_edited ? <span className={mine ? "text-blue-100" : "text-gray-400"}>edited</span> : null}
                        </div>
                        <p className="text-sm leading-6">{message.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-sm text-gray-500">
                  No messages yet. Start the conversation.
                </div>
              )}
            </div>
            <div ref={endOfMessagesRef} />
          </ScrollArea>

          <div className="border-t border-gray-200 bg-white px-5 py-4">
            <form
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 py-2"
              onSubmit={async (event) => {
                event.preventDefault();
                const sent = await handleSendMessage(draft);
                if (sent) {
                  setDraft("");
                }
              }}
            >
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a message..."
                className="h-9 flex-1 border-none bg-transparent px-2 text-sm text-gray-700 outline-none"
                disabled={isSending}
                maxLength={4000}
              />
              <Button size="sm" type="submit" className="rounded-lg bg-blue-600 px-3 hover:bg-blue-700" disabled={isSending || !draft.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-2 text-[11px] text-gray-400">{socketReady ? "Live via Socket.IO" : "Connecting to live chat..."}</p>
            {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}