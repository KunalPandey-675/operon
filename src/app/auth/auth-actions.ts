  "use server";

import { createSupabaseAuthClient } from "@/lib/supabase-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function loginWithEmailPassword(
  emailOrUsername: string,
  password: string
) {
  try {
    const value = emailOrUsername.trim();
    let email = value;

    if (!value.includes("@")) {
      const supabase = await createSupabaseServerClient();
      const { data: user, error: lookupError } = await supabase
        .from("users")
        .select("email")
        .eq("name", value)
        .maybeSingle();

      if (lookupError || !user?.email) {
        return {
          error: "User not found. Please check your username or use email.",
        };
      }
      email = user.email;
    }

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

    if (!normalizedUsername) {
      return { error: "Username is required" };
    }

    if (normalizedUsername.length < 2 || normalizedUsername.length > 30) {
      return { error: "Username must be between 2 and 30 characters" };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(normalizedUsername)) {
      return { error: "Username can only contain letters, numbers, underscores, and hyphens" };
    }

    const supabaseAuth = await createSupabaseAuthClient();
    const { error: signUpError, data } = await supabaseAuth.auth.signUp({
      email: email.trim(),
      password,
      options: {
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
