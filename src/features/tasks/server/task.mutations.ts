"use server"

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function createTask(formData: {
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    team_id: string | null;
    assigned_user_ids: string[];
    deadline: string | null;
}) {
    const supabase = await createSupabaseServerClient();

    const userId = await getCurrentUserId();

    if (!userId) {
        return {
            success: false,
            error: "User not found in database",
        };
    }

    if (!formData.team_id) {
        return {
            success: false,
            error: "Team is required to create a task",
        };
    }

    const status = formData.status && ["todo", "in_progress", "done"].includes(formData.status)
        ? formData.status
        : "todo";

    const { data, error } = await supabase
        .from("tasks")
        .insert(
            {
                title: formData.title,
                description: formData.description,
                status,
                priority: formData.priority,
                created_by: userId,
                team_id: formData.team_id,
                deadline: formData.deadline,
            }
        )
        .select("id")
        .single();

    if (error) {
        console.error("createTask failed:", error);
        const isRlsViolation = error.message.toLowerCase().includes("row-level security policy");
        return {
            success: false,
            error: isRlsViolation
                ? "Only the team owner can create tasks"
                : error.message || "Failed to create task",
        };
    }

    if (formData.assigned_user_ids.length > 0) {
        const { error: assignmentError } = await supabase
            .from("task_assignments")
            .insert(
                formData.assigned_user_ids.map((userId) => ({
                    task_id: data.id,
                    user_id: userId,
                }))
            );

        if (assignmentError) {
            console.error("createTask assignments failed:", assignmentError);
            return {
                success: false,
                error: assignmentError.message || "Task created, but assignments failed",
            };
        }
    }

    return {
        success: true,
        data,
        message: "Task created successfully!",
    };
}

export async function renameTask(formData: {
    taskId: string;
    title: string;
    description?: string | null;
}) {
    const supabase = await createSupabaseServerClient();

    const normalizedTitle = formData.title.trim();
    if (!normalizedTitle) {
        return {
            success: false,
            error: "Task title is required",
        };
    }

    const { data: updatedTask, error: updateError } = await supabase
        .from("tasks")
        .update({
            title: normalizedTitle,
            description: formData.description?.trim() || null,
        })
        .eq("id", formData.taskId)
        .select("team_id")
        .maybeSingle();

    if (updateError) {
        console.error("renameTask update failed:", updateError.message);
        return {
            success: false,
            error: updateError.message,
        };
    }

    if (!updatedTask) {
        return {
            success: false,
            error: "Task not found or not allowed",
        };
    }

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${formData.taskId}`);
    revalidatePath(`/tasks/${formData.taskId}/settings`);
    if (updatedTask.team_id) {
        revalidatePath(`/teams/${updatedTask.team_id}`);
    }

    return {
        success: true,
        message: "Task renamed successfully",
    };
}

export async function deleteTask(formData: { taskId: string }) {
    const supabase = await createSupabaseServerClient();
    const { data: deletedTask, error: taskDeleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", formData.taskId)
        .select("team_id")
        .maybeSingle();

    if (taskDeleteError) {
        console.error("deleteTask failed:", taskDeleteError.message);
        return {
            success: false,
            error: taskDeleteError.message,
        };
    }

    if (!deletedTask) {
        return {
            success: false,
            error: "Task not found or not allowed",
        };
    }

    revalidatePath("/tasks");
    if (deletedTask.team_id) {
        revalidatePath(`/teams/${deletedTask.team_id}`);
    }

    return {
        success: true,
        message: "Task deleted successfully",
    };
}