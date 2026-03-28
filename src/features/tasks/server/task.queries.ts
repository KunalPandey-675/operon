"use server"

import { createSupabaseClient } from "@/lib/supabase"

export default async function getTasks() {
    const supabase = createSupabaseClient();

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select('*');

    if (error) {
        console.error("getTasks failed:", error.message);
        return [];
    }

    if (!tasks || tasks.length === 0) {
        return [];
    }

    const creatorIds = Array.from(
        new Set(
            tasks
                .map((task) => task.created_by)
                .filter((id): id is string => Boolean(id))
        )
    );

    if (creatorIds.length === 0) {
        return tasks.map((task) => ({
            ...task,
            created_by_name: null,
        }));
    }

    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name")
        .in("id", creatorIds);

    if (usersError) {
        console.error("getTasks users lookup failed:", usersError.message);
        return tasks.map((task) => ({
            ...task,
            created_by_name: null,
        }));
    }

    const userNameById = new Map(users?.map((user) => [user.id, user.name ?? null]));

    return tasks.map((task) => ({
        ...task,
        created_by_name: task.created_by ? (userNameById.get(task.created_by) ?? null) : null,
    }));
}