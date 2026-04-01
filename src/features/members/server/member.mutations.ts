"use server";

import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function createUserIfNotExists(user: any) {
  if (!user || !user.id) return;
  const supabase = await createSupabaseServerClient();
  const metadataUsername = user.user_metadata?.username;
  const normalizedUsername =
    typeof metadataUsername === "string" && metadataUsername.trim().length > 0
      ? metadataUsername.trim()
      : null;

  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("id, name")
    .eq("id", user.id)
    .maybeSingle();

  if (existingUserError) {
    console.error("createUserIfNotExists lookup failed:", existingUserError.message);
    return;
  }

  if (existingUser) {
    if (!existingUser.name?.trim() && normalizedUsername) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ name: normalizedUsername })
        .eq("id", user.id);

      if (updateError) {
        console.error("createUserIfNotExists metadata update failed:", updateError.message);
      }
    }

    return;
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: user.id,
    email: user.email,
    name: normalizedUsername,
  });

  if (insertError?.code === "23505" && normalizedUsername) {
    const { error: retryError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      name: null,
    });

    if (!retryError) {
      return;
    }

    console.error("createUserIfNotExists retry insert failed:", retryError.message);
    return;
  }

  if (insertError) {
    console.error("createUserIfNotExists insert failed:", insertError.message);
  }
}

export async function updateUserNameByUserId(name: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false as const, error: "User not found in database" };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("users")
    .update({ name })
    .eq("id", userId);

  if (error) {
    console.error("updateUserNameByUserId failed:", error.message);
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}
