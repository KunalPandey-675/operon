"use server"

import { createSupabaseClient } from "../supabase"

export async function getTeams() {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .select(`
      id,
      name,
      team_member ( id, user_id, role ),
      tasks ( id, title, status )
    `);

  if (error) {
    console.error("getTeams failed:", error.message)
    return []
  }

  return (data ?? []).map(t => ({
    id: t.id,
    name: t.name,
    memberCount: t.team_member?.length ?? 0,
    taskCount: t.tasks?.length ?? 0,
    members: t.team_member
  }));
} 