import "server-only";

import { createSupabaseAuthClient } from "@/lib/supabase-auth";

export async function createSupabaseServerClient() {
  return await createSupabaseAuthClient();
}