
import { createSupabaseClient } from "../supabase"

export async function createUserIfNotExists(user: any) {
    if (!user || !user.email_verified) return;
    const supabase = createSupabaseClient()

    await supabase
        .from("users")
        .upsert(
            {
                auth0_id: user.sub,
                email: user.email,
                name: user.name,
            },
            { onConflict: "auth0_id" }
        );
}

export async function fetchUserById(id: any) {
    const supabase = createSupabaseClient()

    const { data } = await supabase
        .from('users')
        .select("*")
        .eq("auth0_id", id)
        .single();


    return data;
}