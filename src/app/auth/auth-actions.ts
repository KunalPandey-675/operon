    "use server";

import { createSupabaseAuthClient } from "@/lib/supabase-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function loginWithEmailPassword(
  emailOrUsername: string,
  password: string
) {
  try {
    // First, try to login with email directly
    let email = emailOrUsername;
    
    // Check if input is username (doesn't contain @)
    if (!emailOrUsername.includes("@")) {
      // Look up email by username
      const supabase = await createSupabaseServerClient();
      const { data: user, error: lookupError } = await supabase
        .from("users")
        .select("email")
        .eq("name", emailOrUsername)
        .single();

      if (lookupError || !user?.email) {
        return {
          error: "User not found. Please check your username or use email.",
        };
      }
      email = user.email;
    }

    // Now login with the email
    const supabaseAuth = await createSupabaseAuthClient();
    const { error, data } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return { error: message };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
) {
  try {
    const normalizedUsername = username.trim();

    // Validate username
    if (!normalizedUsername) {
      return { error: "Username is required" };
    }

    if (normalizedUsername.length < 2 || normalizedUsername.length > 30) {
      return { error: "Username must be between 2 and 30 characters" };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(normalizedUsername)) {
      return { error: "Username can only contain letters, numbers, underscores, and hyphens" };
    }

    // Create auth user
    const supabaseAuth = await createSupabaseAuthClient();
    const { error: signUpError, data } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: `${process.env.NODE_ENV === "production" ? "https://operon.app" : "http://localhost:3000"}/auth/callback`,
        data: {
          username: normalizedUsername,
        },
      },
    });

    if (signUpError) {
      return { error: signUpError.message };
    }

    if (!data.user) {
      return { error: "Failed to create user" };
    }

    return { success: true, user: data.user };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return { error: message };
  }
}
