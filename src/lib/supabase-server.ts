import "server-only";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { auth0 } from "@/lib/auth0";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and one of NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variables"
  );
}

const auth0Audience = process.env.AUTH0_AUDIENCE?.trim() || undefined;

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const { token } = auth0Audience
    ? await auth0.getAccessToken({ audience: auth0Audience })
    : await auth0.getAccessToken();

  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}