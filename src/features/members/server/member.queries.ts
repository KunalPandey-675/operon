"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function fetchUserById(id: any) {
  const supabase = createSupabaseClient();

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("auth0_id", id)
    .single();

  return data;
}

export async function fetchUsers() {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("users")
    .select(`
    id,
    name`);
  return data
}

export async function fetchUsersByTeamId(teamId: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      team_member!inner(team_id)
    `)
    .eq("team_member.team_id", teamId);

  if (error) {
    console.error("fetchUsersByTeamId failed:", error.message);
    return [];
  }

  return (data ?? []).map((user) => ({
    id: user.id,
    name: user.name,
  }));
}
