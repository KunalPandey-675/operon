"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { TaskDetailsRecord } from "@/features/tasks/server/task.queries";
import { deleteTask, renameTask } from "@/features/tasks/server/task.mutation";

type TaskSettingsClientProps = {
  task: TaskDetailsRecord | null;
  isOwner: boolean;
};

export default function TaskSettingsClient({ task, isOwner }: TaskSettingsClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) {
    return (
      <Card className="mx-auto max-w-3xl rounded-2xl border-dashed border-gray-200 bg-gray-50/70 shadow-none">
        <CardContent className="space-y-5 px-8 py-16 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Task not found</h1>
          <p className="text-sm text-gray-600">This task may have been removed or you may not have access to it.</p>
          <div>
            <Link href="/tasks">
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">Back to Tasks</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canDelete = confirmTitle.trim() === task.title;

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOwner) {
      toast.error("Only the task owner can rename this task");
      return;
    }

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSaving(true);
    try {
      const result = await renameTask({
        taskId: task.id,
        title,
        description,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to rename task");
        return;
      }

      toast.success(result.message || "Task updated");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to rename task";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      toast.error("Only the task owner can delete this task");
      return;
    }

    if (!canDelete) {
      toast.error("Type the task title to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteTask({ taskId: task.id });

      if (!result.success) {
        toast.error(result.error || "Failed to delete task");
        return;
      }

      toast.success(result.message || "Task deleted");
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete task";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <Link
        href={`/tasks/${task.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Task
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Task Settings</h1>
        <p className="text-sm text-gray-600">Rename your task or permanently delete it.</p>
      </div>

      {!isOwner ? (
        <Card className="rounded-2xl border-amber-200 bg-amber-50/80 shadow-none">
          <CardContent className="flex items-start gap-3 p-5 text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm font-medium">Only the task owner can change task settings.</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-900">Rename Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleRename}>
            <div className="space-y-2">
              <label htmlFor="task-title" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Task Title
              </label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                disabled={isSaving || !isOwner}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="task-description" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Description
              </label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                className="min-h-28 resize-none"
                disabled={isSaving || !isOwner}
              />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving || !isOwner}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-rose-200 bg-rose-50/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-bold text-rose-800">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-rose-700">
            Deleting this task removes it permanently, including assigned member links.
          </p>
          <div className="space-y-2">
            <label htmlFor="confirm-task-title" className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Type the task title to confirm
            </label>
            <Input
              id="confirm-task-title"
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
              placeholder={task.title}
              disabled={isDeleting || !isOwner}
              className="border-rose-200 bg-white"
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            disabled={!canDelete || isDeleting || !isOwner}
            onClick={handleDelete}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete Task
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
