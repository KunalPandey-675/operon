"use server";

import { getCurrentUserId } from "@/lib/current-user";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function addTeamMember(teamId: string, userId: string, role: "manager" | "member") {
  const supabase = await createSupabaseServerClient();

  return supabase.from("team_member").insert({
    team_id: teamId,
    user_id: userId,
    role,
  });
}

export async function createWorkspace(formData: {
  name: string;
  description?: string;
}) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    const supabase = await createSupabaseServerClient();
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

    const createdTeam = data?.[0];
    if (!createdTeam?.id) {
      return {
        success: false,
        error: "Team created but id was not returned",
      };
    }

    const { error: membershipError } = await addTeamMember(createdTeam.id, userId, "manager");

    if (membershipError) {
      await supabase.from("teams").delete().eq("id", createdTeam.id);
      console.error("createWorkspace membership insert failed:", membershipError.message);
      return {
        success: false,
        error: membershipError.message,
      };
    }

    return {
      success: true,
      data: createdTeam,
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

export async function joinWorkspaceByCode(formData: {
  code: string;
}) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    const normalizedCode = formData.code.trim().toUpperCase();
    if (!normalizedCode) {
      return {
        success: false,
        error: "Team code is required",
      };
    }

    const supabase = await createSupabaseServerClient();

    const { data: team, error: teamLookupError } = await supabase
      .from("teams")
      .select("id, name")
      .eq("code", normalizedCode)
      .maybeSingle();

    if (teamLookupError) {
      console.error("joinWorkspaceByCode lookup failed:", teamLookupError.message);
      return {
        success: false,
        error: teamLookupError.message,
      };
    }

    if (!team?.id) {
      return {
        success: false,
        error: "Invalid team code",
      };
    }

    const { error: membershipError } = await addTeamMember(team.id, userId, "member");

    if (membershipError) {
      // Postgres unique violation means user is already in this team.
      if (membershipError.code === "23505") {
        return {
          success: true,
          data: team,
          message: "You are already a member of this team",
        };
      }

      console.error("joinWorkspaceByCode membership insert failed:", membershipError.message);
      return {
        success: false,
        error: membershipError.message,
      };
    }

    return {
      success: true,
      data: team,
      message: "Joined team successfully!",
    };
  } catch (error) {
    console.error("joinWorkspaceByCode error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to join team",
    };
  }
}
