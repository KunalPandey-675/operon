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
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return [];
    }

    const supabase = await createSupabaseServerClient();
    const [{ data: ownedTeams, error: ownedError }, { data: memberships, error: membershipsError }] = await Promise.all([
        supabase
            .from("teams")
            .select("id")
            .eq("created_by", currentUserId),
        supabase
            .from("team_member")
            .select("team_id")
            .eq("user_id", currentUserId),
    ]);

    if (ownedError || membershipsError) {
        console.error("getWorkspaceSummary team id lookup failed:", ownedError?.message ?? membershipsError?.message);
        return [];
    }

    const teamIds = Array.from(
        new Set([
            ...(ownedTeams ?? []).map((team) => team.id),
            ...(memberships ?? []).map((membership) => membership.team_id),
        ].filter((id): id is string => Boolean(id)))
    );

    if (teamIds.length === 0) {
        return [];
    }

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
        .in("id", teamIds);

    if (error) {
        console.error("getWorkspaceSummary failed:", error.message);
        return [];
    }

    return mapSummaryTeams((data ?? []) as TeamWithMembers[]);
}

export async function getWorkspaceById(id: string) {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return null;
    }

    const supabase = await createSupabaseServerClient();
    const { data: ownedTeam, error: ownedError } = await supabase
        .from("teams")
        .select("id")
        .eq("id", id)
        .eq("created_by", currentUserId)
        .maybeSingle();

    if (ownedError) {
        console.error("getWorkspaceById owner check failed:", ownedError.message);
        return null;
    }

    let isAuthorized = Boolean(ownedTeam);
    if (!isAuthorized) {
        const { data: membership, error: membershipError } = await supabase
            .from("team_member")
            .select("id")
            .eq("team_id", id)
            .eq("user_id", currentUserId)
            .maybeSingle();

        if (membershipError) {
            console.error("getWorkspaceById membership check failed:", membershipError.message);
            return null;
        }

        isAuthorized = Boolean(membership);
    }

    if (!isAuthorized) {
        return null;
    }

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
        .single();

    if (error) {
        console.error("getWorkspaceById failed:", error.message);
        return null;
    }

    const team = data as TeamWithMembers;
    return {
        ...team,
        tasks: [],
    } as DbTeamWithRelations;
}
