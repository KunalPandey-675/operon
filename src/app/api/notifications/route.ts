import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const unreadOnly = url.searchParams.get("unreadOnly") === "1";
  const rawLimit = Number(url.searchParams.get("limit") ?? "20");
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 100)) : 20;

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("notifications")
    .select("id, user_id, actor_id, type, data, is_read, created_at, read_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq("is_read", false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notifications: data ?? [] });
}
