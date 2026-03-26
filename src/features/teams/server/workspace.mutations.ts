"use server";

import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseClient } from "@/lib/supabase";

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createWorkspace(formData: {
  name: string;
  description?: string;
  userId?: string;
}) {
  try {
    // Use provided userId (from client), or fetch from Auth0 + Supabase
    let userId = formData.userId;

    if (!userId) {
      userId = await getCurrentUserId();

      if (!userId) {
        return {
          success: false,
          error: "User not found in database",
        };
      }
    }

    const supabase = createSupabaseClient();
    const workspaceCode = generateTeamCode();

    const { data, error } = await supabase
      .from("teams")
      .insert({
        name: formData.name,
        description: formData.description || null,
        code: workspaceCode,
        created_by: userId,
      })
      .select();

    if (error) {
      console.error("createWorkspace failed:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data?.[0],
      message: "Team created successfully!",
    };
  } catch (error) {
    console.error("createWorkspace error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create team",
    };
  }
}
