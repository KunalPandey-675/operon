"use server"

import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseClient } from "@/lib/supabase"

export async function createTask(formData: {
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    team_id: string | null;
    assigned_user_ids: string[];
    deadline: string | null;
}) {
    const supabase = createSupabaseClient();

    const userId = await getCurrentUserId();

    if (!userId) {
        return {
            success: false,
            error: "User not found in database",
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