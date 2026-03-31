"use server";

import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type TeamWithMembers = DbTeam & {
    team_member: DbTeamMember[];
};

function mapSummaryTeams(teams: TeamWithMembers[]): DbTeamWithRelations[] {
    return teams.map((team) => ({
        ...team,
        tasks: [],
    }));
}

export async function getWorkspaceSummary() {
    const userId = await getCurrentUserId();
    if (!userId) {
        return [];
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("teams")
        .select(`
            id,
            name,
            code,
            description,
            created_by,
            created_at,
            team_member ( id, user_id, role )
        `);

    if (error) {
        console.error("getWorkspaceSummary failed:", error.message);
        return [];
    }

    const scopedTeams = ((data ?? []) as TeamWithMembers[]).filter(
        (team) =>
            team.created_by === userId ||
            (team.team_member ?? []).some((member) => member.user_id === userId),
    );

    return mapSummaryTeams(scopedTeams);
}

export async function getWorkspaceById(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return null;
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("teams")
        .select(`
            id,
            name,
            code,
            description,
            created_by,
            created_at,
            team_member ( id, user_id, role )
        `)
        .eq("id", id)
        .maybeSingle();

    if (error && error.code !== "PGRST116") {
        console.error("getWorkspaceById failed:", error.message);
        return null;
    }

    if (!data) {
        return null;
    }

    const team = data as TeamWithMembers;

    const canAccessTeam =
        team.created_by === userId ||
        (team.team_member ?? []).some((member) => member.user_id === userId);

    if (!canAccessTeam) {
        return null;
    }

    return {
        ...team,
        tasks: [],
    } as DbTeamWithRelations;
}
