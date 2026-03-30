"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function createUserIfNotExists(user: any) {
  if (!user || !user.email_verified) return;
  const supabase = await createSupabaseServerClient();

  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("auth0_id")
    .eq("auth0_id", user.sub)
    .maybeSingle();

  if (existingUserError) {
    console.error("createUserIfNotExists lookup failed:", existingUserError.message);
    return;
  }

  if (existingUser) {
    return;
  }

  const { error: insertError } = await supabase.from("users").insert({
    auth0_id: user.sub,
    email: user.email,
    name: "",
  });

  if (insertError) {
    console.error("createUserIfNotExists insert failed:", insertError.message);
  }
}

export async function updateUserNameByAuth0Id(auth0Id: string, name: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("users")
    .update({ name })
    .eq("auth0_id", auth0Id);

  if (error) {
    console.error("updateUserNameByAuth0Id failed:", error.message);
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}
