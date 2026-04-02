"use server"

import { createSupabaseServerClient } from "@/lib/supabase-server"

type TaskRecord = DbTask;
type TaskUser = {
    id: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
};

export type TaskDetailsRecord = DbTask & {
    creator: TaskUser | null;
    assigned_users: Array<TaskUser & { role: string | null }>;
};

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

async function enrichTasksWithCreatorNames(
    supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
    tasks: TaskRecord[]
) {
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
        .select("id, name, email")
        .in("id", creatorIds);

    if (usersError) {
        console.error("enrichTasksWithCreatorNames users lookup failed:", usersError.message);
        return tasks.map((task) => ({
            ...task,
            created_by_name: null,
        }));
    }

    const usersById = new Map(
        (users ?? []).map((user) => [
            user.id,
            {
                name: user.name ?? null,
                email: user.email ?? null,
            },
        ])
    );

    return tasks.map((task) => ({
        ...task,
        created_by_name: task.created_by
            ? (toDisplayName(usersById.get(task.created_by) ?? null, task.created_by) ?? "Unknown user")
            : null,
    }));
}

async function fetchTasksByIds(
    supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
    teamId: string,
    taskIds?: string[]
) {
    const query = supabase
        .from("tasks")
        .select("*")
        .eq("team_id", teamId);

    if (taskIds) {
        if (taskIds.length === 0) {
            return [];
        }

        query.in("id", taskIds);
    }

    const { data: tasks, error } = await query;

    if (error) {
        console.error("fetchTasksByIds failed:", error.message);
        return [];
    }

    return enrichTasksWithCreatorNames(supabase, (tasks ?? []) as TaskRecord[]);
}

export default async function getTasks() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id ?? null;

    if (!currentUserId) {
        return [];
    }

    const [{ data: tasks, error }, { data: assignments, error: assignmentsError }] = await Promise.all([
        supabase
            .from("tasks")
            .select("*")
            .eq("created_by", currentUserId),
        supabase
            .from("task_assignments")
            .select("task_id")
            .eq("user_id", currentUserId),
    ]);

    if (error) {
        console.error("getTasks failed:", error.message);
        return [];
    }

    if (assignmentsError) {
        console.error("getTasks assignments failed:", assignmentsError.message);
    }

    const assignedTaskIds = Array.from(
        new Set(
            (assignments ?? [])
                .map((assignment) => assignment.task_id)
                .filter((id): id is string => Boolean(id))
        )
    );

    const tasksById = new Map<string, TaskRecord>();

    for (const task of (tasks ?? []) as TaskRecord[]) {
        tasksById.set(task.id, task);
    }

    if (assignedTaskIds.length > 0) {
        const { data: assignedTasks, error: assignedTasksError } = await supabase
            .from("tasks")
            .select("*")
            .in("id", assignedTaskIds);

        if (assignedTasksError) {
            console.error("getTasks assigned tasks failed:", assignedTasksError.message);
        } else {
            for (const task of (assignedTasks ?? []) as TaskRecord[]) {
                tasksById.set(task.id, task);
            }
        }
    }

    return enrichTasksWithCreatorNames(supabase, Array.from(tasksById.values()));
}

export async function getTasksByTeamId(
    teamId: string,
    options?: {
        currentUserId: string | null;
        isOwner: boolean;
    }
) {
    const supabase = await createSupabaseServerClient();

    if (options?.isOwner) {
        return fetchTasksByIds(supabase, teamId);
    }

    if (!options?.currentUserId) {
        return [];
    }

    const { data: assignments, error: assignmentsError } = await supabase
        .from("task_assignments")
        .select("task_id")
        .eq("user_id", options.currentUserId);

    if (assignmentsError) {
        console.error("getTasksByTeamId assignments failed:", assignmentsError.message);
        return [];
    }

    const assignedTaskIds = Array.from(
        new Set(
            (assignments ?? [])
                .map((assignment) => assignment.task_id)
                .filter((id): id is string => Boolean(id))
        )
    );

    return fetchTasksByIds(supabase, teamId, assignedTaskIds);
}

export async function getTaskCountsByTeamIds(teamIds: string[]) {
    if (!teamIds || teamIds.length === 0) {
        return {} as Record<string, number>;
    }

    const supabase = await createSupabaseServerClient();

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("team_id")
        .in("team_id", teamIds);

    if (error) {
        console.error("getTaskCountsByTeamIds failed:", error.message);
        return {} as Record<string, number>;
    }

    const counts: Record<string, number> = {};
    for (const task of tasks ?? []) {
        const teamId = task.team_id;
        if (!teamId) continue;
        counts[teamId] = (counts[teamId] ?? 0) + 1;
    }

    return counts;
}

export async function getTaskById(taskId: string): Promise<TaskDetailsRecord | null> {
    const supabase = await createSupabaseServerClient();

    const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .maybeSingle();

    if (error && error.code !== "PGRST116") {
        console.error("getTaskById failed:", error.message);
        return null;
    }

    if (!task) {
        return null;
    }

    const { data: assignments, error: assignmentsError } = await supabase
        .from("task_assignments")
        .select("user_id")
        .eq("task_id", taskId);

    if (assignmentsError) {
        console.error("getTaskById assignments failed:", assignmentsError.message);
    }

    const assignedUserIds = Array.from(
        new Set(
            (assignments ?? [])
                .map((assignment) => assignment.user_id)
                .filter((id): id is string => Boolean(id))
        )
    );

    const allUserIds = Array.from(
        new Set([
            ...assignedUserIds,
            ...(task.created_by ? [task.created_by] : []),
        ])
    );

    let usersById = new Map<string, TaskUser>();
    if (allUserIds.length > 0) {
        const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, name, email")
            .in("id", allUserIds);

        if (usersError) {
            console.error("getTaskById users lookup failed:", usersError.message);
        } else {
            usersById = new Map(
                (users ?? []).map((user) => [
                    user.id,
                    {
                        id: user.id,
                        name: user.name ?? null,
                        email: user.email ?? null,
                        avatar_url: null,

                    },
                ])
            );
        }
    }

    let roleByUserId = new Map<string, string | null>();
    if (task.team_id && assignedUserIds.length > 0) {
        const { data: teamMembers, error: teamMembersError } = await supabase
            .from("team_member")
            .select("user_id, role")
            .eq("team_id", task.team_id)
            .in("user_id", assignedUserIds);

        if (teamMembersError) {
            console.error("getTaskById team roles lookup failed:", teamMembersError.message);
        } else {
            roleByUserId = new Map(
                (teamMembers ?? []).map((member) => [member.user_id, member.role ?? null])
            );
        }
    }

    const assignedUsers = assignedUserIds.map((id) => {
        const user = usersById.get(id);
        return {
            id,
            name: toDisplayName(user ?? null, id),
            email: user?.email ?? null,
            avatar_url: user?.avatar_url ?? null,
            role: roleByUserId.get(id) ?? null,
        };
    });

    const creator = task.created_by
        ? {
            ...(usersById.get(task.created_by) ?? {
                id: task.created_by,
                name: null,
                email: null,
                avatar_url: null,
            }),
            name: toDisplayName(usersById.get(task.created_by) ?? null, task.created_by),
        }
        : null;

    return {
        ...(task as TaskRecord),
        creator,
        assigned_users: assignedUsers,
    };
}