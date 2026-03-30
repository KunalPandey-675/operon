"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function fetchUserById(id: any) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("auth0_id", id)
    .single();

  return data;
}

export async function fetchUsers() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("users")
    .select(`
    id,
    name`);
  return data
}

export async function fetchUsersByTeamId(teamId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      team_member!inner(team_id, role)
    `)
    .eq("team_member.team_id", teamId);

  if (error) {
    console.error("fetchUsersByTeamId failed:", error.message);
    return [];
  }

  return (data ?? []).map((user) => {
    const membership = Array.isArray(user.team_member)
      ? user.team_member[0]
      : user.team_member;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: membership?.role ?? "member",
    };
  });
}
