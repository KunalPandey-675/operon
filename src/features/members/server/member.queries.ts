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
