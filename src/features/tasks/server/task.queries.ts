"use server"

import { getCurrentUserId } from "@/lib/current-user"
import { createSupabaseServerClient } from "@/lib/supabase-server"

type TaskRecord = DbTask;
type TaskUser = {
    id: string;
    name: string | null;
};

export type TaskDetailsRecord = DbTask & {
    creator: TaskUser | null;
    assigned_users: Array<TaskUser & { role: string | null }>;
};

async function getAccessibleTeamIds(
    supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
    userId: string
) {
    const [{ data: ownedTeams, error: ownedError }, { data: memberships, error: membershipsError }] = await Promise.all([
        supabase
            .from("teams")
            .select("id")
            .eq("created_by", userId),
        supabase
            .from("team_member")
            .select("team_id")
            .eq("user_id", userId),
    ]);

    if (ownedError || membershipsError) {
        console.error("getAccessibleTeamIds failed:", ownedError?.message ?? membershipsError?.message);
        return [];
    }

    return Array.from(
        new Set([
            ...(ownedTeams ?? []).map((team) => team.id),
            ...(memberships ?? []).map((membership) => membership.team_id),
        ].filter((id): id is string => Boolean(id)))
    );
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
        .select("id, name")
        .in("id", creatorIds);

    if (usersError) {
        console.error("enrichTasksWithCreatorNames users lookup failed:", usersError.message);
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

export default async function getTasks() {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return [];
    }

    const supabase = await createSupabaseServerClient();
    const teamIds = await getAccessibleTeamIds(supabase, currentUserId);
    if (teamIds.length === 0) {
        return [];
    }

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select('*')
        .in("team_id", teamIds);

    if (error) {
        console.error("getTasks failed:", error.message);
        return [];
    }

    return enrichTasksWithCreatorNames(supabase, (tasks ?? []) as TaskRecord[]);
}

export async function getTasksByTeamId(teamId: string) {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return [];
    }

    const supabase = await createSupabaseServerClient();
    const teamIds = await getAccessibleTeamIds(supabase, currentUserId);
    if (!teamIds.includes(teamId)) {
        return [];
    }

    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("team_id", teamId);

    if (error) {
        console.error("getTasksByTeamId failed:", error.message);
        return [];
    }

    return enrichTasksWithCreatorNames(supabase, (tasks ?? []) as TaskRecord[]);
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
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return null;
    }

    const supabase = await createSupabaseServerClient();

    const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();

    if (error || !task) {
        if (error) {
            console.error("getTaskById failed:", error.message);
        }
        return null;
    }

    if (!task.team_id) {
        return null;
    }

    const teamIds = await getAccessibleTeamIds(supabase, currentUserId);
    if (!teamIds.includes(task.team_id)) {
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
            .select("id, name")
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
            name: user?.name ?? null,
            role: roleByUserId.get(id) ?? null,
        };
    });

    const creator = task.created_by ? usersById.get(task.created_by) ?? null : null;

    return {
        ...(task as TaskRecord),
        creator,
        assigned_users: assignedUsers,
    };
}