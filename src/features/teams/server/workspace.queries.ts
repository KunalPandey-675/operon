"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function getWorkspace() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("teams")
        .select(`
      id,
      name,
      code,
      description,
      created_by,
      created_at,
      team_member ( id, user_id, role ),
            tasks ( id, title, description, status, priority, created_by, team_id, deadline, created_at, updated_at )
    `);

    if (error) {
        console.error("getWorkspace failed:", error.message);
        return [];
    }

        return (data ?? []) as DbTeamWithRelations[];
}

export async function getWorkspaceById(id: string) {
    const supabase = createSupabaseClient();
        const { data, error } = await supabase
        .from("teams")
        .select(`
      id,
      name,
      code,
      description,
      created_by,
      created_at,
      team_member ( id, user_id, role ),
            tasks ( id, title, description, status, priority, created_by, team_id, deadline, created_at, updated_at )
    `)
        .eq("id", id)
        .single();

        if (error) {
                console.error("getWorkspaceById failed:", error.message);
                return null;
        }

        return data as DbTeamWithRelations;
}
