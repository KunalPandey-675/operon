"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function fetchUserById(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function fetchUsers() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("users")
    .select("id, name");

  return data;
}

export async function fetchUsersByTeamId(teamId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: members, error: membersError } = await supabase
    .from("team_member")
    .select("user_id, role")
    .eq("team_id", teamId);

  if (membersError) {
    console.error("fetchUsersByTeamId members failed:", membersError.message);
    return [];
  }

  const uniqueUserIds = Array.from(
    new Set((members ?? []).map((member) => member.user_id).filter(Boolean))
  );

  let usersById = new Map<string, { name: string | null; email: string | null }>();
  if (uniqueUserIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email")
      .in("id", uniqueUserIds);

    if (usersError) {
      console.error("fetchUsersByTeamId users lookup failed:", usersError.message);
    } else {
      usersById = new Map(
        (users ?? []).map((user) => [
          user.id,
          {
            name: user.name ?? null,
            email: user.email ?? null,
          },
        ])
      );
    }
  }

  return (members ?? []).map((member) => {
    const user = usersById.get(member.user_id);

    return {
      id: member.user_id,
      name: user?.name ?? null,
      email: user?.email ?? null,
      role: member.role ?? "member",
    };
  });
}
