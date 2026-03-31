import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase-auth";
import { createUserIfNotExists } from "@/features/members/server/member.mutations";
import { fetchUserById } from "@/features/members/server/member.queries";

export const getCurrentSupabaseUser = cache(async () => {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
});

export const getCurrentDbUser = cache(async () => {
  const supabaseUser = await getCurrentSupabaseUser();

  if (!supabaseUser) {
    return null;
  }

  await createUserIfNotExists(supabaseUser);
  return fetchUserById(supabaseUser.id);
});

export const getCurrentUserId = cache(async () => {
  const dbUser = await getCurrentDbUser();
  return dbUser?.id ?? null;
});

export async function requireCurrentSupabaseUser() {
  const supabaseUser = await getCurrentSupabaseUser();

  if (!supabaseUser) {
    redirect("/auth/login");
  }

  return supabaseUser;
}

export async function requireCurrentDbUser() {
  await requireCurrentSupabaseUser();

  const dbUser = await getCurrentDbUser();

  if (!dbUser?.id) {
    throw new Error("User not found in database");
  }

  return dbUser;
}