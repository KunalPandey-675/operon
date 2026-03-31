"use server"

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseServerClient } from "@/lib/supabase-server"

async function isTeamOwner(
    supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
    teamId: string,
    userId: string
) {
    const { data: team, error } = await supabase
        .from("teams")
        .select("id, created_by")
        .eq("id", teamId)
        .maybeSingle();

    if (error) {
        return {
            ok: false,
            error: error.message,
        };
    }

    if (!team?.id) {
        return {
            ok: false,
            error: "Team not found",
        };
    }

    if (team.created_by !== userId) {
        return {
            ok: false,
            error: "Only the team owner can perform this action",
        };
    }

    return {
        ok: true,
    };
}

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

    const ownerCheck = await isTeamOwner(supabase, formData.team_id, userId);
    if (!ownerCheck.ok) {
        return {
            success: false,
            error: ownerCheck.error,
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
        return {
            success: false,
            error: error.message || "Failed to create task",
        };
    }

    if (data?.id && formData.assigned_user_ids.length > 0) {
        const uniqueUserIds = [...new Set(formData.assigned_user_ids)];

        const { error: assignmentError } = await supabase
            .from("task_assignments")
            .insert(
                uniqueUserIds.map((userId) => ({
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
    const userId = await getCurrentUserId();

    if (!userId) {
        return {
            success: false,
            error: "User not found in database",
        };
    }

    const normalizedTitle = formData.title.trim();
    if (!normalizedTitle) {
        return {
            success: false,
            error: "Task title is required",
        };
    }

    const { data: existingTask, error: taskLookupError } = await supabase
        .from("tasks")
        .select("id, created_by, team_id")
        .eq("id", formData.taskId)
        .maybeSingle();

    if (taskLookupError) {
        console.error("renameTask lookup failed:", taskLookupError.message);
        return {
            success: false,
            error: taskLookupError.message,
        };
    }

    if (!existingTask?.id) {
        return {
            success: false,
            error: "Task not found",
        };
    }

    if (!existingTask.team_id) {
        return {
            success: false,
            error: "Task is not linked to a team",
        };
    }

    const ownerCheck = await isTeamOwner(supabase, existingTask.team_id, userId);
    if (!ownerCheck.ok) {
        return {
            success: false,
            error: ownerCheck.error,
        };
    }

    const { error: updateError } = await supabase
        .from("tasks")
        .update({
            title: normalizedTitle,
            description: formData.description?.trim() || null,
        })
        .eq("id", formData.taskId);

    if (updateError) {
        console.error("renameTask update failed:", updateError.message);
        return {
            success: false,
            error: updateError.message,
        };
    }

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${formData.taskId}`);
    revalidatePath(`/tasks/${formData.taskId}/settings`);
    if (existingTask.team_id) {
        revalidatePath(`/teams/${existingTask.team_id}`);
    }

    return {
        success: true,
        message: "Task renamed successfully",
    };
}

export async function deleteTask(formData: { taskId: string }) {
    const supabase = await createSupabaseServerClient();
    const userId = await getCurrentUserId();

    if (!userId) {
        return {
            success: false,
            error: "User not found in database",
        };
    }

    const { data: existingTask, error: taskLookupError } = await supabase
        .from("tasks")
        .select("id, created_by, team_id")
        .eq("id", formData.taskId)
        .maybeSingle();

    if (taskLookupError) {
        console.error("deleteTask lookup failed:", taskLookupError.message);
        return {
            success: false,
            error: taskLookupError.message,
        };
    }

    if (!existingTask?.id) {
        return {
            success: false,
            error: "Task not found",
        };
    }

    if (!existingTask.team_id) {
        return {
            success: false,
            error: "Task is not linked to a team",
        };
    }

    const ownerCheck = await isTeamOwner(supabase, existingTask.team_id, userId);
    if (!ownerCheck.ok) {
        return {
            success: false,
            error: ownerCheck.error,
        };
    }

    const { error: assignmentsDeleteError } = await supabase
        .from("task_assignments")
        .delete()
        .eq("task_id", formData.taskId);

    if (assignmentsDeleteError) {
        console.error("deleteTask assignments delete failed:", assignmentsDeleteError.message);
        return {
            success: false,
            error: assignmentsDeleteError.message,
        };
    }

    const { error: taskDeleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", formData.taskId);

    if (taskDeleteError) {
        console.error("deleteTask failed:", taskDeleteError.message);
        return {
            success: false,
            error: taskDeleteError.message,
        };
    }

    revalidatePath("/tasks");
    if (existingTask.team_id) {
        revalidatePath(`/teams/${existingTask.team_id}`);
    }

    return {
        success: true,
        message: "Task deleted successfully",
    };
}