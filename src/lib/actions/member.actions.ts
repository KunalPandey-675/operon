"use server"

import { createSupabaseClient } from "../supabase"

export async function createUserIfNotExists(user: any) {
    if (!user || !user.email_verified) return;
    const supabase = createSupabaseClient()

    const { data: existingUser } = await supabase
        .from("users")
        .select("auth0_id")
        .eq("auth0_id", user.sub)
        .maybeSingle();

    if (existingUser) {
        return;
    }

    await supabase
        .from("users")
        .insert({
            auth0_id: user.sub,
            email: user.email,
            name: "",
        });
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

export async function updateUserNameByAuth0Id(auth0Id: string, name: string) {
    const supabase = createSupabaseClient()

    const { error } = await supabase
        .from("users")
        .update({ name })
        .eq("auth0_id", auth0Id);

    if (error) {
        console.error("updateUserNameByAuth0Id failed:", error.message)
        return { success: false as const, error: error.message }
    }

    return { success: true as const }
}